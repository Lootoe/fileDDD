import axios, { AxiosResponse } from 'axios'

/**请求结果接口 */
interface IResponse<T> {
    code: number,
    data?: T,
    msg: string,
    err?: string
}

/**Http请求工具类接口 */
interface IHTTP {
    get<T>(url: string, params?: unknown): Promise<IResponse<T>>,
    post<T>(url: string, params?: unknown): Promise<IResponse<T>>,
    upload<T>(url: string, params: unknown): Promise<IResponse<T>>,
    put<T>(url: string, params: unknown): Promise<IResponse<T>>,
    delete<T>(url: string, params: unknown): Promise<IResponse<T>>,
    download(url: string): void
}


/**
 * 这么设计的原因如下：
 * 1、Http.get<string[]>().then() 拿到的结果是确定的IResponse
 * 2、通过IResponse.data的类型也是确定的 就是传入的string[]
 * 3、示例如下：
 *  
    Http.get<string[]>('/getList', {}).then(res => {
        console.log('res.code', res.code)
        console.log('res.data', res.data)
        console.log('res.err', res.err)
        console.log('res.msg', res.msg)

        const data: string[] | undefined = res.data
        console.log('data', data)
    })
*/


/**Content-Type枚举*/
enum ContentType {
    /**JSON格式 */
    JSON = 'application/json',
    /**如果采用这种编码可以用qs库转换*/
    FORM = 'application/x-www-form-urlencoded',
    /**文件上传的格式*/
    FILE = 'multipart/form-data'
}

// 创建实例
export const request = axios.create({
    baseURL: '',
    timeout: 0,
    withCredentials: true,
    headers: {
        'Content-Type': ContentType.JSON
    },
})

const Http: IHTTP = {
    get(url, params) {
        return new Promise((resolve, reject) => {
            request
                .get(url, { params })
                .then((res: AxiosResponse) => {
                    const data = res.data
                    const result: IResponse<(typeof data.data | any)> = {
                        code: data.code,
                        msg: data.msg,
                        data: data.data
                    }
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                });
        });
    },

    post(url, params) {
        return new Promise((resolve, reject) => {
            request
                .post(url, JSON.stringify(params))
                .then((res) => {
                    const data = res.data
                    const result: IResponse<(typeof data.data | any)> = {
                        code: data.code,
                        msg: data.msg,
                        data: data.data
                    }
                    resolve(result)
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    put(url, params) {
        return new Promise((resolve, reject) => {
            request
                .put(url, JSON.stringify(params))
                .then((res) => {
                    const data = res.data
                    const result: IResponse<(typeof data.data | any)> = {
                        code: data.code,
                        msg: data.msg,
                        data: data.data
                    }
                    resolve(result)
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    delete(url, params) {
        return new Promise((resolve, reject) => {
            request
                .delete(url, { params })
                .then((res) => {
                    const data = res.data
                    const result: IResponse<(typeof data.data | any)> = {
                        code: data.code,
                        msg: data.msg,
                        data: data.data
                    }
                    resolve(result)
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    upload(url, file) {
        return new Promise((resolve, reject) => {
            request
                .post(url, file, {
                    headers: { "Content-Type": ContentType.FILE },
                })
                .then((res) => {
                    const data = res.data
                    const result: IResponse<(typeof data.data | any)> = {
                        code: data.code,
                        msg: data.msg,
                        data: data.data
                    }
                    resolve(result)
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    download(url) {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        iframe.onload = function () {
            document.body.removeChild(iframe);
        };

        document.body.appendChild(iframe);
    },
}

export default Http