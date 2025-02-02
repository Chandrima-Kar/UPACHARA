import React from "react";

const AlternativeDrug = ({ medicines, predictionText }) => {
  return (
    <div>
      {/* Heading */}
      <section>
        <h2>Alternative Drug</h2>
      </section>

      {/* About Us Section */}
      <section>
        <h2>Find Your Medicine Alternatives</h2>
        <ul>
          <li>Can't find your emergency medicine here? Don't worry!</li>
          <li>
            Simply enter the name of your medication, and we'll quickly provide
            you with safe and effective alternatives.
          </li>
          <li>
            Our service ensures you always have access to the treatments you
            need, even in urgent situations.
          </li>
          <li>
            Stay prepared and stay healthy with our reliable medication
            alternative finder.
          </li>
          <li>Your well-being is our priority!</li>
        </ul>

        <form action="/alternativedrug" method="POST">
          <label htmlFor="medicine">Select a medicine:</label>
          <select id="medicine" name="medicine">
            {medicines.map((drugName) => (
              <option key={drugName} value={drugName}>
                {drugName}
              </option>
            ))}
          </select>
          <button type="submit">Predict</button>
        </form>

        {predictionText && (
          <div>
            <h2>Recommended Medicines</h2>
            <div>
              {predictionText.map((medicine) => (
                <div key={medicine.medicine_name}>
                  <p>{medicine.medicine_name}</p>
                  <a
                    href={medicine.pharmeasy_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy from PharmEasy
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AlternativeDrug;
