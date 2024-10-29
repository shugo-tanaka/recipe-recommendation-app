// page that lists out items that have been saved.
// pulls from supabase table.

// Completed:

// To Do:
// ratings need to be passed to AI so that it can tailor its response. Maybe tailor response if type of cuisine is left blank.
// Only be able to access saved and recipe rec generator if user is signed in.
// hover over the navigation bar.
// consistent formatting -> look at login and sign up page. Make the other two pages similar to this.
// close when clicked outside the Box.

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
  const [recipeRatings, setRecipeRatings] = useState([]);

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
        console.log(data.ratings);
        if (data.saved && Array.isArray(data.saved[1])) {
          setSavedRecipes(data.saved[1]);
          setRecipeRatings(data.ratings);
          const temp = [...data.saved[1]];
          //   temp.splice(0, 1); // first argument is what index to start. Second argument is how many elements from the start index.
          //   console.log("prior to splicing", data.saved[1]);
          //   console.log("after splicing", temp);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [UUID]);

  //   const [rating, setRating] = useState(null);

  const handleRating = (newRating, i) => {
    const temp = [...recipeRatings];
    temp[i] = newRating;
    setRecipeRatings(temp);
    // recipeRatings[i] = newRating;
    // console.log(recipeToSave);
    // console.log(exportData);
    // console.log(UUID);
    // console.log(newRating);
    console.log("these are the ratings before", recipeRatings);
    console.log("these are the ratings after", temp);
    // console.log(recipeRatings);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update_rating`, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${UUID}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: UUID, ratings: temp }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend if needed
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const unsave = (i) => {
    const tempSavedRecipes = [...savedRecipes];
    const tempRecipeRatings = [...recipeRatings];

    tempSavedRecipes.splice(i, 1);
    tempRecipeRatings.splice(i, 1);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/unsave_rec`, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${UUID}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: UUID,
        indexToRemove: i,
        newRatings: tempRecipeRatings,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend if needed
        console.log(data);
        setRecipeRatings(tempRecipeRatings);
        setSavedRecipes(tempSavedRecipes);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex flex-col item-center justify-center">
      <div className="flex flex-row items-center">
        <h1 className="header text-3xl text-center p-5 mr-72">Sous Chef</h1>
        <a href="http://localhost:3000/recipe_rec" className="ml-auto mr-5">
          Recipe Recs
        </a>
        <a href="http://localhost:3000/saved" className="mr-20 underline">
          Saved Recipes
        </a>
      </div>
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
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          cursor: "pointer",
                          color:
                            star <= recipeRatings[clickedIndex]
                              ? "gold"
                              : "grey",
                        }}
                        onClick={() => handleRating(star, clickedIndex)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
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
                      <div className="flex flex-row">
                        <li
                          onClick={() => handleClickIndex(index)}
                          className="font-bold text-bold text-blue-500 underline hover:text-blue-700 cursor-pointer transition-colors duration-200"
                        >
                          {rec["name"]}
                        </li>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 32 32"
                          className="ml-auto"
                          onClick={() => unsave(index)}
                        >
                          <path
                            fill="currentColor"
                            d="M12 12h2v12h-2zm6 0h2v12h-2z"
                          />
                          <path
                            fill="currentColor"
                            d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20zm4-26h8v2h-8z"
                          />
                        </svg>
                      </div>

                      <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              cursor: "pointer",
                              color:
                                star <= recipeRatings[index] ? "gold" : "grey",
                            }}
                            // onClick={() => handleRating(star)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
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
