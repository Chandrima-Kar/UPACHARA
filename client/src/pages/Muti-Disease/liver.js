import React from "react";

const LiverDiseasePredictor = ({ predictionTextLiver }) => {
  return (
    <div>
      {/* Heading Section */}
      <div>
        <h2>Take Charge of Your Liver Health</h2>
        <p>
          Proactively manage your liver health with our Liver Disease Prediction
          technology. Utilizing advanced algorithms, our system evaluates
          essential health markers, offering an early indication of potential
          liver issues. Early detection allows you to make informed choices and
          implement preventive measures to protect your liver. Start your
          journey towards a healthier liver and a brighter future with our
          reliable prediction tool.
        </p>
      </div>

      {/* Form Section */}
      <div>
        <h2>Fill Your Information Here:</h2>
        <h5>Liver Disease Predictor</h5>
        <form action="/liver" method="POST">
          <div>
            <div>
              <input type="text" name="age" placeholder="Age" />
            </div>
            <div>
              <input
                type="text"
                name="tot_bilirubin"
                placeholder="Total Bilirubin"
              />
            </div>
            <div>
              <input
                type="text"
                name="direct_bilirubin"
                placeholder="Direct Bilirubin"
              />
            </div>
            <div>
              <input
                type="text"
                name="ag_ratio"
                placeholder="Albumin/Globulin Ratio"
              />
            </div>
            <div>
              <input
                type="text"
                name="sgpt"
                placeholder="SGPT (Serum Glutamate Pyruvate Transaminase)"
              />
            </div>
            <div>
              <input
                type="text"
                name="sgot"
                placeholder="SGOT (Serum Glutamic-Oxaloacetic Transaminase)"
              />
            </div>
            <div>
              <input
                type="text"
                name="tot_proteins"
                placeholder="Total Proteins"
              />
            </div>
            <div>
              <input type="text" name="albumin" placeholder="Albumin" />
            </div>
            <div>
              <input
                type="text"
                name="alkphos"
                placeholder="Alkaline Phosphatase"
              />
            </div>
            <div>
              <select name="gender">
                <option value="" disabled selected>
                  Gender
                </option>
                <option value="1">Male</option>
                <option value="0">Female</option>
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
      {predictionTextLiver !== null && (
        <div>
          {predictionTextLiver === 1 ? (
            <h3>Sorry! Please consult a DOCTOR.</h3>
          ) : (
            <h3>Great! You are HEALTHY.</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default LiverDiseasePredictor;
