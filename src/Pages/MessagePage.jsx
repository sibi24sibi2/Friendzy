import { useEffect, useState } from "react";
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

  // Fetch users and filter out the current user
  useEffect(() => {
    const unsubscribe = listenToUsers((users) => {
      const filtered = users.filter((user) => user.userID !== userData?.userID);
      setFollowedUser(filtered);
    });

    // Listen to online status of each followed user
    followedUser.forEach((user) => {
      listenToUserOnlineStatus(user.userID, (status) => {
        const lastSeen = status?.lastChanged
          ? moment(status.lastChanged).fromNow() // Format lastChanged timestamp using moment
          : "Offline"; // If there's no lastChanged timestamp, consider the user offline

        setUserStatus((prevStatus) => ({
          ...prevStatus,
          [user.userID]: {
            online: status?.online || false,
            lastSeen,
          },
        }));
      });
    });

    return () => unsubscribe();
  }, [userData?.userID, followedUser]);

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
