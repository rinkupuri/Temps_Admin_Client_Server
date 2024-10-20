"use client";
import React, { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";

const ProductImageEdit = () => {
  const [image, setImage] = useState<string | ArrayBuffer | null>("");

  // Handle the image drop
  const handleDrop = (e: { preventDefault: () => void; dataTransfer: { files: any[]; }; }) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader?.result);
      reader.readAsDataURL(file);
    }
  };

  // Prevent the default behavior on drag over
  const handleDragOver = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  };

  // Handle the image upload from the file input
  const handleImageUpload = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="image-upload-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        width: "300px",
        height: "300px",
        border: "2px dashed #ccc",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {image ? (
        <>
          <img
            src={image}
            alt="Uploaded"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <label
            htmlFor="fileInput"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#ffffff",
              borderRadius: "50%",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaPencilAlt color="#000" />
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </>
      ) : (
        <p style={{ textAlign: "center", color: "#999", marginTop: "40%" }}>
          Drag and drop an image here
        </p>
      )}
    </div>
  );
};

export default ProductImageEdit;
