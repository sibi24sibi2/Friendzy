import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../Api/AuthApi";
import { Link } from "react-router-dom";
import TopNav from "../Components/top-nav";

const SigninForm = () => {
  const {
    login,
    signInWithGoogle,
    error,
    successMessage,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    setLoading(true);
    e.preventDefault();
    login(email, password).finally(() => setLoading(false));
  };


  return (
    <div className="bg-gray-100">
      <TopNav />
      <div className="flex items-center justify-center min-h-screen my-12">
        <div className="bg-white p-8 rounded-lg shadow-lg w-5/6 max-w-md">
          {/* LinkedIn Logo */}
          <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">Sign In to Friendzy</h1>

          {/* Form Fields */}

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email or Phone</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? (
                <div className="flex justify-center">
                  <div className="w-4 h-4 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link to="/forgot">
                <button
                  type="button"
                  className="text-blue-700 text-sm hover:underline"
                >
                  Forgot password?
                </button>
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="w-full border-t border-gray-300"></div>
              <span className="px-2 text-sm text-gray-500">or</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={signInWithGoogle}
            >
              {/* <FontAwesomeIcon icon={faGoogle} className="text-lg mr-2" /> */}
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>

            {/* Footer Text */}
            <p className="text-center text-sm text-gray-500 mt-6">
              New to LinkedIn? <Link to="/signup" className="text-blue-600 font-medium hover:underline">Join now</Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SigninForm;
