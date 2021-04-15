// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getTimeStamp } from "./auth";
import router from "@/router";
const TimeOut = 3600; //定义超时时间，3600秒
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, //基础地址
  timeout: 5000 // 超时
}); // 创建一个axios的实例
service.interceptors.request.use(
  function(config) {
    if (store.getters.token) {
      if (IsCheckTimeOut()) {
        store.dispatch("user/exit");
        router.push("/login");
        return Promise.reject(new Error("登陆过期，请重新登陆"));
      }
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`;
    return config;
  },
  function(error) {
    Promise.reject(error);
  }
); // 请求拦截器
service.interceptors.response.use(
  response => {
    const { data, message, success } = response.data;
    if (success) {
      return data;
    } else {
      Message(message);
      return Promise.reject(new Error(message));
    }
  },
  error => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 10002
    ) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      Message.error(error.message);
      store.dispatch("user/exit"); // 登出action 删除token
      router.push("/login");
    } else {
      Message.error(error.message); // 提示错误信息
    }
    return Promise.reject(error);
  }
); // 响应拦截器

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  const currentTime = Date.now(); //当前时间戳
  const timeStamp = getTimeStamp();
  return (currentTime - timeStamp) / 1000 > TimeOut; //当前时间戳除1000等于秒数，减去登陆时候的秒数 = 超时的时间 > 1000
}
export default service; // 导出axios实例
