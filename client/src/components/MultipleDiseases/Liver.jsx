"use client";

import React from "react";
import { useState } from "react";

const docList = [
  {
    name: "Pratik Biswas",
    specialist: "MBA, Md - Hepatologist",
    number: "+91 7845945778",
    image: "/doctor2.jpg",
  },
  {
    name: "Chandrima Kar",
    specialist: "MBA - Hepatologist",
    number: "+91 7845945778",
    image: "/doctor3.jpg",
  },
  {
    name: "Md. Zaib Reyaz",
    specialist: "MBA, Md - Hepatologist",
    number: "+91 7845945778",
    image: "/doctor5.jpg",
  },
];

const Liver = () => {
  const [formData, setFormData] = useState({
    age: "",
    tot_bilirubin: "",
    direct_bilirubin: "",
    ag_ratio: "",
    sgpt: "",
    sgot: "",
    tot_proteins: "",
    albumin: "",
    alkphos: "",
    gender: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "gender" ? value : value === "" ? "" : parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/liver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Protect Your
          <br /> <span className="text-blue-500">Liver:</span> Get Checked
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Fill in your details and check your liver health status.
        </p>
      </div>
      <div className="w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "age",
              "tot_bilirubin",
              "direct_bilirubin",
              "ag_ratio",
              "sgpt",
              "sgot",
              "tot_proteins",
              "albumin",
              "alkphos",
            ].map((field, index) => (
              <div key={index}>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={field
                    .replace(/_/g, " ")
                    .replace("alkphos", "Alkaline Phosphatase")
                    .replace("age", "Age (years)")
                    .replace(/\w/g, (char) => char.toUpperCase())}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  step="any"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-x-5 font-lato">
            <label className="text-gray-700 font-medium">Select Gender:</label>
            <div className="flex gap-4">
              {["Male", "Female", "Others"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleInputChange}
                    className="w-3 h-3 text-blue-500 focus:ring-blue-700 border-gray-300"
                    required
                  />
                  <span className="text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              {isLoading ? "Processing..." : "Predict"}
            </button>
            {/* <button
              type="button"
              onClick={() =>
                setFormData({
                  age: 38,
                  tot_bilirubin: 2.6,
                  direct_bilirubin: 1.2,
                  ag_ratio: 57,
                  sgpt: 5.6,
                  sgot: 3.3,
                  tot_proteins: 410,
                  albumin: 59,
                  alkphos: 0.8,
                  gender: "Female",
                })
              }
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Autofill Test Data
            </button> */}
          </div>
        </form>
      </div>
      {result !== null && (
        <div className="flex flex-col items-center justify-center max-w-[1100px]">
          <div
            className={`${
              result === 0
                ? "bg-red-200 shadow-red-600"
                : "bg-green-200 shadow-green-600"
            } p-4 max-w-2xl flex flex-col items-center gap-7 rounded-lg shadow-xl `}
          >
            <h4 className="text-3xl font-serif font-semibold ">👉 Result 👈</h4>
            <p className=" text-lg font-lato tracking-wider text-center">
              {result === 0
                ? "😟 The results suggest some concerns with your liver function. Let's not panic, but we need to discuss these results and come up with a plan. Let's schedule a follow-up appointment to discuss these results in more detail and explore the next steps."
                : "😇 Peace of mind: Your liver is functioning perfectly! Stay Connected with us for further health related updates."}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-10 mt-10">
            <h1 className="text-3xl font-bold font-montserrat">
              Recommended Doctors - Hepatologist
            </h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {docList.map((doc, id) => (
                <div
                  key={id}
                  className="relative w-full mb-7 h-auto rounded-2xl overflow-hidden shadow-lg blogCards"
                >
                  <img
                    src={doc.image}
                    alt={"Blog Image"}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                  <div className="text-dark_primary_text flex flex-col items-center justify-end gap-3 overflow-hidden left-0 bottom-0 absolute h-full w-full rounded-2xl px-3 py-10 blogCardsContents">
                    <h3 className="text-center text-white font-bold font-playfair text-2xl">
                      Dr. {doc.name}
                    </h3>

                    <div className="italic text-sm tracking-wider font-playfair">
                      <p className="text-sm text-gray-100">
                        <b>Specialist:</b> {doc.specialist}
                      </p>
                    </div>

                    <a
                      // href={`/blogs/${doc.id}`}
                      className="w-fit py-1 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu cursor-pointer focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
                    >
                      Connect
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Liver;
