import { firestore } from "../Firebase";
import {
  collection, addDoc, deleteDoc,
  doc, updateDoc, arrayRemove, arrayUnion, setDoc, onSnapshot,
  where,
  query,
  getDoc,
  getDocs,
  Timestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import { ref as dbRef, onValue } from 'firebase/database';
import { database as RealTimeDatabase } from '../Firebase';
import { uploadImage } from "./UploadApiUsingCloudinary";


// import uuid from "react-uuid";

const postsCollection = collection(firestore, "posts");






export const listenToUsers = (setUsers) => {
  // Listen for real-time updates
  const unsubscribe = onSnapshot(collection(firestore, "users"), (snapshot) => {
    const usersList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersList);
  });

  return unsubscribe;
};

export const listenToAllPosts = (setAllPosts) => {
  // Listen for real-time updates
  const unsubscribe = onSnapshot(collection(firestore, "posts"), (snapshot) => {
    const usersList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAllPosts(usersList);
  });

  return unsubscribe;
};




export const listenToSingleUser = (setUser, userID) => {
  const usersQuery = query(
    collection(firestore, "users"),
    where("userID", "==", userID)
  );

  const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
    const user = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0]; // Assuming only one user per userID
    setUser(user);
  });
  return unsubscribe;
};


export const listenToSingleUserPost = (setAllPosts, userID) => {

  const PostsQuery = query(
    collection(firestore, "posts"),
    where("userID", "==", userID)
  );


  const unsubscribe = onSnapshot(PostsQuery, (snapshot) => {
    const postsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAllPosts(postsList);
  });

  return unsubscribe;
};



export const addPost = async (postData, imageFile, userId, postId, visiblity) => {

  let imageUrl = null;

  if (imageFile) {
    imageUrl = await uploadImage(imageFile);
  }

  const postWithImage = {
    content: postData,
    imageUrl: imageUrl,
    createdAt: Timestamp.now(),
    userID: userId,
    postID: postId,
    visiblity: visiblity
  };

  await addDoc(postsCollection, postWithImage);
  toast.success('post added successfully');

  return true;

};

// // Function to handle post deletion
export const handleDeletePost = async (postId) => {
  const postRef = doc(firestore, 'posts', postId);
  await deleteDoc(postRef); // Delete the post from Firestore
  toast.success('post deleted successfully');
};





export const handleLikePost = async (postId, username, like) => {
  const postRef = doc(firestore, "posts", postId);

  // Update likes based on like parameter

  await updateDoc(postRef, {
    likes: like
      ? arrayUnion(username) // Add user ID to likes array
      : arrayRemove(username) // Remove user ID from likes array
  });

};


export const handleCommentPost = async (postId, username, commentText) => {
  const postRef = doc(firestore, "posts", postId);
  await updateDoc(postRef, {
    comments: arrayUnion({ commenterId: username, text: commentText, createdAt: new Date() }) // Add comment object to the comments array
  });
};



// Function to fetch comments for a specific post
export const fetchCommentsForPost = async (postId) => {
  const postRef = doc(firestore, 'posts', postId);
  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
    return postSnap.data().comments || []; // Return comments array or empty if undefined
  }
  throw new Error('Post not found');
};


export const savePostForUser = async (userId, postId) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await updateDoc(userDocRef, {
      savedPosts: arrayUnion(postId),
    });
    return true;
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
};

export const removeSavedPostForUser = async (userId, postId) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await updateDoc(userDocRef, {
      savedPosts: arrayRemove(postId),
    });
    return true;
  } catch (error) {
    console.error("Error removing saved post:", error);
    throw error;
  }
};


export const addConnection = async (userId, targetId) => {
  try {
    const connectionToAdd = doc(collection(firestore, 'connections'), `${userId}_${targetId}`);

    await setDoc(connectionToAdd, { userId, targetId });


  } catch (err) {
    console.error("Error adding connection:", err);

  }
};



// this belowe code to be modified
const connectionsCollection = collection(firestore, "connections");

// Check if a connection exists
export const checkConnectionStatus = async (userId, targetId) => {
  const q = query(
    connectionsCollection,
    where("userId", "==", userId),
    where("targetId", "==", targetId)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};


// Toggle connection (add or delete)
export const toggleConnectionStatus = async (connected, userId, targetId, setConnected) => {
  const q = query(
    connectionsCollection,
    where("userId", "==", userId),
    where("targetId", "==", targetId)
  );

  try {
    if (connected) {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const connectionDoc = querySnapshot.docs[0];
        await deleteDoc(doc(firestore, "connections", connectionDoc.id));
        setConnected(false);
        console.log(`Disconnected with ${targetId}`);
      }
    } else {
      await addDoc(connectionsCollection, {
        userId,
        targetId,
        connectedAt: new Date(),
      });
      setConnected(true);
      console.log(`Connected with ${targetId}`);
    }
  } catch (error) {
    console.error("Error updating connection status:", error);
  }
};



export const listenToUserFollowers = async (userID, setFollowersCount) => {
  const followersQuery = query(
    collection(firestore, "connections"),
    where("targetId", "==", userID)
  );

  try {
    const querySnapshot = await getDocs(followersQuery);
    const followersCount = querySnapshot.size; // Get the number of followers
    setFollowersCount(followersCount);
  } catch (error) {
    console.error("Error getting followers count: ", error);
  }
};


export const listenToUserFollowing = async (userID, setFollowingCount) => {
  const followingQuery = query(
    collection(firestore, "connections"),
    where("userId", "==", userID)
  );

  try {
    const querySnapshot = await getDocs(followingQuery);
    const followingCount = querySnapshot.size; // Get the number of people the user is following
    setFollowingCount(followingCount);
  } catch (error) {
    console.error("Error getting following count: ", error);
  }
};


export const listenToUserPosts = async (userID, setPostsCount) => {
  const postsQuery = query(
    collection(firestore, "posts"),
    where("userId", "==", userID)
  );

  try {
    const querySnapshot = await getDocs(postsQuery);
    const postsCount = querySnapshot.size; // Get the number of posts for the user
    setPostsCount(postsCount);
  } catch (error) {
    console.error("Error getting posts count: ", error);
  }
};




export const fetchUserDetails = async (userID, setUserData) => {
  try {
    const userDoc = await getDoc(doc(firestore, "users", userID));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    } else {
      console.error("User data not found!");
    }
  } catch (error) {
    console.error("Error fetching user details: ", error);
  }
};


export const updateUserDetails = async (userID, updatedData) => {


  try {
    // Reference to the user's document
    const userDocRef = doc(firestore, "users", userID);

    // Update the document
    await updateDoc(userDocRef, updatedData);

    // console.log("User details successfully updated!");
    return { success: true };
  } catch (error) {
    console.error("Error updating user details:", error);
    return { success: false, error: error.message };
  }
};


export const listenToUserOnlineStatus = (userID, setStatus) => {
  const userStatusRef = dbRef(RealTimeDatabase, `users/${userID}/status`);

  try {
    const unsubscribe = onValue(userStatusRef, (snapshot) => {
      if (snapshot.exists()) {
        const statusData = snapshot.val();
        const isOnline = statusData.online || false; // Default to false if not present
        const lastChanged = statusData.lastChanged || null; // Default to null if not present

        setStatus({ isOnline, lastChanged });
      } else {
        console.warn(`No status data found for user: ${userID}`);
        setStatus(null); // Clear the status if no data is found
      }
    });
    return unsubscribe; // Return unsubscribe function
  } catch (error) {
    console.error("Error listening to user online status: ", error);
    return () => { }; // Return empty function if error
  }
};

// Search users by name
export const searchUsers = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return [];
  }

  try {
    const searchLower = searchTerm.toLowerCase().trim();
    const usersRef = collection(firestore, "users");

    // Fetch users and filter client-side for substring matching
    // This works without requiring Firestore indexes
    const querySnapshot = await getDocs(usersRef);
    const allUsers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter for case-insensitive substring match
    const filteredUsers = allUsers
      .filter((user) => user.name && user.name.toLowerCase().includes(searchLower))
      .slice(0, 10);

    return filteredUsers;
  } catch (error) {
    console.error("Error searching users: ", error);
    return [];
  }
};

// Search posts by content
export const searchPosts = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return [];
  }

  try {
    const searchLower = searchTerm.toLowerCase().trim();
    const postsRef = collection(firestore, "posts");

    // Firestore doesn't support substring search efficiently, so we fetch recent posts
    // and filter client-side. Limit to 100 posts for performance.
    const postsQuery = query(
      postsRef,
      orderBy("createdAt", "desc"),
      limit(100)
    );

    const querySnapshot = await getDocs(postsQuery);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter posts where content contains the search term (case-insensitive)
    const filteredPosts = posts.filter((post) =>
      post.content && post.content.toLowerCase().includes(searchLower)
    );

    return filteredPosts.slice(0, 10);
  } catch (error) {
    console.error("Error searching posts: ", error);
    return [];
  }
};
