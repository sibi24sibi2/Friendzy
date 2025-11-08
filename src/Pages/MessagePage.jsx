import { useEffect, useState, useRef } from "react";
import { MessageCircle, Search } from "react-feather";
import { Link } from "react-router-dom";
import { listenToUsers } from "../Api/CommanApi";
import { useAuth } from "../Api/AuthApi";
import { listenToUserOnlineStatus } from "../Api/CommanApi"; // Import the function
import moment from "moment/moment";
import { encryptID } from "../Hooks/encryption"; // Import the function


export default function MessagesPage() {
  const { userData } = useAuth(); // Authenticated user data
  const [followedUser, setFollowedUser] = useState([]); // All users from Firestore
  const [searchTerm, setSearchTerm] = useState(""); // Current search input
  const [filteredUsers, setFilteredUsers] = useState([]); // Users filtered by searchTerm
  const [userStatus, setUserStatus] = useState({}); // Status of followed users
  const statusUnsubscribesRef = useRef({}); // Store unsubscribe functions using ref

  // Fetch users and filter out the current user
  useEffect(() => {
    if (!userData?.userID) {
      setFollowedUser([]);
      setUserStatus({});
      // Clean up all status listeners
      Object.values(statusUnsubscribesRef.current).forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
      statusUnsubscribesRef.current = {};
      return;
    }

    const unsubscribe = listenToUsers((users) => {
      const filtered = users.filter((user) => user.userID !== userData?.userID);
      
      // Clean up old status listeners for users that are no longer in the list
      const currentUserIDs = new Set(filtered.map((u) => u.userID));
      Object.keys(statusUnsubscribesRef.current).forEach((userID) => {
        if (!currentUserIDs.has(userID)) {
          const unsubscribe = statusUnsubscribesRef.current[userID];
          if (typeof unsubscribe === "function") {
            unsubscribe();
          }
          delete statusUnsubscribesRef.current[userID];
        }
      });

      // Create new status listeners for users that don't have one yet
      filtered.forEach((user) => {
        if (!statusUnsubscribesRef.current[user.userID]) {
          const unsubscribe = listenToUserOnlineStatus(user.userID, (status) => {
            const lastSeen = status?.lastChanged
              ? moment(status.lastChanged).fromNow()
              : "Offline";

            setUserStatus((prevStatus) => ({
              ...prevStatus,
              [user.userID]: {
                online: status?.online || false,
                lastSeen,
              },
            }));
          });
          statusUnsubscribesRef.current[user.userID] = unsubscribe;
        }
      });

      setFollowedUser(filtered);
    });

    return () => {
      unsubscribe();
      // Clean up all status listeners
      Object.values(statusUnsubscribesRef.current).forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
      statusUnsubscribesRef.current = {};
    };
  }, [userData?.userID]);

  // Filter users based on the search term
  useEffect(() => {
    setFilteredUsers(
      followedUser.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [followedUser, searchTerm]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Messages
      </h1>
      <div className="mb-4 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
          placeholder="Search messages..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Link to={`/messages/${encryptID(user.id)}`} key={user.id}>
            <div
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <div className="flex-shrink-0 mr-3">
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userStatus[user.userID]?.online
                    ? "Online"
                    : userStatus[user.userID]?.lastSeen
                      ? `Last seen ${userStatus[user.userID]?.lastSeen}`
                      : "..."}
                </p>

              </div>
              <div className="flex-shrink-0 ml-3 text-xs text-gray-500 dark:text-gray-400">
                {user.time || ""}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
