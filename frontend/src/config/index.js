const MODE = import.meta.env.MODE; // 环境变量

export const baseUrl =
  MODE == "development" ? "http://127.0.0.1:7009" : "http://47.106.245.77:7009";
