import axios from 'axios'
import router from '../router'
// axios.defaults.withCredentials = true;//配置为true

const server = axios.create({
    baseURL: "https://www.liulongbin.top:8888/api/private/v1/",
    timeout: "5000"
})

//请求拦截器
server.interceptors.request.use((config) => {
    // console.log(config)
    //先获取会话存储中的token，如果有，进行请求头携带token
    const token = sessionStorage.getItem('token')
    if(token){
        config.headers.Authorization = token
    }
    return config
})


//响应拦截器
server.interceptors.response.use((res) => {
    // console.log(res)
    if(res.data.meta.status == 401){
        sessionStorage.removeItem('token')
        router.push('/')
    }
    return res
})

export default server