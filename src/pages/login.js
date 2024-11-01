import React, { useState } from "react";
import { useRouter } from "next/router";
import "../app/globals.css";
import supabase from "../supabaseClient.js";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // show loading spinner
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/recipe_rec");
    }
    setLoading(false); // hide loading spinner
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
          Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col">
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <div className="mt-4 text-sm text-center">
            Need an account?
            <span
              onClick={() => router.push("/signup")}
              className="text-blue-500 underline cursor-pointer ml-1"
            >
              SIGN UP
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
