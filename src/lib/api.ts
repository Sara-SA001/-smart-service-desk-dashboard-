import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://62.171.153.198:18473",
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// لو عايز timeout أطول للـ uploads بس
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.timeout = 120000; // 2 دقيقة للرفع
  }
  return config;
});

export default api;