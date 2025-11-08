import linkedinSmallLogo from "/assets/images/logo.png";
import friendzyLogo from "./images/Friendzy_Logo.png";
import linkedinBigLogo from "/assets/images/LinkedIn-Logo.png";
import defaultProfile from "/assets/images/image.jpg";
import defaultCoverImage from "/assets/images/cover2.webp";
import errorImg from "/assets/images/Likedin-error-image.png";
import NoPost from "/assets/images/Screenshot 2024-10-14 221043.png";
import jobLogoPic from "/assets/images/logo.avif";
import postImageError from "/assets/images/error-image-signature.png";

import profilePic_King from "/assets/images/Monkey_Profile (1).jpg";
import profilePic_BlueFunky from "/assets/images/Monkey_Profile (2).jpg";
import profilePic_BrownSkele from "/assets/images/Monkey_Profile (3).jpg";
import profilePic_SquareCap from "/assets/images/Monkey_Profile (5).jpg";
import profilePic_RedCheckeShirt from "/assets/images/Monkey_Profile (6).jpg";
import profilePic_Leopard from "/assets/images/Monkey_Profile (7).jpg";
import profilePic_Royal from "/assets/images/Monkey_Profile (8).jpg";
import profilePic_Devil from "/assets/images/Monkey_Profile (9).jpg";
import profilePic_FunnyHatBatch from "/assets/images/Monkey_Profile (10).jpg";
import profilePic_BasketBallAthelete from "/assets/images/Monkey_Profile (11).jpg";
import profilePic_Normal from "/assets/images/Monkey_Profile (12).jpg";
import profilePic_superman from "/assets/images/Monkey_Profile (13).jpg";
import profilePic_cigar from "/assets/images/Monkey_Profile (14).jpg";
import profilePic_luffy from "/assets/images/Monkey_Profile (16).jpg";

import welcomeImg1 from "./images/Welcome_images (5).png";
import welcomeImg2 from "./images/Welcome_images (1).png";
import welcomeImg3 from "./images/Welcome_images (2).png";
import welcomeImg4 from "./images/Welcome_images (4).png";
import welcomeImg5 from "./images/snapedit_1733303008433.png";
import welcomeImg6 from "./images/demo-data-analysis-07.png";
// Function to format the timestamp
export const formatTimestamp = (timestamp) => {
  const now = new Date();
  const timeDiff = now - timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  // const days = Math.floor(hours / 24);

  // Display "just now" if the time difference is less than 1 minute
  if (seconds < 60) return "just now";

  // Display minutes ago if time is less than an hour
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;

  // Display hours ago if time is less than 24 hours
  if (hours < 24) return `${hours} hr${hours !== 1 ? "s" : ""} ago`;

  // If the timestamp is more than 24 hours ago, show the date in "Weekday, Month Day" format
  const date = new Date(timestamp.toDate());
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options); // You can customize the locale and format as needed
};

export const welcomeMainImage = [
  welcomeImg1,
  welcomeImg2,
  welcomeImg3,
  welcomeImg4,
  welcomeImg5,
  welcomeImg6,
];

export const allDefaultProfilePics = [
  profilePic_King,
  profilePic_BlueFunky,
  profilePic_BasketBallAthelete,
  profilePic_SquareCap,
  profilePic_RedCheckeShirt,
  profilePic_Devil,
  profilePic_Leopard,
  profilePic_BasketBallAthelete,
  profilePic_Royal,
  profilePic_BrownSkele,
  profilePic_FunnyHatBatch,
  profilePic_Normal,
  profilePic_superman,
  profilePic_cigar,
  profilePic_luffy,
];

// Named exports
export {
  linkedinSmallLogo,
  linkedinBigLogo,
  friendzyLogo,
  defaultProfile,
  defaultCoverImage,
  errorImg,
  NoPost,
  jobLogoPic,
  postImageError,
};
