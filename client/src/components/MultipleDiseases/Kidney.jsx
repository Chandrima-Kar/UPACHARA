"use client";

import React from "react";
import { useState } from "react";

const Kidney = () => {
  const [formData, setFormData] = useState({
    age: "",
    bp: "",
    sg: "",
    al: "",
    su: "",
    rbc: "",
    pc: "",
    pcc: "",
    ba: "",
    bgr: "",
    bu: "",
    sc: "",
    sod: "",
    pot: "",
    hemo: "",
    pcv: "",
    wc: "",
    rc: "",
    htn: "",
    dm: "",
    cad: "",
    appet: "",
    pe: "",
    ane: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState   (null );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/kidney", {
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
          Take Control of Your <br />{" "}
          <span className="text-blue-500">Kidneys:</span> Get Checked
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Fill in your details and check your kidney health status.
        </p>
      </div>
      <div className="w-full max-w-4xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            {[
              "age",
              "bp",
              "sg",
              "al",
              "su",
              "bgr",
              "bu",
              "sc",
              "sod",
              "pot",
              "hemo",
              "pcv",
              "wc",
              "rc",
              "htn",
              "dm",
              "cad",
              "appet",
              "pe",
              "ane",
            ].map((field) => (
              <div key={field}>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  required
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["rbc", "pc", "pcc", "ba"].map((field) => (
              <div key={field}>
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    {field.toUpperCase()}
                  </option>
                  <option value="1">Abnormal</option>
                  <option value="0">Normal</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              {isLoading ? "Processing..." : "Predict"}
            </button>
          </div>
        </form>
      </div>
      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2">Result:</h4>
          <p>{result}</p>
        </div>
      )}
    </section>
  );
};

export default Kidney;
