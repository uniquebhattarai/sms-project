// src/components/UploadPhoto.jsx
import React, { useState } from "react";
import { uploadPhoto } from "../services/Apis";

const UploadPhoto = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    try {
      await uploadPhoto(file);
      alert("Photo uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 text-center">
      <input type="file" onChange={handleFileChange} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 ml-2 rounded">
        Upload
      </button>
    </form>
  );
};

export default UploadPhoto;
