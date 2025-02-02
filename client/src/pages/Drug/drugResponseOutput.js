import React from "react";

const PotentialSideEffects = ({ data }) => {
  return (
    <div>
      {/* Heading Section */}
      <div>
        <img
          src="https://st4.depositphotos.com/9999814/22105/i/450/depositphotos_221059420-stock-photo-healthcare-people-group-professional-doctor.jpg"
          alt="side effects"
        />
        <h2>Potential Side Effects</h2>
      </div>
      <div>
        {data.map((effect) => (
          <p key={effect.side_effect}>
            <strong> ⦾ {effect.side_effect}:</strong> {effect.description}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PotentialSideEffects;
