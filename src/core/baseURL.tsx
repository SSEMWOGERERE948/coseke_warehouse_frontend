import axios from "axios";
import { getTokenFromSessionStorage } from "../utils/helpers";

export const baseApi = `https://${window.location.hostname}:8080/api/v1/`;

export const AxiosInstance = axios.create({
  baseURL: baseApi,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromSessionStorage(),
      authorization = `Bearer ${token}`,
      contentType = "application/json";

    if (token) {
      config.headers["Authorization"] = authorization;
      config.headers["Content-Type"] = contentType;
    } else config.headers["Content-Type"] = contentType;
    return config;
  },
  (error) => Promise.reject(error),
);
