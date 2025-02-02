import React from "react";

const DiabetesPredictor = ({ predictionText }) => {
  return (
    <div>
      {/* Heading Section */}
      <h2>Take Control of Your Health with Diabetes Prediction</h2>
      <p>
        Our Diabetes Predictor tool helps you monitor your health by analyzing
        key metrics that indicate your risk of diabetes. By entering relevant
        health information, you can receive a prediction about your diabetes
        risk, empowering you to take proactive steps towards maintaining your
        health. Start your health journey with our reliable prediction tool.
      </p>

      {/* Form Section */}
      <h2>Enter Your Health Information Here:</h2>
      <div>
        <h5>Diabetes Predictor</h5>
        <form action="/diabetes" method="POST">
          <div>
            <input
              type="text"
              name="Pregnancies"
              placeholder="Number of Pregnancies (e.g., 0)"
            />
          </div>
          <div>
            <input
              type="text"
              name="Glucose"
              placeholder="Glucose (mg/dL) (e.g., 80)"
            />
          </div>
          <div>
            <input
              type="text"
              name="BloodPressure"
              placeholder="Blood Pressure (mmHg) (e.g., 80)"
            />
          </div>
          <div>
            <input
              type="text"
              name="SkinThickness"
              placeholder="Skin Thickness (mm) (e.g., 20)"
            />
          </div>
          <div>
            <input
              type="text"
              name="Insulin"
              placeholder="Insulin Level (IU/mL) (e.g., 80)"
            />
          </div>
          <div>
            <input
              type="text"
              name="BMI"
              placeholder="Body Mass Index (kg/m²) (e.g., 23.1)"
            />
          </div>
          <div>
            <input
              type="text"
              name="DiabetesPedigreeFunction"
              placeholder="Diabetes Pedigree Function (e.g., 0.52)"
            />
          </div>
          <div>
            <input
              type="text"
              name="Age"
              placeholder="Age (years) (e.g., 34)"
            />
          </div>
          <div>
            <button type="submit" value="Predict">
              Predict
            </button>
          </div>
        </form>
      </div>

      {/* Display Prediction Result if available */}
      {predictionText !== null && (
        <div>
          {predictionText === 1 ? (
            <h3>Sorry! Please consult a DOCTOR.</h3>
          ) : (
            <h3>Great! You are HEALTHY.</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default DiabetesPredictor;
