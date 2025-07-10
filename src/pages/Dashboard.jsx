import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";

function Dashboard({ setIsLoggedIn }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await axios.get(
          "http:127.0.0.1:8000/api/student/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // If the API returns a list of students, take the first one
        if (Array.isArray(response.data) && response.data.length > 0) {
          setStudent(response.data[0]);
        } else if (response.data) {
          // If it returns a single object
          setStudent(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      }
    };

    fetchStudent();
  }, []);

  return (
    <div>
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <h1 className="text-4xl font-extrabold text-primary text-center mt-10">
        Dashboard
      </h1>

      <div className="mt-6 mx-auto w-fit px-6 py-4 rounded-lg bg-blue-950 text-white border border-blue-700 shadow-md text-center text-lg">
        👋 Welcome {student ? student.first_name : "to the Student Management System!"}
      </div>
    </div>
  );
}

export default Dashboard;
