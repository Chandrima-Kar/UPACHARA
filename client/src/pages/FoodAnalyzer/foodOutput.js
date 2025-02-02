import React from "react";
import Link from "next/link";

const MealAnalysisResult = ({ response }) => {
  return (
    <div>
      {/* Heading Section */}
      <h1>Meal Analysis Result</h1>
      <div>
        <div>Detailed Analysis:</div>
        <div>
          {/* This is where dynamic content will be inserted */}
          {response}
        </div>
      </div>
      <Link href="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
};

export default MealAnalysisResult;
