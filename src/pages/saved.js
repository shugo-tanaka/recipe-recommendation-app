// page that lists out items that have been saved.
// pulls from supabase table.

// Completed:
// Need to use endpoint thats being developed to populate this page with saved recipes in similar format as the recipe rec page. If none is saved, put something that says need to save recipes for this page to populate.

// To Do:
// need to create unsave button
// need to create rating system

import React from "react";
import "../app/globals.css";
import { useState, useEffect } from "react";
// import { createClient } from "@supabase/supabase-js";
import supabase from "../supabaseClient.js";
import StarRating from "../app/starRating.js";

const RecipeRec = () => {
  const [UUID, setUUID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const [clickedIndex, setClickedIndex] = useState(-1);

  const handleClickIndex = (index) => {
    setClickedIndex(index);
  };

  const closeRecipeOverlay = () => {
    setClickedIndex(-1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user["id"]);
      setUUID(user["id"]);
      setLoading(false);
    };
    fetchUser();
    // need to access back end end point to pull recepies here based off of uuid returned by fetch user.
  }, []);

  useEffect(() => {
    //   e.preventDefault();
    // console.log(recipeToSave);
    // console.log(exportData);
    console.log(UUID);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetch_saved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: UUID }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend if needed
        console.log(data.saved);
        if (data.saved && Array.isArray(data.saved[1])) {
          setSavedRecipes(data.saved[1]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [UUID]);

  const [rating, setRating] = useState(null);

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="flex flex-col item-center justify-center">
      <div className="cookingInstructions overflow-auto">
        {/* Container for overlay when dish name is clicked. Pulls up details. */}
        {clickedIndex !== -1 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            {/* overlay div */}
            <div className="bg-white p-5 m-10 rounded shadow">
              {/* actual div on the overlay */}
              <div>
                <div className="flex flex-row">
                  <div className="font-semibold text-lg mb-2 underline mr-5">
                    {savedRecipes[clickedIndex]["name"]}
                  </div>
                  <StarRating onRating={handleRating} />
                  <span
                    className="close cursor-pointer ml-auto mr-10"
                    onClick={closeRecipeOverlay}
                  >
                    &times;
                  </span>
                </div>
                <div className="mb-2">
                  Cook Time: {savedRecipes[clickedIndex]["cook_time"]}
                </div>
                <div className="mb-2">
                  Ingredients: {savedRecipes[clickedIndex]["ingredients"]}
                </div>
                <div>Instructions:</div>

                <ul className="instructions-list">
                  {savedRecipes[clickedIndex]["instructions"].map(
                    (rec, index) => (
                      <li key={index}>
                        {index + 1}) {rec}
                      </li>
                    )
                  )}
                </ul>

                {/* <li>{recommendations[clickedIndex]["instructions"]}</li> */}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="right-body bg-blue-100 rounded-3xl p-7 mx-96 mt-10 flex flex-col justify-center item-center">
        {/* container for recommendations header and list of recommendations */}
        <h2 className="recommendations-header text-2xl  mb-2 text-center">
          Saved Recipes:
        </h2>
        <div className="recommendations-list min-h-3/5 overflow-auto">
          <ul>
            {savedRecipes ? (
              <div>
                {loading ? (
                  <div className="flex items-center justify-center mt-5 mb-5">
                    {/* Loading spinner */}
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  savedRecipes.map((rec, index) => (
                    <li key={index}>
                      <li
                        onClick={() => handleClickIndex(index)}
                        className="font-bold text-bold text-blue-500 underline hover:text-blue-700 cursor-pointer transition-colors duration-200"
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
                )}
              </div>
            ) : (
              <li>
                Save recipes through the Recipe Recommendations Generator Page
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeRec;
