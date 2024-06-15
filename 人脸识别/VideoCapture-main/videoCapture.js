class VideoCapture {
  /**video标签 */
  video
  /**调试用的输出回调 */
  msgHandle
  /**是否正在录制，当正在录制时，无法再次点击录制 */
  recording
  /**视频轨道，用于停止捕获 */
  mediaTrack
  /**视频录制器 */
  recorder
  /**录制的所有数据 类型为Blob */
  videoData

  /**录制成功的回调 */
  onstart
  /**录制失败的回调 */
  onstop

  constructor(video, msgHandle) {
    // 判断是否是原生的Video标签，如果不是则默认它是uniapp的Video组件
    if (video.constructor === HTMLVideoElement) {
      this.video = video
    } else {
      this.video = video.$el.children[0].children[0]
    }
    this.msgHandle = msgHandle
    this._initAttr()
    this._initGetUserMedia()
    this.recording = false
  }

  _debug(msg, success) {
    const status = success ? '成功' : '失败'
    msg = msg + "===>" + status
    this.msgHandle && this.msgHandle(msg)
  }

  /**
   * 等待一定时间后才往下执行，需要配合await使用
   */
  sleep(time = 0) {
    return new Promise(res => {
      setTimeout(() => {
        this._debug('【VideoCapture】休眠' + time + 'ms', true)
        res()
      }, time);
    })
  }

  /**
   * 兼容IOS与微信的小窗播放
   * 
   * 兼容X5内核video顶层渲染
   */
  _initAttr() {
    this.video.setAttribute('muted', true)
    // 兼容IOS与微信的小窗播放
    this.video.setAttribute('webkit-playsinline', true)
    this.video.setAttribute('playsinline', true)
    // 兼容微信video同层渲染
    // 不要与x5-playsinline同时存在
    this.video.setAttribute('x5-video-player-type', 'h5-page')
    this._debug('【VideoCapture】设置video兼容性', true)
  }

  /**
   * 给API设置兼容性，不同浏览器的调用方式不同
   */
  _initGetUserMedia() {
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    }
    const success = !!navigator.mediaDevices.getUserMedia
    this._debug('【VideoCapture】设置getUserMedia兼容性', success)
  }

  async start() {
    if (!this.recording) {
      try {
        this.recording = true
        // 不开启声音，并且强制使用前置摄像头
        const options = { audio: false, video: { facingMode: 'user' } };
        const stream = await navigator.mediaDevices.getUserMedia(options)
        this.mediaTrack = stream.getTracks()[0]
        if ('srcObject' in this.video) {
          this.video.srcObject = stream
        } else {
          this.video.src = window.URL && window.URL.createObjectURL(stream) || stream
        }
        // captureStream IOS 不支持
        // const mediaStream = this.video.captureStream(25)
        this.recorder = new MediaRecorder(stream)
        // live：正在提供视频实时数据（已打开） | eneded：已不再提供数据（已关闭）
        // inactive：录制未开始或者已结束 | recording：正在录制 | paused：录制已暂停
        this._debug('【VideoCapture】获取视频流与录制器', true)
      } catch (error) {
        this._debug('【VideoCapture】获取视频流与录制器' + error, false)
      }

      const success_1 = this.mediaTrack.readyState === 'live' && this.recorder.state === 'inactive'
      if (success_1) {
        try {
          this.video.play()
          this.recorder.start()
          const success_2 = this.mediaTrack.readyState === 'live' && this.recorder.state === 'recording'
          this._debug('【VideoCapture】开始录制', success_2)
          if (success_2) {
            this.onstart && this.onstart()
          }
        } catch (error) {
          this._debug('【VideoCapture】开始录制' + error, false)
        }
      }
    }
  }

  async stop() {
    if (this.recording) {
      this.recording = false
      this.mediaTrack && this.mediaTrack.stop()
      this.recorder.stop()
      this.recorder.ondataavailable = e => {
        let chunks = []
        chunks.push(e.data)
        this.videoData = new Blob(chunks, { type: "video/mp4" })
        const success = this.mediaTrack.readyState === 'ended' && this.recorder.state === 'inactive'
        this._debug('【VideoCapture】结束录制', success)
        if (success) {
          this.onstop && this.onstop()
        }
      }
    }
  }

  getFile() {
    try {
      const fileName = new Date().getTime() + '.mp4'
      const file = new File([this.videoData], fileName, {
        type: "video/mp4"
      })
      this._debug('【VideoCapture】获取录制文件', true)
      return file
    } catch (error) {
      this._debug('【VideoCapture】获取录制文件' + error, false)
    }
  }

  downloadFile() {
    try {
      const url = window.URL.createObjectURL(this.videoData);
      const a = document.createElement('a')
      const fileName = new Date().getTime() + '.mp4'
      a.download = fileName;
      a.href = url;
      a.click()
      this._debug('【VideoCapture】下载录制文件', true)
    } catch (error) {
      this._debug('【VideoCapture】下载录制文件' + error, false)
    }
  }
}