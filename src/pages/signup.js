// To Do:

// Accomplished today:
// page routes to recipe recommendation page even if email or password are invalid. Maybe async issue?

import React from "react";
import { useState } from "react";

import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import "../app/globals.css";
import supabase from "../supabaseClient.js";

const SignUpPage = () => {
  const router = useRouter(); // initialize router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordConf, setPasswordConf] = useState("");
  const [passMatch, setPassMatch] = useState(true);
  const [validEmail, setValidEmail] = useState(true);

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    // const checkEmail = () => {
    //   const emailEnd = email.slice(-9).toLowerCase();
    //   if (emailEnd === "gmail.com") {
    //     setValidEmail(true);
    //     return true;
    //   } else if (emailEnd === "yahoo.com") {
    //     setValidEmail(true);
    //     return true;
    //   } else {
    //     setValidEmail(false);
    //     return false;
    //   }
    // };
    const checkPassword = () => {
      if (passwordConf === password) {
        setPassMatch(true);
        return true;
      } else {
        setPassMatch(false);
        setPasswordConf("");
        return false;
      }
    };
    // const tempValidEmail = checkEmail();
    const tempPassMatch = checkPassword();

    // if (tempValidEmail && tempPassMatch) {
    if (tempPassMatch) {
      // const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        setError(error.message);
      } else {
        // Redirect or show a success message
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        router.push("/recipe_rec"); // route accordingly.
        console.log("Signed Up!");
      }
    }
  };

  return (
    <div className="p-20 flex flex-col justify-center items-center">
      <div className="bg-white p-10 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 flex justify-center text-blue-500">
          Sign Up
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 p-2 border"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 p-2 border"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            required
            className="mb-4 p-2 border"
          />
          {!validEmail && (
            <div className="text-sm text-red-500 mb-2">Invalid Email</div>
          )}
          {!passMatch && (
            <div className="text-sm text-red-500 mb-2">
              Passwords do not match
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="p-2 bg-blue-500 text-white">
            Sign Up
          </button>
          <div className="mt-2 text-sm flex justify-center">
            Want to login?
            <a
              href="http://localhost:3000/login"
              class="text-sm underline ml-1"
            >
              Click Here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
