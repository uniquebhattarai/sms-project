import React from "react";
import Navbar from "../component/Navbar";

function Dashboard({ setIsLoggedIn }) {
  return (
    <div>
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <h1 className="text-4xl font-extrabold text-primary text-center mt-10">
        Dashboard
      </h1>

      <div className="mt-6 mx-auto w-fit px-6 py-4 rounded-lg bg-blue-950 text-white border border-blue-700 shadow-md text-center text-lg">
        👋 Welcome to the Student Management System!
      </div>
    </div>
  );
}

export default Dashboard;
