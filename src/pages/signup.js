// To Do:

// Accomplished today:

import React, { useState } from "react";
import { useRouter } from "next/router";
import "../app/globals.css";
import supabase from "../supabaseClient.js";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [passMatch, setPassMatch] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if passwords match
    if (password !== passwordConf) {
      setPassMatch(false);
      setLoading(false);
      return;
    }

    setPassMatch(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (signInError) {
        setError(signInError.message);
      } else {
        const userId = data.user.id;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/add_user_row`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId }),
        });
        router.push("/recipe_rec");
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 p-3 rounded border focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 p-3 rounded border focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            required
            className="mb-4 p-3 rounded border focus:ring-2 focus:ring-blue-400"
          />
          {!passMatch && (
            <div className="text-sm text-red-500 mb-4">
              Passwords do not match
            </div>
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <div className="mt-4 text-sm text-center">
            Want to login?
            <span
              onClick={() => router.push("/login")}
              className="text-blue-500 underline cursor-pointer ml-1"
            >
              Click Here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
