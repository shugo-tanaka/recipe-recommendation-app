import React from "react";
import { useState } from "react";

import { useRouter } from "next/router";
import "../app/globals.css";
import supabase from "../supabaseClient.js";

const LoginPage = () => {
  const router = useRouter(); // initialize router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Function to handle login
  const handleLogin = async (e) => {
    // const supabase = createClient(supabaseUrl, supabaseAnonKey);
    e.preventDefault();
    console.log(supabase);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Redirect or show a success message
      router.push("/recipe_rec"); // route accordingly.
      console.log("Logged in!");
    }
  };

  const handleSignUp = async (e) => {
    router.push("/signup");
  };

  return (
    <div className="p-20 flex flex-col justify-center items-center">
      <div className="bg-white p-10 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 flex justify-center text-blue-500">
          Login
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
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="p-2 bg-blue-500 text-white">
            Login
          </button>
          <div className="mt-2 text-sm flex justify-center">
            Need and account?
            <a
              href="http://localhost:3000/signup"
              className="text-sm underline ml-1"
            >
              SIGN UP
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
