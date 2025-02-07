import React from "react";

const BreastCancerPredictor = () => {
  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Breast Cancer <br /> <span className="text-blue-500">Predictor</span>
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Fill in the required details to check for Breast Cancer.
        </p>
      </div>
      <div className="w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "radius_mean",
              "texture_mean",
              "perimeter_mean",
              "area_mean",
              "smoothness_mean",
              "compactness_mean",
              "concavity_mean",
              "concave_points_mean",
              "symmetry_mean",
              "radius_se",
              "perimeter_se",
              "area_se",
              "compactness_se",
              "concavity_se",
              "concave_points_se",
              "fractal_dimension_se",
              "radius_worst",
              "texture_worst",
              "perimeter_worst",
              "area_worst",
              "smoothness_worst",
              "compactness_worst",
              "concavity_worst",
              "concave_points_worst",
              "symmetry_worst",
              "fractal_dimension_worst",
            ].map((field, index) => (
              <div key={index}>
                <input
                  type="text"
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

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              Predict
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BreastCancerPredictor;
