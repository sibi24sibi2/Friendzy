
import { useEffect, useState } from 'react';
import { ArrowLeft, Send } from 'react-feather';
import { Link, useParams } from 'react-router-dom';
import { firestore } from "../Firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../Api/AuthApi';
import { listenToSingleUser } from '../Api/CommanApi';
import { decryptID } from "../Hooks/encryption";
import moment from 'moment';

export default function ChatPage() {
  const { id } = useParams(); // The ID of the user you're chatting with
  const decryptedID = decryptID(id);


  const { userData } = useAuth(); // Authenticated user data

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Use decryptedID instead of id
  const chatId = userData.userID < decryptedID
    ? `chat_${userData.userID}_${decryptedID}`
    : `chat_${decryptedID}_${userData.userID}`;

  const messagesCollection = collection(firestore, 'chats', chatId, 'messages');


  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let currentDate = null;

    messages.forEach((message) => {
      const messageDate = moment(message.timestamp.toDate()).format('YYYY-MM-DD');
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        let dateLabel = '';
        if (moment(currentDate).isSame(moment(), 'day')) {
          dateLabel = 'Today';
        } else if (moment(currentDate).isSame(moment().subtract(1, 'day'), 'day')) {
          dateLabel = 'Yesterday';
        } else {
          dateLabel = moment(currentDate).format('MMM D');
        }
        grouped.push({ dateLabel, messages: [] });
      }
      grouped[grouped.length - 1].messages.push(message);
    });

    console.log('Grouped Messages by Date:', grouped); // Debug log for grouped messages
    return grouped;
  };

  useEffect(() => {
    setLoading(true);
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));
    console.log('Querying messages with chatId:', chatId); // Debug log for query
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched Messages:', allMessages); // Debug log for fetched messages
      setMessages(groupMessagesByDate(allMessages));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        console.log('Sending message:', newMessage); // Debug log for sending message
        await addDoc(messagesCollection, {
          text: newMessage,
          sender: userData.userID,
          timestamp: serverTimestamp(),
        });
        setNewMessage('');
        console.log('Message sent successfully'); // Debug log for successful message send
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.warn('Message is empty, not sending'); // Debug log for empty message
    }
  };

  useEffect(() => {
    console.log('Listening to single user data for:', decryptedID); // Debug log for user data subscription
    const unsubscribe = listenToSingleUser(setUser, decryptedID);
    return () => unsubscribe();
  }, [decryptedID]);

  const messageLoader = () => (
    <div className="h-screen lg:h-[28rem]">
      <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center animate-pulse">
          <div className="mr-4 w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-3"></div>
          <div className="flex flex-col space-y-2">
            <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-pulse">
          {[...Array(5)].map((_, idx) => (
            <div key={idx}>
              {/* Date Label Skeleton */}
              <div className="text-center mt-4">
                <div className="inline-block w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>
              {/* Messages */}
              {[...Array(2)].map((_, msgIdx) => (
                <div key={msgIdx} className={`flex ${msgIdx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 my-1 min-w-20 rounded-lg ${msgIdx % 2 === 0
                      ? 'bg-gray-300 dark:bg-gray-700'
                      : 'bg-blue-500'
                      }`}
                  >
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 dark:bg-gray-600 rounded mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Input Skeleton */}
        <div className="bg-white lg:relative lg:w-auto w-screen lg:bottom-0 fixed bottom-14 left-0 dark:bg-gray-800 p-4 flex items-center animate-pulse">
          <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-full px-4 py-2 mr-2 h-10"></div>
          <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen lg:h-[28rem]">
      <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
        {loading ? messageLoader() : (
          <>
            <div className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center">
              <Link to="/messages" className="mr-4">
                <ArrowLeft className="text-gray-600 dark:text-gray-300" />
              </Link>
              <img
                src={user?.profilePic}
                alt="User"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-white">{user?.name}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((group, idx) => (
                <div key={idx}>
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm">
                      {group.dateLabel}
                    </span>
                  </div>
                  {group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === userData.userID ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 my-1 min-w-20 rounded-lg ${message.sender === userData.userID
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white'
                          }`}
                      >
                        <p>{message.text}</p>
                        {message.timestamp && (
                          <p className="text-[10px] mt-0.5 text-gray-200 float-right dark:text-gray-400">
                            {new Date(message.timestamp.toDate()).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="bg-white lg:relative lg:w-auto w-screen lg:bottom-0 fixed bottom-14 left-0 dark:bg-gray-800 p-4 flex items-center">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
