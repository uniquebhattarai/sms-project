
import { data } from "react-router-dom";
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

export const ClassList = async()=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("GET","/class_list/",null,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch class List:",error);
    throw error;
  }
  
}

export const SubjectList = async(ClassList)=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("GET",`/subject_list/${ClassList}/`,null,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch subject List:",error);
    throw error;
  }
}

export const Assignmentlist = async(ClassList,SubjectList)=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("GET",`/teacher_assignment_list/?classlevel=${ClassList}&subject=${SubjectList}`,null,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch assignments:",error);
    throw error;
  }
}

export const UpdateAssignment = async(id,data)=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("PUT",`/assignments/${id}/update/`,data,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error while updating assignment",error);
    throw error;
  }
}
export const getAssignment = async(id)=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("GET",`/get_assignment_by_id/${id}/`,null,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error while fetching assignment list",error);
    throw error;
  }
}

export const deleteAssignment = async(id)=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("DELETE",`/assignments/${id}/delete/`,null,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error while Deleting assignment",error);
  }
}

export const studentAssignment = async()=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("GET","/assignments/",null,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error while Fetching assignment",error);
  }
}

export const getAttendancelist = async(id)=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("GET",`/get_attendance_detail_by_id/${id}/`,null,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error while fetching attendance list",error);
    throw error;
  }
}
export const getStudentByClass = async(id)=>{
  const token = localStorage.getItem("access");
  try {
    const response = await apiConnector("GET",`/get_student_by_class/${id}`,null,{
      Authorization:`Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error while fetching Student list",error);
    throw error;
  }
}

export const getPerformance = async (studentId) => {
  const token = localStorage.getItem("access");

  if (!token) {
    throw new Error("No access token found in localStorage.");
  }

  const response = await apiConnector(
    "GET",
    `/performance/${studentId}/`,
    null,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return response.data;
};
