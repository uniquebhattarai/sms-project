// src/api/apiConnector.js
import axios from "axios";

// export const BASE_URL = "https://prejjj.pythonanywhere.com/api";

export const BASE_URL = "http://127.0.0.1:8000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const apiConnector = async (method, url, data, headers = {}) => {
  return axiosInstance({
    method,
    url,
    data,
    headers,
  });
};
