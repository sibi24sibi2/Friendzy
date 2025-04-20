import { useState } from 'react';
import { Home, User, MessageSquare, Bell, UserPlus } from 'react-feather';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAuth } from '../Api/AuthApi';
import { useEffect } from 'react';
import { listenToSingleUser } from '../Api/CommanApi';
import { LazyLoadImage } from 'react-lazy-load-image-component';


export default function Sidebar({ className }) {
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(5);

  const { currentUser } = useAuth()

  const [userData, setUserData] = useState()



  useEffect(() => {
    listenToSingleUser(setUserData, currentUser.uid);
  }, [currentUser])



  const navigation = [
    { name: 'Home', icon: Home, to: '/home', unread: null },
    { name: 'Profile', icon: User, to: '/profile', unread: null },
    {
      name: 'Messages', icon: MessageSquare, to: '/messages',
      // unread: unreadMessages
    },
    {
      name: 'Notifications', icon: Bell, to: '/notifications',
      // unread: unreadNotifications 
    },
    { name: 'Add Friends', icon: UserPlus, to: '/friends', unread: null },
  ];

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow sticky top-5">
        <div className="text-center mb-6 w-full ">
          <div className="skeleton-circle h-20 w-20  mb-4 mx-20" >

            <img
              src={userData?.profilePic}
              className="w-full h-full p-[1px] object-cover rounded-full"
            />

          </div>


          <h2 className="font-semibold text-gray-900 dark:text-white">{userData?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{userData?.username || 'unknown'}</p>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to} // Use the "to" property instead of "href"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 
                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
              `}
              title={item.unread ? `${item.name} - ${item.unread} unread` : item.name}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.name}</span>
              {item.unread && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {item.unread}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
