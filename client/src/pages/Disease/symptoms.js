import React from "react";

const DiseasePredictor = ({
  predictedDisease,
  disDes,
  myPrecautions,
  medications,
  myWorkout,
  myDiet,
}) => {
  return (
    <div>
      {/* Heading Section */}
      <div>
        <h2>Fill Your Information Here:</h2>
      </div>

      {/* Form Section */}
      <div>
        <h5>Disease Predictor</h5>
        <form method="POST" action="/predict">
          <div>
            <div>
              <input
                type="text"
                name="fname"
                id="fname"
                placeholder="First Name"
              />
            </div>
            <div>
              <input
                type="text"
                name="lname"
                id="lname"
                placeholder="Last Name"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email"
              />
            </div>
            <div>
              <select name="symptom_1" id="symptom_1">
                <option value="">Select a symptom</option>
                {/* Replace with dynamic symptom options */}
              </select>
            </div>
            <div>
              <select name="symptom_2" id="symptom_2">
                <option value="">Select a symptom</option>
                {/* Replace with dynamic symptom options */}
              </select>
            </div>
            <div>
              <select name="symptom_3" id="symptom_3">
                <option value="">Select a symptom</option>
                {/* Replace with dynamic symptom options */}
              </select>
            </div>
            <div>
              <select name="symptom_4" id="symptom_4">
                <option value="">Select a symptom</option>
                {/* Replace with dynamic symptom options */}
              </select>
            </div>
            <div>
              <textarea placeholder="Message"></textarea>
            </div>
            <div>
              <button type="submit">Predict</button>
            </div>
          </div>
        </form>
      </div>

      {/* Display Prediction Result if available */}
      {predictedDisease && (
        <div>
          <div>
            <h3>{predictedDisease}</h3>
          </div>
          <div>
            <h4>Description</h4>
            <p>{disDes}</p>
          </div>
          <div>
            <h4>Precautions</h4>
            <ul>
              {myPrecautions.map((precaution, index) => (
                <li key={index}>{precaution}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Medications</h4>
            <ul>
              {medications.map((medication, index) => (
                <li key={index}>{medication}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Workouts</h4>
            <ul>
              {myWorkout.map((workout, index) => (
                <li key={index}>{workout}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Diet</h4>
            <ul>
              {myDiet.map((diet, index) => (
                <li key={index}>{diet}</li>
              ))}
            </ul>
          </div>
          <div>
            <a href="/findpatient">Send For Review</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseasePredictor;
