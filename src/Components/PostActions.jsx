import React, { useEffect, useState } from 'react';
import { ThumbsUp, MessageCircle } from 'react-feather';
import { handleCommentPost, handleLikePost } from '../Api/CommanApi';
import { useAuth } from '../Api/AuthApi';
import LikedButtonCheckbox from './ui/LikeButton';
import { createLikeNotification } from '../Api/NotificationApi';

export const PostActions = ({ postId, toggleComments, postData, allPostData }) => {
    const { userData } = useAuth();

    const [likedPosts, setLikedPosts] = useState(new Set());
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        // Reset the state every time postData or userData changes
        const initialLikedPosts = new Set();
        let initialLikesCount = 0;

        // Loop through postData to correctly initialize likedPosts and likesCount
        postData.forEach((post) => {
            if (post.id === postId) {
                if (post.likes && post.likes.includes(userData.name)) {
                    initialLikedPosts.add(post.id); // Add to likedPosts if user has liked
                }
                if (post.likes) {
                    initialLikesCount = post.likes.length; // Set the like count for the post
                }
            }
        });

        setLikedPosts(initialLikedPosts);
        setLikesCount(initialLikesCount); // Set the correct like count for the specific post
    }, [postData, userData?.name, postId]); // Re-run effect when postData, userData, or postId changes

    const handleLike = async (postId) => {
        try {
            const liked = likedPosts.has(postId);
            const newLikedPosts = new Set(likedPosts);

            let newLikesCount = likesCount;
            if (liked) {
                newLikedPosts.delete(postId); // Unlike
                newLikesCount--; // Decrease the like count
                await handleLikePost(postId, userData.name, false); // Update Firestore to unlike
            } else {
                newLikedPosts.add(postId); // Like
                newLikesCount++; // Increase the like count
                await handleLikePost(postId, userData.name, true); // Update Firestore to like
            }

            setLikedPosts(newLikedPosts); // Update state
            setLikesCount(newLikesCount); // Update the like count state
            await createLikeNotification(userData.userID, userData.name, postId, allPostData.user.id)
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };



    return (
        <div>
            {/* Post Actions */}
            <div className="flex items-center gap-4">
                <button onClick={() => handleLike(postId)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <ThumbsUp className={`w-5 h-5 ${likedPosts.has(postId) ? 'fill-blue-500' : ''}`} />
                    <span className="ml-2 dark:text-gray-200 text-gray-800">{likesCount}</span> {/* Display the like count */}
                </button>
                <button onClick={() => toggleComments(postId)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <MessageCircle className="w-5 h-5" />
                    <span>Comment</span>
                </button>
            </div>
        </div>
    );
};
