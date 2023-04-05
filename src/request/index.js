import axios from 'axios'
import store from "../store";
import router from "../router/router";
const request = axios.create({
    baseURL: store.state.backUrl,
    // baseURL: 'http://localhost:80/api',
    timeout: 100000
})

// request 拦截器
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';

    // let usertoken = localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null

    let Authorization = sessionStorage.getItem('Authorization')

    if(Authorization !== null) {
        config.headers['Authorization'] = Authorization
    }

    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
request.interceptors.response.use(
    response => {
        let res = response.data;
        // token失效
        if (res.statusCode === 1) {
            router.replace('/')
            this.$message.error(res.msg)
        }
        response.headers.get()
        // token续租
        if (response.headers.get('Authorization') !== null) {
            sessionStorage.setItem('Authorization', response.headers['Authorization'])
        }
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
        // return response;
    },
    error => {
        return Promise.reject(error)
    }
)


export default async (url = "", data = {}, type = "GET", method = "fetch") => {
    type = type.toUpperCase();

    if (type === "GET") {
        let dataStr = ""; //数据拼接字符串
        Object.keys(data).forEach((key) => {
            dataStr += key + "=" + data[key] + "&";
        });

        if (dataStr !== "") {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
            url = url + "?" + dataStr;
        }
    }
    let r;
    switch (type) {
        case "GET":
            await request.get(url).then((res) => {
                r = res;
            });
            break;
        case "POST":
            await request.post(url, data).then((res) => {
                r = res;
            });
            break;
        case "PUT":
            await request.put(url, data).then((res) => {
                r = res;
            });
            break;
        case "DELETE":
            await request.delete(url).then((res) => {
                r = res;
            });
            break;
        default:
            break;
    }
    return r;
};
