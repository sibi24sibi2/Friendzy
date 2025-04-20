import { useEffect, useState } from "react";
import { useAuth } from "../Api/AuthApi";
import { listenToUsers } from "../Api/CommanApi";
import { listenToUserOnlineStatus } from "../Api/CommanApi";

export default function ActiveFriends({ className }) {
  const { userData } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [userStatus, setUserStatus] = useState({}); // Store online status of users

  useEffect(() => {
    const unsubscribeUsers = listenToUsers(async (users) => {
      const filteredRecommendations = users.filter(
        (user) => user.userID !== userData.userID
      );

      // Initialize online status for all users
      filteredRecommendations.forEach((user) => {
        listenToUserOnlineStatus(user.userID, (status) => {
          setUserStatus((prevStatus) => ({
            ...prevStatus,
            [user.userID]: status?.isOnline,
          }));
        });
      });

      setAllUsers(filteredRecommendations);
    });

    return () => unsubscribeUsers(); // Clean up listeners when the component unmounts
  }, [userData.userID]);

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow sticky top-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Active Friends
        </h3>
        <div className="space-y-4">
          {allUsers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No active users found.
            </p>
          ) : (
            allUsers
              .sort((a, b) => userStatus[b.userID] - userStatus[a.userID]) // Sort active users first
              .slice(0, 5) // Limit to 5 users
              .map((person) => (
                <div key={person.userID} className="flex items-center gap-3">
                  <div className="skeleton-circle h-10 w-10">
                    <img
                      src={person.profilePic}
                      className="w-full h-full p-[1px] object-cover rounded-full"
                      alt={person.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {person.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {person.role}
                    </p>
                  </div>

                  {/* Online status indicator */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${userStatus[person.userID]
                      ? "bg-green-500"
                      : "bg-gray-400"
                      }`}
                  ></span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
