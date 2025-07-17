import React, { useState } from "react";
import { createAssignment } from "../../services/Apis";
import { Toast } from "../../../utils/Toast";

function AddAssignment({ classes, subjects, selectedClass, setSelectedClass }) {
  const [assignmentdata, setAssignmentData] = useState({
    title: "",
    assignment: "",
    classlevel: selectedClass || "",
    subject: "",
    deadline: "",
    teacher: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleClassChange = (e) => {
    const value = e.target.value;
    setAssignmentData((prev) => ({
      ...prev,
      classlevel: value,
      subject: "", // 
    }));
    setSelectedClass(value); 
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await createAssignment(assignmentdata);
      console.log("Assignment created:", data);
      Toast.success("Assignment Created Successfully");
      setAssignmentData({
        title: "",
        assignment: "",
        classlevel: "",
        subject: "",
        deadline: "",
        teacher: 1,
      });
      setSelectedClass(""); 
    } catch (error) {
      Toast.error("Failed to create Assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Assignment
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={submitHandler}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6"
        >
          {/* Title */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assignment Title
            </label>
            <input
              type="text"
              name="title"
              value={assignmentdata.title}
              onChange={handleChange}
              placeholder="Enter assignment title..."
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-200"
              required
            />
          </div>

          {/* Description */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assignment Description
            </label>
            <textarea
              name="assignment"
              value={assignmentdata.assignment}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the assignment..."
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-200"
              required
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Class
              </label>
              <select
                name="classlevel"
                value={assignmentdata.classlevel}
                onChange={handleClassChange}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl"
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.level}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={assignmentdata.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl"
                required
                disabled={!assignmentdata.classlevel}
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher ID */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teacher ID
              </label>
              <input
                type="number"
                name="teacher"
                value={assignmentdata.teacher}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl"
                required
              />
            </div>

            {/* Deadline */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={assignmentdata.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            }`}
          >
            {isSubmitting ? "Creating Assignment..." : "Create Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAssignment;
