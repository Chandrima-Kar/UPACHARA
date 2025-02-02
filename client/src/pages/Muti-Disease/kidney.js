import React from "react";

const KidneyDiseasePredictor = ({ predictionText }) => {
  return (
    <div>
      {/* Form Section */}
      <div>
        <h5>Kidney Disease Predictor</h5>
        <form action="/kidney" method="POST">
          <div>
            <div>
              <input type="number" name="age" placeholder="Age" required />
            </div>
            <div>
              <input
                type="number"
                name="bp"
                placeholder="Blood Pressure (bp)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="sg"
                placeholder="Specific Gravity (sg)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="al"
                placeholder="Albumin (al)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="su"
                placeholder="Sugar (su)"
                required
              />
            </div>
            <div>
              <select name="rbc" required>
                <option value="" disabled selected>
                  Red Blood Cells (rbc)
                </option>
                <option value="1">Abnormal</option>
                <option value="0">Normal</option>
              </select>
            </div>
            <div>
              <select name="pc" required>
                <option value="" disabled selected>
                  Pus Cell (pc)
                </option>
                <option value="1">Abnormal</option>
                <option value="0">Normal</option>
              </select>
            </div>
            <div>
              <select name="pcc" required>
                <option value="" disabled selected>
                  Pus Cell Clumps (pcc)
                </option>
                <option value="1">Present</option>
                <option value="0">Not Present</option>
              </select>
            </div>
            <div>
              <select name="ba" required>
                <option value="" disabled selected>
                  Bacteria (ba)
                </option>
                <option value="1">Present</option>
                <option value="0">Not Present</option>
              </select>
            </div>
            <div>
              <input
                type="number"
                name="bgr"
                placeholder="Blood Glucose Random (bgr)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="bu"
                placeholder="Blood Urea (bu)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="sc"
                placeholder="Serum Creatinine (sc)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="sod"
                placeholder="Sodium (sod)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="pot"
                placeholder="Potassium (pot)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="hemo"
                placeholder="Hemoglobin (hemo)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="pcv"
                placeholder="Packed Cell Volume (pcv)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="wc"
                placeholder="White Blood Cell Count (wc)"
                required
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="rc"
                placeholder="Red Blood Cell Count (rc)"
                required
              />
            </div>
            <div>
              <select name="htn" required>
                <option value="" disabled selected>
                  Hypertension (htn)
                </option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div>
              <select name="dm" required>
                <option value="" disabled selected>
                  Diabetes Mellitus (dm)
                </option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div>
              <select name="cad" required>
                <option value="" disabled selected>
                  Coronary Artery Disease (cad)
                </option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div>
              <select name="appet" required>
                <option value="" disabled selected>
                  Appetite (appet)
                </option>
                <option value="1">Good</option>
                <option value="0">Poor</option>
              </select>
            </div>
            <div>
              <select name="pe" required>
                <option value="" disabled selected>
                  Pedal Edema (pe)
                </option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div>
              <select name="ane" required>
                <option value="" disabled selected>
                  Anemia (ane)
                </option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div>
            <button type="submit">Predict</button>
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

export default KidneyDiseasePredictor;
