"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const InsurancePage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <section className="flex flex-col mb-16 gap-5 items-center justify-center ">
      <Image
        src="/insuranceBG.png"
        alt="Commercial Real Estate"
        width={1200}
        height={400}
        className="rounded-b-3xl  w-[81rem] h-[25rem] drop-shadow-lg"
      />
      <div className="flex justify-between w-full px-20 gap-20">
        <h1 className="text-5xl  uppercase font-extrabold text-gray-900 font-montserrat">
          Discover the Future of
          <br /> <span className=" text-blue-500"> Proactive Healthcare</span>
        </h1>
        <p className="text-gray-600 font-open_sans max-w-lg text-right">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora
          commodi numquam qui autem asperiores officiis! Eaque enim molestias, a
          nesciunt nobis deserunt
        </p>
      </div>
      <div className="mt-7 w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dropdown Fields */}
            {[
              {
                name: "gender",
                label: "Select Gender",
                options: ["Male", "Female", "Others"],
              },
              {
                name: "city",
                label: "City",
                options: [
                  "Ahmedabad",
                  "Bangalore",
                  "Chandigarh",
                  "Chennai",
                  "Delhi",
                  "Hyderabad",
                  "Kanpur",
                  "Kolkata",
                  "Lucknow",
                  "Mumbai",
                  "Nagpur",
                  "Pune",
                ],
              },
              {
                name: "occupation",
                label: "Occupation",
                options: ["Not Active", "Active"],
              },
              {
                name: "smoking_status",
                label: "Smoking Status",
                options: ["Non-Smoker", "Smoker"],
              },
              {
                name: "alcohol_consumption",
                label: "Alcohol Consumption",
                options: ["None", "Moderate", "High"],
              },
              {
                name: "education_level",
                label: "Education Level",
                options: ["Undergraduate", "Graduate", "Postgraduate"],
              },
            ].map((field, index) => (
              <div key={index}>
                <select
                  name={field.name}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato sm:text-sm"
                >
                  <option value="" disabled selected>
                    {field.label}
                  </option>
                  {field.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Textarea Fields */}
            {[
              "previous_claims",
              "past_disease_history",
              "family_disease_history",
            ].map((field, index) => (
              <div key={index}>
                <textarea
                  name={field}
                  placeholder={field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  required
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              Find Best Insurance Policy
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InsurancePage;
