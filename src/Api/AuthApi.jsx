import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";
import { app, firestore, database } from "../Firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { ref, set, onDisconnect } from "firebase/database";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isDark, setIsDark] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem("theme") === "dark";
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const auth = getAuth(app);
  const navigate = useNavigate();

  const randomNum = Math.floor(Math.random() * 49) + 1;
  const generateRandomProfilePic = `https://avatar.iran.liara.run/public/${randomNum}`;

  const setUserOnlineStatus = (userId) => {
    const userStatusRef = ref(database, `users/${userId}/status`);
    // Set the user to 'online' when they come online
    set(userStatusRef, {
      online: true,
      lastChanged: Date.now(),
    });

    // Set the user to 'offline' when they disconnect (onDisconnect triggers)
    onDisconnect(userStatusRef).set({
      online: false,
      lastChanged: Date.now(),
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true); // Start loading state

      if (currentUser) {
        setCurrentUser(currentUser);
        setUserOnlineStatus(currentUser.uid); // Set user to online

        try {
          const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.warn("User document does not exist in Firestore.");
            setUserData(null); // Fallback if no data is found
          }
        } catch (error) {
          console.error("Failed to fetch user document:", error);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        console.log("User signed out");
      }

      setIsLoading(false); // End loading state
    });

    return () => unsubscribe();
  }, [auth]);


  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Login failed.");
    }
  };

  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Wait for the Firestore document to be created
      await setDoc(doc(firestore, "users", user.uid), {
        name: displayName,
        email: email,
        userID: user.uid,
        username: `user${crypto.randomUUID().slice(0, 8)}`,
        profilePic: generateRandomProfilePic || "defaultProfile",
      });

      // Fetch the user document to set userData immediately
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      toast.success("Account created successfully!");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Signup failed.");
    }
  };


  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(firestore, "users", user.uid), {
          name: user.displayName || "Unknown User",
          email: user.email,
          userID: user.uid,
          profilePic: generateRandomProfilePic,
        });
      }

      toast.success("Logged in with Google successfully!");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Google login failed.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Logout failed.");
    }
  };

  const sendPasswordResetEmail = async (email) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to send password reset email.");
    }
  };




  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        login,
        isLoading,
        signup,
        signInWithGoogle,
        logout,
        sendPasswordResetEmail,
        isDark,
        setIsDark
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
