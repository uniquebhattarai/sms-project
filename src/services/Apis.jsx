
import { apiConnector } from "./ApiConnector";

export const login = async (email, password) => {
  const response = await apiConnector("POST", "/login/", {
    email,
    password,
  });
  return response.data;
};

export const register = async (formData) => {
  const response = await apiConnector("POST", "/register/", formData);
  return response.data;
};
