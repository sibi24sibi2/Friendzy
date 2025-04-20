import { Home, User, MessageSquare, Bell, UserPlus } from 'react-feather';
import { Link } from 'react-router-dom'; // Import Link for routing


export default function MobileNavbar() {
  const navigation = [
    { name: 'Home', icon: Home, to: '/home' },
    { name: 'Profile', icon: User, to: '/profile' },
    { name: 'Messages', icon: MessageSquare, to: '/messages' },
    { name: 'Notifications', icon: Bell, to: '/notifications' },
    { name: 'Friends', icon: UserPlus, to: '/friends' },
  ];



  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <div className="flex justify-around items-center">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.to} // Use Link's 'to' for navigation
            className="flex flex-col items-center justify-center py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
