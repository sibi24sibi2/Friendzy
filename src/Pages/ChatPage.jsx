
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
  const chatId = userData?.userID && decryptedID
    ? (userData.userID < decryptedID
      ? `chat_${userData.userID}_${decryptedID}`
      : `chat_${decryptedID}_${userData.userID}`)
    : null;


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
    if (!chatId || !userData?.userID) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
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
  }, [chatId, userData?.userID]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && chatId && userData?.userID) {
      try {
        console.log('Sending message:', newMessage); // Debug log for sending message
        const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
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
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px] max-h-[800px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center animate-pulse flex-shrink-0">
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
                    className={`max-w-[70%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[45%] px-4 py-2 my-1 min-w-20 rounded-lg ${msgIdx % 2 === 0
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
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center animate-pulse flex-shrink-0">
          <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-full px-4 py-2 mr-2 h-10"></div>
          <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px] max-h-[800px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {loading ? messageLoader() : (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center flex-shrink-0 sticky top-0 z-10">
            <Link to="/messages" className="mr-3 md:mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors">
              <ArrowLeft className="text-gray-600 dark:text-gray-300 w-5 h-5" />
            </Link>
            <img
              src={user?.profilePic}
              alt={user?.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-800 dark:text-white text-base md:text-lg truncate">
                {user?.name || "Loading..."}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role || ""}
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((group, idx) => (
                <div key={idx}>
                  {/* Date Label */}
                  <div className="text-center my-4">
                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {group.dateLabel}
                    </span>
                  </div>

                  {/* Messages */}
                  {group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-2 ${message.sender === userData.userID ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[45%] px-4 py-2 rounded-2xl break-words ${message.sender === userData.userID
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
                          }`}
                      >
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        {message.timestamp && (
                          <div className="flex justify-end mt-1">
                            <span className={`text-[10px] md:text-xs ${message.sender === userData.userID
                              ? 'text-blue-100'
                              : 'text-gray-500 dark:text-gray-400'
                              }`}>
                              {new Date(message.timestamp.toDate()).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 md:p-4 flex items-center gap-2 flex-shrink-0"
          >
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 md:p-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center min-w-[44px] min-h-[44px]"
            >
              <Send size={18} className="md:w-5 md:h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
