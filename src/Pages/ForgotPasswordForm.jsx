import React, { useState } from "react";
import { useAuth } from "../Api/AuthApi.jsx";
import { Link } from "react-router-dom";
import { linkedinSmallLogo } from "../assets/assets.js"; // Add logo import

const ForgotPasswordForm = () => {
  const { sendPasswordResetEmail, error, resetMessage } = useAuth();
  const [email, setEmail] = useState("");

  const handlePasswordReset = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(email);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12">
      <div className="flex flex-col items-center mb-8">

        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Reset Your Password</h3>
      </div>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-400 rounded p-2">
            {error}
          </div>
        )}
        {resetMessage && (
          <div className="mb-4 text-green-600 bg-green-100 border border-green-400 rounded p-2">
            {resetMessage}
          </div>
        )}
        <form className="space-y-6" onSubmit={handlePasswordReset}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Reset Link
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
          Remember your password?{" "}
          <Link to="/signin">
            <span className="text-blue-600 hover:underline dark:text-blue-400">Sign in</span>
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
