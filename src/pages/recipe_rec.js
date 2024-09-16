import React from "react";
import "../app/globals.css";
import { useState, useEffect } from "react";

const RecipeRec = () => {
  const [ingredientList, setIngredientList] = useState([]);
  const [quantityList, setQuantityList] = useState([]);
  const [servings, setServings] = useState(1);
  const [cuisineType, setCuisineType] = useState("");
  const [cookTime, setCookTime] = useState(30);
  const [recommendations, setRecommendations] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");

  const handleInputChange = (e) => {
    const { value } = e.target;
    setIngredientInput(value);
  };

  const handleSubmitIngredient = (e) => {
    e.preventDefault();
    console.log("New Ingredient:", ingredientInput);
    setIngredientList((prevState) => [...prevState, ingredientInput]);
    setIngredientInput("");
  };

  return (
    <div className="flex flex-col item-center justify-center">
      {/* Container for the header and the rest of the website */}
      <h1 className="header text-3xl text-center">
        Recipe Recommendation Generator
      </h1>
      <div className="flex flex-row item-center justify-center">
        {/* Container for left side and right side */}
        <div className="flex flex-col item-center justify-center">
          {/* Container for ingredients and additional info */}
          <div className="ingredients-list">
            {/* Container for ingredients header, input bullet, and other bullets */}
            <h2 className="ingredient-list-header text-2xl text-center">
              Ingredients
            </h2>
            <div className="ingredient-input">
              <form onSubmit={handleSubmitIngredient}>
                <input
                  className="border blinking-cursor"
                  type="text"
                  name="ingredientInput"
                  value={ingredientInput}
                  onChange={handleInputChange}
                />
              </form>
            </div>
            <div className="ingredients-bullets">
              <ul className="list-disc pl-5">
                {ingredientList.map((ingredient, index) => (
                  <li key={index} className="mb-1">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="additional-info">
            {/* Container for additional info header, and the additional info input lines */}
            <h2 className="additional-info-header text-2xl text-center">
              Additional Information
            </h2>
          </div>
        </div>
        <div className="right-body">
          {/* container for recommendations header and list of recommendations */}
          <h2 className="recommendations-header text-2xl text-center">
            Recommendations
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RecipeRec;
