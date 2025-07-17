
import { apiConnector } from "./ApiConnector";

export const login = async (email, password) => {
  const response = await apiConnector("POST", "/login/", {
    email,
    password,
  });
  return response.data;
};



export const getUser = async () => {
  const token = localStorage.getItem("access");

  if (!token) {
    throw new Error("No access token found in localStorage.");
  }

  const response = await apiConnector("GET", "/user/", null, {
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

export const getPhoto = async () => {
  const token = localStorage.getItem("access");

  const response = await apiConnector("GET", "/get_photo/", null, {
    Authorization: `Bearer ${token}`,
  });

  const data = response.data;

  // Attach full image URL
  if (Array.isArray(data) && data.length > 0 && data[0].user_image) {
    data[0].user_image = `https://prejjj.pythonanywhere.com${data[0].user_image}`;
  }

  return data;
};



export const updateUser = async (userData) => {
  const token = localStorage.getItem("access");

  const response = await apiConnector("PUT", "/register/update/", userData, {
    Authorization: `Bearer ${token}`,
  });

  return response.data;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("access");

  const response = await apiConnector("DELETE", "/register/delete/", { id }, {
    Authorization: `Bearer ${token}`,
  });

  return response.data;
};


export const attendanceDetail = async()=>{
  const token = localStorage.getItem("access");
  const response = await apiConnector("GET","/attendance_detail/",null,{
    Authorization:`Bearer ${token}`,
  });

  return response.data;
  
}


export const createAssignment = async(assignmentData)=>{
  const token = localStorage.getItem("access");
 try {
  const response = await apiConnector("POST","/assignments/create/",assignmentData,{
    Authorization: `Bearer ${token}`,
    "Content-Type":"application/json",
  });
  return response.data
 } catch (error) {
  console.error("Error creating Assignment:",error)
 }
  throw error;
}