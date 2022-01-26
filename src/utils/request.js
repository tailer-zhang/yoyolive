import axios from "axios";
import { message } from "antd";

export const BASE_URL = process.env.REACT_APP_API;

//创建axios实例
const service = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60 * 1000, //请求超时时间
});

// request拦截器;
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "JWT " + token;
    }
    return config;
  },
  (error) => {
    console.log(error); //bug
    return Promise.reject(error);
  }
);

//response 拦截器
service.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (response.status === 204) {
      return data;
    } else {
      if (data.code !== 200) {
        if (data.code === 404) {
          message.error("信息不存在,请刷新重试");
          return Promise.reject({ message: "信息不存在,请刷新重试" });
        }
        if (data.message === "AuthenticationFailed") {
          localStorage.clear();
          //  eslint-disable-next-line
          setTimeout("window.location.reload()", 1500);
        }
        if (data?.message) message.error(data.message);
        return Promise.reject(data);
      } else {
        return data.data;
      }
    }
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
export default service;
