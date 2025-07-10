
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

export const getStudent = async () => {
  const token = localStorage.getItem("access");
  console.log("Access token being used:", token); // ✅

  if (!token) {
    throw new Error("No access token found in localStorage.");
  }

  const response = await apiConnector("GET", "/student/", null, {
    Authorization: `Bearer ${token}`,
  });

  return response.data;
};


export const uploadPhoto = async (file) => {
  const token = localStorage.getItem("access");

  const formData = new FormData();
  formData.append("user_image", file);

  const response = await apiConnector("POST", "/upload_photo/", formData, {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  });

  return response.data;
};

