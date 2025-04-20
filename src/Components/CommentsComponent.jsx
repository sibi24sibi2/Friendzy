import React, { useEffect, useState } from 'react';
import { useAuth } from '../Api/AuthApi';
import { handleCommentPost, fetchCommentsForPost, listenToSingleUser } from '../Api/CommanApi'; // Add a function to fetch comments
import { Timestamp } from 'firebase/firestore';
import { createCommentNotification } from '../Api/NotificationApi';

export const CommentsComponent = ({ postId, commenter }) => {
    const { userData } = useAuth(); // Get user data from authentication context
    const [commentInput, setCommentInput] = useState(''); // For new comment input
    const [commentData, setCommentData] = useState({});
    const [comments, setComments] = useState([]); // List of comments

    // Fetch comments when the component mounts or postId changes
    useEffect(() => {
        const loadComments = async () => {
            try {
                const fetchedComments = await fetchCommentsForPost(postId);
                setComments(fetchedComments);

                const userIds = fetchedComments.map(comment => comment.commenterId);
                const uniqueUserIds = [...new Set(userIds)]; // Remove duplicates
                const userPromises = uniqueUserIds.map(userID => {
                    return listenToSingleUser(setUserData, userID);
                });

                // Fetch all user data for commenters
                await Promise.all(userPromises);


            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        loadComments();
    }, [postId]);


    const setUserData = (user) => {
        setCommentData((prevUsers) => ({
            ...prevUsers,
            [user.id]: user
        }));
    };

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (!commentInput.trim()) return; // Prevent empty comments
        try {
            await handleCommentPost(postId, userData.userID, commentInput); // Post new comment
            setCommentInput(''); // Clear input
            const newComment = {
                commenterId: userData.userID,
                text: commentInput,
                createdAt: Timestamp.now(),
            };

            // Add the new comment temporarily with just userID or fallback data
            setComments((prevComments) => [...prevComments, newComment]);
            await createCommentNotification(userData.userID, userData.name, postId, commenter.userID, commentInput);

        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };




    return (
        <>
            {/* Comments Section */}
            <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="p-4 bg-gray-50 dark:bg-gray-900">
                    {/* Comment Input */}
                    <div className="flex gap-3 mb-4">
                        <img
                            src={userData?.profilePic}
                            alt={userData?.name}
                            className="w-8 h-8 rounded-full"
                        />
                        <input
                            type="text"
                            onChange={(e) => setCommentInput(e.target.value)}
                            value={commentInput}
                            placeholder="Share your thoughts here..."
                            className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                        >
                            Post
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => {

                                const commenter = commentData[comment.commenterId];


                                return (
                                    <div className="flex gap-3" key={index}>
                                        <img
                                            src={commenter?.profilePic} // Fallback to pravatar if no profile pic
                                            alt={commenter?.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {commenter?.name}
                                                    </span>
                                                    {/* <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(comment.createdAt.seconds * 1000).toLocaleString()}
                                                    </span> */}
                                                </div>
                                                <p className="text-gray-900 dark:text-white text-sm">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })

                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
