"use client";

import { useState } from "react";

const Parkinsons = () => {
  const [formData, setFormData] = useState({
    "MDVP:Fo(Hz)": "",
    "MDVP:Fhi(Hz)": "",
    "MDVP:Flo(Hz)": "",
    "MDVP:Jitter(%)": "",
    "MDVP:Jitter(Abs)": "",
    "MDVP:RAP": "",
    "MDVP:PPQ": "",
    "Jitter:DDP": "",
    "MDVP:Shimmer": "",
    "MDVP:Shimmer(dB)": "",
    "Shimmer:APQ3": "",
    "Shimmer:APQ5": "",
    "MDVP:APQ": "",
    "Shimmer:DDA": "",
    NHR: "",
    HNR: "",
    RPDE: "",
    DFA: "",
    spread1: "",
    spread2: "",
    D2: "",
    PPE: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/parkinsons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const autofillData = () => {
    setFormData({
      "MDVP:Fo(Hz)": "119.99200",
      "MDVP:Fhi(Hz)": "157.30200",
      "MDVP:Flo(Hz)": "74.99700",
      "MDVP:Jitter(%)": "0.00784",
      "MDVP:Jitter(Abs)": "0.00007",
      "MDVP:RAP": "0.00370",
      "MDVP:PPQ": "0.00554",
      "Jitter:DDP": "0.01109",
      "MDVP:Shimmer": "0.04374",
      "MDVP:Shimmer(dB)": "0.42600",
      "Shimmer:APQ3": "0.02182",
      "Shimmer:APQ5": "0.03130",
      "MDVP:APQ": "0.02971",
      "Shimmer:DDA": "0.06545",
      NHR: "0.02211",
      HNR: "21.03300",
      RPDE: "0.414783",
      DFA: "0.815285",
      spread1: "-4.813031",
      spread2: "0.266482",
      D2: "2.301442",
      PPE: "0.284654",
    });
  };

  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          <span className="text-blue-500">
            Parkinson's <br />
          </span>
          Disease Predictor
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Fill in the required details to check for Parkinson's disease.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {Object.keys(formData).map((field, index) => (
              <div key={index}>
                <input
                  type="number"
                  step="any"
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

          <div className="flex flex-col items-center justify-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              {loading ? "Predicting..." : "Predict"}
            </button>

            <button
              type="button"
              onClick={autofillData}
              className="py-2 px-4 text-white bg-gray-500 rounded-md"
            >
              Autofill Test Data
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {result && (
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <h4 className="font-semibold text-lg">Prediction Result:</h4>
                <p>{JSON.stringify(result)}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Parkinsons;
