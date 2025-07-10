import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { getStudent } from "../services/Apis";
// import UploadPhoto from "../component/UploadPhoto";

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
  console.log("Student object is:", student);
  return (
    <div>
      <Navbar fullName={student?.full_name}  setIsLoggedIn={setIsLoggedIn} />
      {/* <UploadPhoto /> */}
      <h1 className="text-4xl font-extrabold text-primary text-center mt-10">
        Dashboard
      </h1>

      <div className="mt-6 mx-auto w-fit px-6 py-4 rounded-lg bg-blue-950 text-white border border-blue-700 shadow-md text-center text-lg">
      👋 Welcome {student ? student.data.full_name : ""} to the Student Management System!


      </div>
    </div>
  );
}

export default Dashboard;
