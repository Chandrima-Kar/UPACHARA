import React from "react";

const FoodAnalyzer = () => {
  return (
    <div>
      {/* Heading Section */}
      <h1>Food Analyzer</h1>
      <p>
        Please upload a photo of your meal and enter any relevant disease
        information to analyze the meal's nutritional value.
      </p>

      {/* Form Section */}
      <form action="/food" method="post" encType="multipart/form-data">
        <label htmlFor="file">Upload a photo of your meal:</label>
        <input type="file" id="file" name="file" accept="image/*" required />

        <label htmlFor="disease">Enter your disease (if any):</label>
        <input type="text" id="disease2" name="disease2" />

        <input type="submit" value="Analyze Meal" />
      </form>
    </div>
  );
};

export default FoodAnalyzer;
