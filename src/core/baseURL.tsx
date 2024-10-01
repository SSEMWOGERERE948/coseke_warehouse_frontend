import axios from "axios";
import { getTokenFromSessionStorage } from "../utils/helpers";

export const baseApi = `http://${window.location.hostname}:7000/api/v1/`;

export const AxiosInstance = axios.create({
  baseURL: baseApi,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromSessionStorage(),
      authorization = `Bearer ${JSON.parse(token)}`,
      contentType = "application/json";

    if (token) {
      config.headers["Authorization"] = authorization;
      config.headers["Content-Type"] = contentType;
    } else config.headers["Content-Type"] = contentType;
    return config;
  },
  (error) => Promise.reject(error),
);
