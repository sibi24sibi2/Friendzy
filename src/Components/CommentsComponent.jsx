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
    const [isPosting, setIsPosting] = useState(false);


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
        if (!commentInput.trim()) return;

        setIsPosting(true);
        try {
            await handleCommentPost(postId, userData.userID, commentInput);
            setCommentInput('');

            const newComment = {
                commenterId: userData.userID,
                text: commentInput,
                createdAt: Timestamp.now(),
            };

            setComments((prevComments) => [...prevComments, newComment]);

            setUserData({
                id: userData.userID,
                name: userData.name,
                profilePic: userData.profilePic,
            });

            await createCommentNotification(
                userData.userID,
                userData.name,
                postId,
                commenter.userID,
                commentInput
            );
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsPosting(false);
        }
    };






    return (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* Comment Input */}
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-sm mb-6">
                <div className="flex items-start gap-3">
                    <img
                        src={userData?.profilePic || 'https://via.placeholder.com/32'}
                        alt={userData?.name}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                    <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleCommentSubmit}
                        disabled={isPosting}
                        className={`px-4 py-2 text-sm font-medium rounded-lg text-white focus:outline-none transition-colors ${isPosting
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {isPosting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment, index) => {
                        const commenter = commentData[comment.commenterId];
                        return (
                            <div className="flex items-start gap-3" key={index}>
                                <img
                                    src={commenter?.profilePic || 'https://via.placeholder.com/32'}
                                    alt={commenter?.name}
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                        <div className="mb-1">
                                            <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                                {commenter?.name || 'Anonymous'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        No comments yet. Be the first to comment!
                    </p>
                )}
            </div>
        </div>
    );
};