import { useEffect, useState } from "react";
import { UserPlus } from "react-feather";
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
  const [modalData, setModalData] = useState({
    isOpen: false,
    followed: false,
    targetId: null,
  });

  useEffect(() => {
    listenToUsers(async (users) => {
      const filteredRecommendations = users.filter(
        (user) => user.userID !== userData.userID
      );
      setRecommendation(filteredRecommendations);

      const initialConnections = {};
      const checkStatusPromises = filteredRecommendations.map(async (person) => {
        const status = await checkConnectionStatus(userData.userID, person.userID);
        initialConnections[`${userData.userID}-${person.userID}`] = status;
      });

      await Promise.all(checkStatusPromises);

      setConnections(initialConnections);
    });
  }, [userData.userID]);

  const handleAddConnection = async () => {
    const { followed, targetId } = modalData;

    toggleConnectionStatus(followed, userData.userID, targetId, (newStatus) => {
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations.map((person) => (
          <div
            key={person.userID}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={person.profilePic}
              alt=""
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {person.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {person.role}
              </p>
              <div className="mt-4">
                <button
                  onClick={() =>
                    openModal(
                      connections[`${userData.userID}-${person.userID}`],
                      person.userID
                    )
                  }
                  className={`${connections[`${userData.userID}-${person.userID}`]
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-indigo-500 hover:bg-indigo-600"
                    } text-white text-sm font-medium py-1 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>
                    {connections[`${userData.userID}-${person.userID}`]
                      ? "Unfollow"
                      : "Follow"}
                  </span>
                </button>
              </div>


            </div>
          </div>
        ))}
      </div>

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
