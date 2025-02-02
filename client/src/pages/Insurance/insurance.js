import React from "react";

const InsurancePricePredictor = ({ insurancePrice }) => {
  return (
    <div>
      {/* Heading Section */}
      <h2>Discover the Future of Proactive Healthcare</h2>
      <p>Fill Your Information Here:</p>

      {/* Form Section */}
      <div>
        <h5>Insurance Policy Price Predictor</h5>
        <form action="/insurance" method="POST">
          <div>
            <div>
              <input type="text" name="age" placeholder="Age" required />
            </div>
            <div>
              <select name="gender" required>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <select name="city" required>
                <option value="">City</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chennai">Chennai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
            <div>
              <select name="occupation" required>
                <option value="">Occupation</option>
                <option value="Not Active">Not Active</option>
                <option value="Active">Active</option>
              </select>
            </div>
            <div>
              <select name="smoking_status" required>
                <option value="">Smoking Status</option>
                <option value="Non-Smoker">Non-smoker</option>
                <option value="Smoker">Smoker</option>
              </select>
            </div>
            <div>
              <select name="alcohol_consumption" required>
                <option value="">Alcohol Consumption</option>
                <option value="None">None</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                name="previous_claims"
                placeholder="Previous Claims"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="income_level"
                placeholder="Income Level"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="past_disease_history"
                placeholder="Past Disease History"
              />
            </div>
            <div>
              <input
                type="text"
                name="family_disease_history"
                placeholder="Family Disease History"
              />
            </div>
            <div>
              <select name="education_level" required>
                <option value="">Education Level</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
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

      {/* Display Insurance Price if available */}
      {insurancePrice !== null && (
        <div>
          <h3>Rs. {insurancePrice} per year</h3>
        </div>
      )}
    </div>
  );
};

export default InsurancePricePredictor;
