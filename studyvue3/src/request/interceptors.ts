import { request } from "./request"
import { InternalAxiosRequestConfig, AxiosResponse } from "axios"

// 请求拦截
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        config.params = {
            ...config.params,
            timeStamp: Date.now()
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截
request.interceptors.response.use(
    // 2xx 范围内的状态码都会触发该函数。
    (response: AxiosResponse) => {
        return response
    },
    // 超出 2xx 范围的状态码都会触发该函数。
    error => {
        return Promise.reject(error)
    }
)