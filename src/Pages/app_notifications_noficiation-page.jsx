import { Bell } from 'react-feather'
import { useAuth } from '../Api/AuthApi';
import { useEffect, useState } from 'react';
import { getUserNotifications } from '../Api/NotificationApi';
import moment from 'moment';

export default function NotificationsPage() {


  const { userData } = useAuth();
  const [notifications, setNotifications] = useState([]);


  // const notifications = [
  //   { id: 1, type: 'like', user: 'Emma Watson', action: 'liked your post', time: '2m ago' },
  //   { id: 2, type: 'comment', user: 'Tom Hardy', action: 'commented on your photo', time: '1h ago' },
  //   { id: 3, type: 'friend', user: 'Chris Evans', action: 'accepted your friend request', time: '3h ago' },
  //   { id: 4, type: 'mention', user: 'Scarlett Johansson', action: 'mentioned you in a comment', time: '1d ago' },
  // ]


  useEffect(() => {
    if (userData && userData.userID) {
      // Fetch notifications when userId is available
      const fetchNotifications = async () => {
        try {
          const userNotifications = await getUserNotifications(userData.userID); // Fetch notifications for the logged-in user
          setNotifications(userNotifications);

        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [userData]); // Dependency on userData, runs when userData changes



  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️'
      case 'comment':
        return '💬'
      case 'friend':
        return '👥'
      case 'mention':
        return '@'
      default:
        return '🔔'
    }
  }

  const formatTimestamp = (timestamp) => {
    return moment(timestamp.toDate()).fromNow(); // Format using moment.js (e.g., "2 minutes ago")
  };



  const generateNotificationText = (notification) => {
    const { type, extra_data, timestamp } = notification;
    const formattedTime = timestamp ? `posted at ${moment(timestamp.toDate()).format('MMMM DD, YYYY')}` : 'Just now';

    switch (type) {
      case 'like':
        return `${extra_data.liked_user_name} liked your post ${formattedTime}`;
      case 'comment':
        return `${extra_data.commenter_name} commented on your post as '${notification.extra_data.comment_text}'`;
      case 'follow':
        return `${extra_data.follower_name} followed you`;
      default:
        return 'You have a new notification';
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Notifications
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You're all caught up! You don't have any notifications at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-800 dark:text-gray-200">{generateNotificationText(notification)}</p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.timestamp ? formatTimestamp(notification.timestamp) : 'Just now'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

