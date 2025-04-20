import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../Api/AuthApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import TopNav from "../Components/top-nav";


const SignupForm = () => {
  const { signup, signInWithGoogle, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");




  const handleSignup = (e) => {

    e.preventDefault();
    if (password === confPassword) {
      signup(email, password, name)
    } else {
      toast.error("Passwords do not match!")
    }
  };

  const handleGoogleSignup = () => {
    signInWithGoogle();
  };

  return (
    <div className="bg-gray-100">
      <div className="flex items-center justify-center min-h-screen ">
      <TopNav />
        <div className="bg-white p-8 rounded-lg shadow-lg w-5/6  max-w-md  my-28 ">
          <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">Sign Up for Friendzy</h1>



          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? (
                <div className="flex justify-center">
                  <div className="w-4 h-4 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              ) : (
                "Agree to Join"
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-2 text-sm text-gray-500">or</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* <FontAwesomeIcon icon={faGoogle} className="mr-2" /> */}
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/signin" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
