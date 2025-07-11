import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { getStudent } from "../services/Apis";

function Dashboard({ setIsLoggedIn }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudent();
        if (Array.isArray(data) && data.length > 0) {
          setStudent(data[0]);
        } else {
          setStudent(data);
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      }
    };

    fetchStudent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <Navbar fullName={student?.data?.full_name} setIsLoggedIn={setIsLoggedIn} />

      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Dashboard
        </h1>

        <div className="max-w-xl mx-auto text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-lg text-gray-800 font-medium">
            👋 Welcome {student ? student.data.full_name : "Student"} to the Student Management System!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
