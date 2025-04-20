
import { Navigate } from "react-router-dom";

import SigninForm from "../Components/SigninForm";
import SignupForm from "../Components/SignupForm";
import HomePage from "../Pages/HomePage";
import JobForm from "../Components/JobForm";
import JobPage from "../Pages/JobPage";
import { ErorPage } from "../Pages/ErorPage";
import { NetworkPage } from "../Pages/NetworkPage";
// import { ProfilePage } from "../Pages/ProfilePage";
import JobDetail from "../Components/JobDetail";
import ForgotPasswordForm from "../Components/ForgotPasswordForm";
import LandingPage from "../Pages/LandingPage";
import AboutUs from "../Pages/Aboutus";
import ContactUs from "../Pages/Contactus";
import FeedPage from '../new-pages/feed';
import { Layout } from '@components/Layout';









export const routes = [

  // Private Route
  // { path: "/home", element: <HomePage />, protected: true },
  // { path: "/profile", element: <ProfilePage />, protected: true },
  // {
  //   path: "/profilepage/:profileId",
  //   element: <ProfilePage />,
  //   protected: true,
  // },
  // { path: "/jobs", element: <JobPage />, protected: true },
  // {
  //   path: "/jobs/:id",
  //   element: ({ isMobile }) => (isMobile ? <JobDetail /> : <JobPage />),
  //   protected: true,
  // },
  // { path: "/postJob", element: <JobForm />, protected: true },
  // { path: "/connect", element: <NetworkPage />, protected: true },
  // { path: "*", element: <Navigate to="/error" />, protected: true },


  //Public Route
  { path: "/", element: <LandingPage />, protected: false },
  { path: "/about", element: <AboutUs />, protected: false },
  { path: "/contact", element: <ContactUs />, protected: false },
  { path: "/signup", element: <SignupForm />, protected: false },
  { path: "/signin", element: <SigninForm />, protected: false },
  { path: "/forgot", element: <ForgotPasswordForm />, protected: false },
  { path: "/error", element: <ErorPage />, protected: false },
  { path: "*", element: <Navigate to="/error" />, protected: false },


  { path:"/home", element:<Layout/>, protected: true },


            


];
