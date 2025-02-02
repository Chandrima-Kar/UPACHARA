import React from "react";

const DrugResponseForm = () => {
  return (
    <div>
      {/* Heading */}
      <section>
        <h2>Drug Response</h2>
      </section>

      {/* Form Section */}
      <section>
        <h2>Fill Your Information Here</h2>
        <form method="POST">
          <div>
            <div>
              <label htmlFor="name">Drug Name:</label>
              <input type="text" id="name" name="Drug Name" required />
            </div>
            <div>
              <label htmlFor="gender">Gender:</label>
              <select id="gender" name="Gender" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Gay">Gay</option>
                <option value="Lesbian">Lesbian</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>
            <div>
              <label htmlFor="age">Age:</label>
              <input type="number" id="age" name="Age" required />
            </div>
            <div>
              <label htmlFor="bmi">BMI:</label>
              <input type="number" step="0.1" id="bmi" name="BMI" required />
            </div>
            <div>
              <label htmlFor="past_medical_conditions">
                Past Medical Conditions:
              </label>
              <textarea
                id="past_medical_conditions"
                name="Past Medical Conditions"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="existing_health_conditions">
                Existing Health Conditions:
              </label>
              <textarea
                id="existing_health_conditions"
                name="Existing Health Conditions"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="allergies">Allergies:</label>
              <textarea
                id="allergies"
                name="Allergies"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default DrugResponseForm;
