import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "../Api/AuthApi";
import { listenToUsers } from "../Api/CommanApi";
import { listenToUserOnlineStatus } from "../Api/CommanApi";

export default function ActiveFriends({ className }) {
  const { userData, isLoading } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [userStatus, setUserStatus] = useState({}); // Store online status of users
  const statusUnsubscribesRef = useRef({}); // Store unsubscribe functions using ref

  useEffect(() => {
    if (!userData?.userID) {
      setAllUsers([]);
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

    const unsubscribeUsers = listenToUsers((users) => {
      const filteredRecommendations = users.filter(
        (user) => user.userID !== userData.userID
      );

      // Clean up old status listeners for users that are no longer in the list
      const currentUserIDs = new Set(filteredRecommendations.map((u) => u.userID));
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
      filteredRecommendations.forEach((user) => {
        if (!statusUnsubscribesRef.current[user.userID]) {
          const unsubscribe = listenToUserOnlineStatus(user.userID, (status) => {
            setUserStatus((prevStatus) => ({
              ...prevStatus,
              [user.userID]: status?.isOnline || false,
            }));
          });
          statusUnsubscribesRef.current[user.userID] = unsubscribe;
        }
      });

      setAllUsers(filteredRecommendations);
    });

    return () => {
      // Clean up users listener
      if (typeof unsubscribeUsers === "function") {
        unsubscribeUsers();
      }
      // Clean up all status listeners
      Object.values(statusUnsubscribesRef.current).forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
      statusUnsubscribesRef.current = {};
    };
  }, [userData?.userID]);

  // Memoize the sorted and filtered users list
  const displayUsers = useMemo(() => {
    if (!allUsers.length) return [];

    // Sort users: active first, then offline
    const sortedUsers = [...allUsers].sort((a, b) => {
      const aStatus = userStatus[a.userID] ? 1 : 0;
      const bStatus = userStatus[b.userID] ? 1 : 0;
      if (aStatus !== bStatus) {
        return bStatus - aStatus;
      }
      // If same status, sort by userID for consistency
      return a.userID.localeCompare(b.userID);
    });

    // Separate active and offline users
    const activeUsers = sortedUsers.filter((user) => userStatus[user.userID]);
    const offlineUsers = sortedUsers.filter((user) => !userStatus[user.userID]);

    // If no active users, show 5 random offline users
    if (activeUsers.length === 0) {
      // Shuffle offline users for randomness using a stable approach
      // Create a shuffled copy based on userID hash for consistency
      const shuffled = [...offlineUsers].sort((a, b) => {
        // Use a simple hash of userID for pseudo-random but stable ordering
        const hashA = a.userID.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hashB = b.userID.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hashA - hashB;
      });
      return shuffled.slice(0, Math.min(5, shuffled.length));
    }

    // If we have 5 or more active users, show all active users
    if (activeUsers.length >= 5) {
      return activeUsers.slice(0, activeUsers.length); // Return all active users
    }

    // If we have less than 5 active users, show active + offline to reach 5
    const needed = Math.min(5 - activeUsers.length, offlineUsers.length);
    const selectedOffline = offlineUsers.slice(0, needed);
    return [...activeUsers, ...selectedOffline];
  }, [allUsers, userStatus]);

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow sticky top-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Active Friends
        </h3>
        <div className="space-y-4">
          {isLoading || !userData ? (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          ) : displayUsers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No users found.
            </p>
          ) : (
            displayUsers.map((person) => (
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
