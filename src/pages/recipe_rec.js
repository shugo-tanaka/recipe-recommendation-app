import React from "react";
import "../app/globals.css";

const RecipeRec = () => {
  return (
    <div className="flex flex-col item-center justify-center">
      {/* Container for the header and the rest of the website */}
      <h1 className="header">Recipe Recommendation Generator</h1>
      <div className="flex flex-row item-center justify center">
        {/* Container for left side and right side */}
        <div className="flex flex-col item-center justify-center">
          {/* Container for ingredients and additional info */}
          <div className="ingredients-list">
            {/* Container for ingredients header, input bullet, and other bullets */}
            <h2 className="ingredient-list-header">Ingredients</h2>
            <div className="ingredient-input"></div>
            <div className="ingredients-bullets"></div>
          </div>
          <div className="additional-info">
            {/* Container for additional info header, and the additional info input lines */}
            <h2 className="additional-info-header">Additional Information</h2>
          </div>
        </div>
        <div className="right-body">
          {/* container for recommendations header and list of recommendations */}
          <h2 className="recommendations-header">Recommendations</h2>
        </div>
      </div>
    </div>
  );
};

export default RecipeRec;
