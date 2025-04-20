
import { Route, Routes, Navigate } from "react-router-dom";

import { useAuth } from "./Api/AuthApi";

import LandingPage from "./Pages/LandingPage";
import AboutUs from "./Pages/Aboutus";
import ContactUs from "./Pages/Contactus";
import SignupForm from "./Pages/SignupForm";
import SigninForm from "./Pages/SigninForm";
import ForgotPasswordForm from "./Pages/ForgotPasswordForm";
import ErrorPage from "./Pages/ErrorPage";

import { useEffect, useState } from "react";

import Layout from "./Pages/layout";
import MainLoading from "./Components/LoadingComponents/MainLoading";



function App() {
  const { currentUser ,isLoading } = useAuth();


//   LOL
// } 85R * _4t7 % Mt7RjM{tSV @M_kC

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <MainLoading/>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {currentUser ? (
          <>
            <Route path="/*" element={<Layout />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/signin" element={<SigninForm />} />
            <Route path="/forgot" element={<ForgotPasswordForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        <Route path="/error" element={<ErrorPage />} />
      </Routes>

    </>

  );
}

export default App;
