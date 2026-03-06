import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nutri_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("nutri_refresh_token");

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/";
          return Promise.reject(error);
        }

        const res = await axios.post(`${BASE_URL}auth/token/refresh/`, {
          refresh: refreshToken,
        });

        if (res.status === 200) {
          localStorage.setItem("nutri_token", res.data.access);

          if (res.data.refresh) {
            localStorage.setItem("nutri_refresh_token", res.data.refresh);
          }

          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
