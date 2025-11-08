import React, { useEffect } from "react";
import { errorImg } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Api/AuthApi";

export const ErrorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to '/' after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    // Clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <img src={errorImg} alt="" />
        <p className="font-semibold text-base text-center my-5">
          The page does not exist
        </p>
        <p className="text-blue-600 text-sm">
          Please check your URL or return to LinkedIn home.
        </p>
        <Link to='/'>
          <div className="flex">
            <button className="mx-auto rounded-full border border-blue-500 p-1 px-3 text-blue-800 font-semibold my-10">
              {user ? 'Go to feed ' : 'Return to signup'}
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;