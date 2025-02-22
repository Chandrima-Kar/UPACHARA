"use client";

import { useState, useEffect } from "react";
import symptoms from "../../utils/symptoms.json";
import convertStringList from "@/utils/helper";
import Image from "next/image";
import flaskapi from "@/utils/flaskapi";

export default function DiseasePage() {
  const [formData, setFormData] = useState({
    symptom_1: "",
    symptom_2: "",
    symptom_3: "",
    symptom_4: "",
    message: "",
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchRecommendedDoctors = async (predictedDisease) => {
    try {
      const response = await flaskapi.post("/recommend-doctors", {
        predicted_disease: predictedDisease,
      });
      if (response.status === 200) {
        setRecommendedDoctors(response.data.doctors);
      }
    } catch (error) {
      setError("An error occurred while fetching recommended doctors.");
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log(formData);
    try {
      const { data } = await flaskapi.post("/predict", formData);

      data.myDiet = convertStringList(data.myDiet);
      setPredictionResult(data);

      // Fetch recommended doctors based on the predicted disease
      await fetchRecommendedDoctors(data.predictedDisease);
    } catch (error) {
      setError("An error occurred while fetching the prediction.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }
  console.log(predictionResult);
  return (
    <section className="flex flex-col relative  my-10  items-center justify-center ">
      <div className="absolute inset-0">
        <Image
          src="/patient2.png"
          alt="Commercial Real Estate"
          width={1600}
          height={200}
          className="rounded-3xl drop-shadow-lg opacity-80"
        />
      </div>

      {/* Text Content */}
      <div className="relative mt-16 mx-10 flex flex-col items-center justify-center gap-5 text-black px-6">
        <h1 className="text-3xl sm:text-5xl  text-center  font-montserrat">
          Disease Prediction Using Symptoms
        </h1>
        <p className="font-lato text-gray-800 text-center max-w-3xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
          deserunt neque labore distinctio nostrum eos doloribus consectetur
          fugit ea numquam, ex, hic exercitationem, quod voluptates aliquid
          expedita vitae
        </p>
      </div>

      {/* Form Box */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[250px]  w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Symptom Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num}>
                <select
                  name={`symptom_${num}`}
                  id={`symptom_${num}`}
                  value={formData[`symptom_${num}`]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato sm:text-sm ">
                  <option value="">Select a symptom</option>

                  {/* Sorting the options alphabetically */}
                  {Object.keys(symptoms)
                    .sort((a, b) => a.localeCompare(b)) // Sort in ascending order
                    .map((symptom) => (
                      <option
                        key={symptoms[symptom]}
                        value={symptom}
                        className="overflow-y-auto">
                        {symptom
                          .split("_") // Split words
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) // Capitalize first letter
                          .join(" ")
                          .replace(/_/g, " ")}{" "}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>

          {/* Message Field */}
          <div>
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={
                isLoading ||
                (!formData.symptom_1 &&
                  !formData.symptom_2 &&
                  !formData.symptom_3 &&
                  !formData.symptom_4)
              }
              className={`w-fit py-2 px-4 rounded-md shadow-md font-medium font-ubuntu transition-all duration-500 transform ${
                isLoading ||
                (!formData.symptom_1 &&
                  !formData.symptom_2 &&
                  !formData.symptom_3 &&
                  !formData.symptom_4)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}>
              {isLoading ? "Predicting..." : "Predict"}
            </button>
          </div>
        </form>
      </div>

      <div className="container  mx-auto flex flex-col items-center mt-[37rem]">
        {/* Display Prediction Result if available */}
        {error && (
          <div
            className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {predictionResult && (
          <div className=" bg-blue-50 shadow-xl rounded-lg w-full max-w-[1000px] p-6 flex flex-col gap-5">
            <h3 className="text-3xl font-montserrat text-black text-center">
              ⚕️{predictionResult.predictedDisease}⚕️
            </h3>
            <div className="space-y-6 justify-center">
              <div>
                <h4 className="text-lg font-semibold font-mono text-black mb-2">
                  📙 Description
                </h4>
                <p className="text-gray-700 pl-[2.2rem] font-lato">
                  {predictionResult.disDes}
                </p>
              </div>
              <div className=" grid grid-cols-2 gap-6">
                {[
                  {
                    title: "⚠️ Precautions",
                    items: predictionResult.myPrecautions,
                  },
                  { title: "🏋🏻‍♂️ Workouts", items: predictionResult.myWorkout },
                  { title: "🍽️ Diet", items: predictionResult.myDiet },
                ].map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold font-mono text-black mb-2">
                      {section.title}
                    </h4>
                    <ul className="list-disc pl-[3rem] space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700 font-lato">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-full text-center mb-6">
                <h3 className="text-2xl font-bold font-montserrat text-blue-800">
                  🩺 Recommended Doctors for Your Condition 🩺
                </h3>
                <p className="text-gray-600 font-lato mt-2">
                  Based on your symptoms, here are some highly qualified doctors
                  who can help you.
                </p>
              </div>
              {recommendedDoctors.length > 0 ? (
                recommendedDoctors.map((doc, id) => (
                  <div
                    key={id}
                    className="relative w-full mb-7 h-auto rounded-2xl overflow-hidden shadow-lg blogCards">
                    <img
                      src={doc.image_url}
                      alt={"Doctor Image"}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                    <div className="text-dark_primary_text flex flex-col items-center justify-end gap-3 overflow-hidden left-0 bottom-0 absolute h-full w-full rounded-2xl px-3 py-10 blogCardsContents">
                      <h3 className="text-center text-white font-bold font-playfair text-2xl">
                        Dr. {doc.first_name} {doc.last_name}
                      </h3>

                      <div className="italic text-sm tracking-wider font-playfair">
                        <p className="text-sm text-gray-100">
                          <b>Specialist:</b> {doc.specialization}
                        </p>
                      </div>

                      <a
                        // href={`/blogs/${doc.id}`}
                        className="w-fit py-1 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu cursor-pointer focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110">
                        Send For Review
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center mb-6">
                  <h3 className="text-2xl font-bold font-montserrat text-blue-800">
                    🩺 No Recommended Doctors Found 🩺
                  </h3>
                  <p className="text-gray-600 font-lato mt-2">
                    We couldn't find any doctors matching your condition at the
                    moment. Don't worry! Please check back later or consult a
                    general physician for further assistance.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
