import React from "react";

const HeartDiseasePredictor = ({ predictionText }) => {
  return (
    <div>
      {/* Heading Section */}
      <div>
        <h2>Fill Your Information Here:</h2>
      </div>

      {/* Form Section */}
      <div>
        <h5>Heart Disease Predictor</h5>
        <form action="/heart" method="POST">
          <div>
            <div>
              <input type="number" name="Age" placeholder="Age" required />
            </div>
            <div>
              <select name="Sex" required>
                <option value="">Sex</option>
                <option value="0">Female</option>
                <option value="1">Male</option>
              </select>
            </div>
            <div>
              <select name="ChestPain" required>
                <option value="">Chest Pain Type</option>
                <option value="0">Asymptomatic</option>
                <option value="1">Non-anginal</option>
                <option value="2">Non-typical</option>
                <option value="3">Typical</option>
              </select>
            </div>
            <div>
              <input
                type="number"
                name="RestBP"
                placeholder="Resting Blood Pressure (mm Hg)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="Chol"
                placeholder="Serum Cholesterol (mg/dl)"
                required
              />
            </div>
            <div>
              <select name="Fbs" required>
                <option value="">Fasting Blood Sugar > 120 mg/dl</option>
                <option value="0">False</option>
                <option value="1">True</option>
              </select>
            </div>
            <div>
              <input
                type="number"
                name="RestECG"
                placeholder="Resting ECG Results"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="MaxHR"
                placeholder="Max Heart Rate Achieved"
                required
              />
            </div>
            <div>
              <select name="ExAng" required>
                <option value="">Exercise Induced Angina</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="Oldpeak"
                placeholder="ST Depression Induced by Exercise"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="Slope"
                placeholder="Slope of Peak Exercise ST Segment"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="Ca"
                placeholder="Major Vessels Colored by Fluoroscopy (0-3)"
                required
              />
            </div>
            <div>
              <select name="Thal" required>
                <option value="">Thalassemia</option>
                <option value="0">Fixed</option>
                <option value="1">Normal</option>
                <option value="2">Reversable</option>
              </select>
            </div>
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
            <h3>
              Sorry! Please consult a DOCTOR. You might have Atherosclerotic
              Heart Disease.
            </h3>
          ) : (
            <h3>Great! You are HEALTHY.</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default HeartDiseasePredictor;
