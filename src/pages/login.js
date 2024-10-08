import React from "react";
import { useState } from "react";
// import { supabase } from "../supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import "../app/globals.css";

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const LoginPage = () => {
  const router = useRouter(); // initialize router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Function to handle login
  const handleLogin = async (e) => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
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

  return (
    <div className="p-20 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
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
      </form>
    </div>
  );
};

export default LoginPage;
