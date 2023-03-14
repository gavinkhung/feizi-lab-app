import { useState } from "react";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { auth, provider } from "../lib/firebase";

import PublicRoute from "@/components/PublicRoute";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSignIn(e) {
    e.preventDefault();
    setError("");
    if (email.trim() === "" || password.trim() == "") {
      setError("Invalid email or password.");
      return;
    }
    setLoading(true);
    try {
      console.log(email, password);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  async function onGoogleSignIn(e) {
    e.preventDefault();
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <PublicRoute redirect={"/"}>
      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-md sm:p-6 md:p-8">
        <form className="space-y-6">
          <h5 className="text-xl font-medium text-gray-900">Sign in</h5>
          <div className="">
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-900 text-md"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="tim@apple.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-900 text-md"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md sm:w-auto px-5 py-2.5 text-center "
            onClick={onSignIn}
          >
            {loading ? (
              <span className="flex">
                <svg
                  class="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>{" "}
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>{" "}
                </svg>
                {"Processing..."}
              </span>
            ) : (
              "Sign In"
            )}
          </button>
          <br />
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md sm:w-auto px-5 py-2.5 text-center "
            onClick={onGoogleSignIn}
          >
            Google Sign In
          </button>
          <div className="font-medium text-gray-500 text-md">
            Not registered?{" "}
            <Link href="/signup" className="text-blue-700 hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </div>

      {error && <p className="mt-2 font-bold text-red-600">{error}</p>}
    </PublicRoute>
  );
};

export default SignIn;
