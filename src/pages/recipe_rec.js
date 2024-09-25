// make instructions indented -> maybe pass through array and map
// make food names look clickable.
// random recipes pulling up before generate is clicked.
// feedback loop.
// make loading in recommendation signs when recommendations are being pulled.

import React from "react";
import "../app/globals.css";
import { useState, useEffect } from "react";

const RecipeRec = () => {
  const [ingredientList, setIngredientList] = useState([]);
  const [quantityList, setQuantityList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [servings, setServings] = useState(1);
  const [cuisineType, setCuisineType] = useState("-");
  const [cookTime, setCookTime] = useState(30);
  const [allergies, setAllergies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const units = [
    "unit",
    "pcs",
    "lb",
    "oz",
    "g",
    "kg",
    "ml",
    "l",
    "cup",
    "tbsp",
    "tsp",
    "floz",
  ]; //look for more common measurements
  const cuisineList = [
    "-",
    "Italian",
    "Chinese",
    "Mexican",
    "Japanese",
    "Indian",
    "French",
    "Thai",
    "American",
    "Spanish",
    "Greek",
    "Middle Eastern",
    "Korean",
    "Vietnamese",
    "Brazilian",
    "Turkish",
    "Moroccan",
    "Carribean",
    "Ethiopian",
    "German",
    "Peruvian",
  ];
  const [allergyInput, setAllergyInput] = useState("");
  const [generateClicked, setGenerateClicked] = useState(1);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setIngredientInput(value);
  };

  const handleSubmitIngredient = (e) => {
    e.preventDefault();
    console.log("New Ingredient:", ingredientInput);

    // Use functional updates to ensure you're working with the most recent state
    setIngredientList((prevState) => {
      const newIngredientList = [ingredientInput.toLowerCase(), ...prevState];
      console.log("Updated Ingredient List:", newIngredientList); // Log the updated list
      return newIngredientList;
    });

    setQuantityList((prevState) => {
      const newQuantityList = [1, ...prevState];
      console.log("Updated Quantity List:", newQuantityList); // Log the updated list
      return newQuantityList;
    });

    setUnitList((prevState) => {
      const newUnitList = ["unit", ...prevState];
      console.log("Updated Unit List:", newUnitList); // Log the updated list
      return newUnitList;
    });

    setIngredientInput(""); // Clear the input field
  };

  const handleQuantityChange = (index, e) => {
    const updatedQuantities = [...quantityList];
    updatedQuantities[index] = e.target.value;
    setQuantityList(updatedQuantities);
  };

  const handleUnitChange = (index, e) => {
    const updatedUnits = [...unitList];
    updatedUnits[index] = e.target.value;
    // updatedUnits[index].toString();
    console.log(updatedUnits[index]);
    setUnitList(updatedUnits);
  };

  const handleRemove = (index) => {
    setIngredientList((prevState) => prevState.filter((_, i) => i != index));
    setQuantityList((prevState) => prevState.filter((_, i) => i != index));
    setUnitList((prevState) => prevState.filter((_, i) => i != index));
    // filter(_, i) -> _ represents the current value, i represents the index it is at.
  };

  const handleServingsChange = (e) => {
    setServings(e.target.value);
  };

  const handleCuisineTypeChange = (e) => {
    setCuisineType(e.target.value);
  };

  const handleCookTimeChange = (e) => {
    setCookTime(e.target.value);
  };

  const handleAllergiesChange = (e) => {
    setAllergyInput(e.target.value);
  };

  const handleAllergySubmit = (e) => {
    e.preventDefault();
    setAllergies((prevState) => {
      const newAllergies = [allergyInput, ...prevState];
      console.log("new Allergies:", newAllergies);
      return newAllergies;
    });
    setAllergyInput("");
  };

  const handleRemoveAllergy = (index) => {
    setAllergies((prevState) => prevState.filter((_, i) => i != index));
  };

  const handleGenerateClicked = () => {
    setGenerateClicked(-1 * generateClicked);
  };

  useEffect(() => {
    const postInput = () => {
      const postData = {
        ingredientsInput: ingredientList,
        quantityInput: quantityList,
        unitInput: unitList,
        servingsInput: servings,
        cookTimeInput: cookTime,
        cuisineTypeInput: cuisineType,
        allergiesInput: allergies,
      };
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe_recommendation_input`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data["response"])) {
            setRecommendations(data["response"]);
          } else {
            console.warn("Expected array but got:", data["response"]);
            setRecommendations([]); // Set to empty if not an array
          }
          console.log(data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    };
    postInput();
  }, [generateClicked]);

  // Overlay showing cooking instructions if name is clicked.
  const [clickedIndex, setClickedIndex] = useState(-1);

  const handleClickIndex = (index) => {
    setClickedIndex(index);
  };

  const closeRecipeOverlay = () => {
    setClickedIndex(-1);
  };

  return (
    <div className="flex flex-col item-center justify-center">
      {/* Container for the header and the rest of the website */}
      <h1 className="header text-3xl text-center p-5">
        Recipe Recommendation Generator
      </h1>
      <div className="cookingInstructions overflow-auto">
        {clickedIndex !== -1 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            {/* overlay div */}
            <div className="bg-white p-5 m-10 rounded shadow">
              {/* actual div on the overlay */}
              <ul>
                <div className="flex flex-row">
                  <li className="font-semibold text-lg">
                    {recommendations[clickedIndex]["name"]}
                  </li>
                  <span
                    className="close cursor-pointer ml-auto mr-10"
                    onClick={closeRecipeOverlay}
                  >
                    &times;
                  </span>
                </div>
                <li>Cook Time: {recommendations[clickedIndex]["cook_time"]}</li>
                <li>
                  Ingredients: {recommendations[clickedIndex]["ingredients"]}
                </li>
                <li>{recommendations[clickedIndex]["instructions"]}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row item-center justify-center pb-10">
        {/* Container for left side and right side */}
        <div className="flex flex-col item-center justify-center bg-blue-100 rounded-3xl p-7 mr-4 w-4/12 max-2-4/12">
          {/* Container for ingredients and additional info */}
          <div className="ingredients-list">
            {/* Container for ingredients header, input bullet, and other bullets */}
            <h2 className="ingredient-list-header text-2xl mb-2 underline">
              Ingredients:
            </h2>
            <div className="ingredient-input mr-20">
              <form onSubmit={handleSubmitIngredient}>
                <input
                  className="border blinking-cursor border-gray-300 w-full h-8 mb-2 pl-2"
                  type="text"
                  name="ingredientInput"
                  value={ingredientInput}
                  onChange={handleInputChange}
                />
              </form>
            </div>
            <div className="ingredients-bullets h-40 overflow-auto">
              <ul className="list-disc">
                {ingredientList.map((ingredient, index) => (
                  <li
                    key={index}
                    className="mb-1 flex items-center justify-between"
                  >
                    <span className="mr-1">
                      {index + 1}) {ingredient}
                    </span>
                    <input
                      className="border border-gray-300 p-2 ml-auto mr-2 w-14 h-8 text-right"
                      type="number"
                      value={quantityList[index]}
                      onChange={(e) => handleQuantityChange(index, e)}
                    />
                    <select
                      className="border border-gray-300 p-1 h-8"
                      value={unitList[index]}
                      onChange={(e) => handleUnitChange(index, e)}
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemove(index)}
                      className="ml-2 text-red-500 hover:text-red-700 mr-40"
                      aria-label="Remove"
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="additional-info">
            {/* Container for additional info header, and the additional info input lines */}
            <h2 className="additional-info-header text-2xl mt-5 mb-2 underline">
              Additional Information:
            </h2>
            <div>
              <span>Servings: </span>
              <input
                className="border border-gray-300 p-1 mr-2 w-12 h-8"
                type="number"
                value={servings}
                onChange={handleServingsChange}
              />
            </div>
            <div className="mt-2">
              <span>Type of Cuisine: </span>
              <select
                className="border border-gray-300 p-1 mr-2 h-8"
                value={cuisineType}
                onChange={(e) => handleCuisineTypeChange(e)}
              >
                {cuisineList.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <span>Max Cook Time: </span>
              <input
                className="border border-gray-300 p-1 mr-2 w-12 h-8"
                type="number"
                value={cookTime}
                onChange={handleCookTimeChange}
              />
              <span className="mr-auto"> min</span>
            </div>
            <div className="mt-2">
              <div className="flex flex-row">
                <span>Allergies: </span>
                <form onSubmit={handleAllergySubmit}>
                  <input
                    className="border border-gray-300 blinking-cursor ml-2 h-8 pl-2"
                    type="text"
                    value={allergyInput}
                    onChange={handleAllergiesChange}
                  />
                </form>
              </div>
              <div className="flex flex-wrap max-w-80 space-x-w">
                {allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="mb-1 flex items-center justify-between"
                  >
                    <span>{allergy}</span>
                    <button
                      onClick={() => handleRemoveAllergy(index)}
                      className="ml-1 text-red-500 hover:text-red-700 mr-4"
                      aria-label="Remove"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="mt-10 bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow"
              onClick={handleGenerateClicked}
            >
              Generate
            </button>
          </div>
        </div>
        <div className="right-body bg-blue-100 rounded-3xl p-7 w-3/5 max-w-3/5">
          {/* container for recommendations header and list of recommendations */}
          <h2 className="recommendations-header text-2xl underline">
            Recommendations:
          </h2>
          <div className="recommendations-list overflow-auto">
            <ul>
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <li key={index}>
                    <li
                      onClick={() => handleClickIndex(index)}
                      className="font-semibold text-lg cursor-pointer underline, hover:scale-65 transition-transform duration-200"
                    >
                      {rec["name"]}
                    </li>
                    <ul className="mb-2">
                      <li>Cook Time: {rec["cook_time"]}</li>
                      <li>Ingredients: {rec["ingredients"]}</li>
                      {/* <li>Instructions: {rec["instructions"]}</li> */}
                      {/* <li>Source Link: {rec["source"]}</li> */}
                    </ul>
                  </li>
                ))
              ) : (
                <li>Please enter ingredients and click generate.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeRec;
