import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    baseURL: window.apiPath,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000 // request timeout
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        // console.log('token', store.getters.token)
        if (store.getters.token) {
            config.headers['Authorization'] = 'Bearer ' + getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data

        // if (res.Bs == '-99') {
        //     Message({
        //         message: res.Message,
        //         type: 'error'
        //     })
        //     return res
        //         // return Promise.reject(new Error(res.Message || '错误'))
        // } else {
        return res
            // }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: '网络异常',
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service