import { useEffect, useState } from "react";
import { UserPlus, Users } from "react-feather";
import { Link } from "react-router-dom";
import {
  listenToUsers,
  toggleConnectionStatus,
  checkConnectionStatus,
} from "../Api/CommanApi";
import { useAuth } from "../Api/AuthApi";
import { createFollowNotification } from "../Api/NotificationApi";
import FollowButtonModal from "../Components/Modal/FollowButtonModal";

export default function FriendsPage() {
  const { userData } = useAuth();
  const [recommendations, setRecommendation] = useState([]);
  const [connections, setConnections] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalData, setModalData] = useState({
    isOpen: false,
    followed: false,
    targetId: null,
  });

  useEffect(() => {
    if (!userData?.userID) return;

    setIsLoading(true);
    listenToUsers(async (users) => {
      // Store all users for later use
      const filteredUsers = users.filter(
        (user) => user.userID !== userData.userID
      );
      setAllUsers(filteredUsers);

      // Check connection status for all users
      const initialConnections = {};
      const checkStatusPromises = filteredUsers.map(async (person) => {
        const status = await checkConnectionStatus(userData.userID, person.userID);
        initialConnections[`${userData.userID}-${person.userID}`] = status;
        return { person, status };
      });

      const results = await Promise.all(checkStatusPromises);
      setConnections(initialConnections);

      // Filter to show only unfollowed users (users that are not in connections)
      const unfollowedUsers = results
        .filter(({ status }) => !status)
        .map(({ person }) => person);

      setRecommendation(unfollowedUsers);
      setIsLoading(false);
    });
  }, [userData?.userID]);

  const handleAddConnection = async () => {
    const { followed, targetId } = modalData;

    toggleConnectionStatus(followed, userData.userID, targetId, async (newStatus) => {
      // Update connection status but don't remove from recommendations immediately
      // The user will stay visible until page reload/switching, then useEffect will filter them out
      setConnections((prevConnections) => ({
        ...prevConnections,
        [`${userData.userID}-${targetId}`]: newStatus,
      }));
    });

    if (!followed) {
      createFollowNotification(userData.userID, userData.name, targetId);
    }
  };

  const openModal = (followed, targetId) => {
    setModalData({ isOpen: true, followed, targetId });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Friend Recommendations
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading recommendations...</div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Friends to Recommend
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You're all caught up! There are no new friends to recommend at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendations.map((person) => {
            const isFollowed = connections[`${userData.userID}-${person.userID}`] || false;
            return (
              <div
                key={person.userID}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <Link
                  to={`/profile/${person.userID}`}
                  className="block cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={person.profilePic}
                    alt={person.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {person.role || "Member"}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openModal(isFollowed, person.userID);
                    }}
                    className={`${isFollowed
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-indigo-500 hover:bg-indigo-600"
                      } text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-md w-full`}
                  >
                    <UserPlus className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{isFollowed ? "UnFollow" : "Follow"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <FollowButtonModal
        isOpen={modalData.isOpen}
        setIsOpen={(value) =>
          setModalData((prev) => ({ ...prev, isOpen: value }))
        }
        followed={modalData.followed}
        onConfirm={handleAddConnection}
      />
    </div>
  );
}
