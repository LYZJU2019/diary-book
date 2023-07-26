import axios from "axios";
import { Toast } from "zarm";

const MODE = import.meta.env.MODE; // environment variable

axios.defaults.baseURL =
  MODE == "development" ? "http://127.0.0.1:7009" : "http://47.99.134.126:7009";
axios.defaults.withCredentials = true;
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Authorization"] = `${
  localStorage.getItem("token") || null
}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.response.use((res) => {
  if (typeof res.data !== "object") {
    Toast.show("Server Error!\n");
    return Promise.reject(res);
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg);
    if (res.data.code == 401) {
      window.location.href = "/login";
    }
    if (res.data.code == 413) {
      Toast.show("Image size should be less than 50kb");
    }
    return Promise.reject(res.data);
  }
  return res.data;
});

export default axios;
