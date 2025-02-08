"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ReportPredictionCards = [
  {
    imageN: "/1.png",
    heading: "LIVER",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-reports/liver",
  },
  {
    imageN: "/1.png",
    heading: "KIDNEY",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-reports/kidney",
  },
  {
    imageN: "/1.png",
    heading: "HEART",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-reports/heart",
  },
  {
    imageN: "/1.png",
    heading: "DIABETES",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-reports/diabetes",
  },
  {
    imageN: "/1.png",
    heading: "PARKINSON'S",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-reports/parkinson",
  },
];
const PredictByReports = () => {
  const router = useRouter();

  return (
    <section className="flex flex-col my-16 gap-14 items-center justify-center ">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Predict Your Disease
          <br /> Using <span className=" text-blue-500">
            {" "}
            Medical Report
          </span>{" "}
          Data
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          impedit perspiciatis provident recusandae vero, aspernatur,
          repellendus nostrum sit tenetur sequi laudantium
        </p>
      </div>
      <div className="grid grid-cols-3 max-w-6xl gap-10 items-center justify-center">
        {ReportPredictionCards.map((content, ind) => (
          <div
            key={ind}
            onClick={() => router.push(`${content.link}`)}
            className="flex flex-col items-center justify-center gap-3 border border-blue-400 p-3 rounded-3xl shadow-xl shadow-blue-300 transition-all duration-500 transform hover:scale-105 cursor-pointer "
          >
            <Image
              src={content.imageN}
              alt={content.heading}
              width={300}
              height={200}
              className="rounded-2xl"
            />
            <h1 className=" font-mono text-lg">{content.heading} ➤</h1>
            <p className="font-lato text-gray-600 text-center">
              {content.para}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PredictByReports;

/*

<div className="bg-white mt-6 absolute -bottom-40 h-full shadow-md rounded-lg ">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Fill Your Information Here:
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {["fname", "lname", "phone", "email"].map((field) => (
                  <div key={field}>
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "phone"
                          ? "tel"
                          : "text"
                      }
                      name={field}
                      id={field}
                      placeholder={
                        field.charAt(0).toUpperCase() +
                        field.slice(1).replace("name", " Name")
                      }
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num}>
                    <select
                      name={`symptom_${num}`}
                      id={`symptom_${num}`}
                      value={formData[`symptom_${num}`]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select a symptom</option>
                      {Object.keys(symptoms).map((symptom) => (
                        <option key={symptoms[symptom]} value={symptom}>
                          {symptom.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? "Predicting..." : "Predict"}
                </button>
              </div>
            </form>
          </div>
        </div>

*/
