"use client";
import React, { useState } from "react";

const Brain = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedImage) return; // Prevent submitting without an image

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Checking successfully!");
    }, 2000);
  };

  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Protect Your
          <br /> <span className="text-blue-500">Brain:</span> Get Checked
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          impedit perspiciatis provident recusandae vero, aspernatur,
          repellendus nostrum sit tenetur sequi laudantium.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-10 text-center">
          -- Upload Your Photo Here --
        </h3>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg flex flex-col items-center justify-center gap-3 mx-auto"
        >
          {/* Image Upload Section */}
          <div className="mb-4 text-center transition-all duration-500 transform hover:scale-105">
            {/* Hidden Input Field */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />

            {/* Custom Upload Button */}
            <label
              htmlFor="fileInput"
              className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#bfdbfe] to-[#eff6ff] border border-[#000000] rounded-xl font-ubuntu"
            >
              Choose Your Image
            </label>
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-full object-cover rounded-md shadow"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!selectedImage || isLoading}
              className={`w-fit py-2 px-4 rounded-md shadow-md font-medium font-ubuntu transition-all duration-500 transform ${
                selectedImage
                  ? "bg-blue-500 text-white hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Checking..." : "Check"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Brain;
