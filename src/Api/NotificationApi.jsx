import { firestore } from '../Firebase'; // Assuming you have a Firebase initialization file
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';

export const createCommentNotification = async (commenterId, commenterName, postId, targetUserId, commentText) => {
    try {
        const userNotificationCollection = `user_${targetUserId}_Notification`; // Dynamic collection name based on target user ID
        const notificationId = `comment_${Timestamp.now().seconds}`; // You can use timestamp or a custom ID here

        const notificationData = {
            user_id: commenterId, // ID of the user making the comment
            target_user_id: targetUserId, // ID of the user receiving the notification (the post owner)
            type: 'comment', // Notification type is comment
            message: `User ${commenterName} commented on your post`, // Custom message
            timestamp: Timestamp.now(), // Timestamp of when the notification was created
            viewed: false, // Default to false, as the notification is unread
            extra_data: {
                post_id: postId, // The ID of the post where the comment was made
                comment_text: commentText, // Comment text
                commenter_name: commenterName, // Name of the comment
            },
        };

        // Storing notification as a map in Firestore under the dynamic collection
        const notificationsRef = doc(firestore, 'notification', userNotificationCollection);
        await setDoc(notificationsRef, {
            [notificationId]: notificationData, // Using notificationId as the key
        }, { merge: true });  // Use 'merge: true' to ensure existing notifications are not overwritten

        console.log('Comment Notification Data:', notificationData);

    } catch (error) {
        console.error('Error creating comment notification:', error);
    }
};

export const createFollowNotification = async (followerId, followerName, targetUserId) => {
    try {
        const userNotificationCollection = `user_${targetUserId}_Notification`; // Dynamic collection name based on target user ID
        const notificationId = `follow_${Timestamp.now().seconds}`; // Using timestamp as notification ID

        const notificationData = {
            user_id: followerId, // ID of the user who follows
            target_user_id: targetUserId, // ID of the user receiving the notification
            type: 'follow', // Notification type is follow
            message: `User ${followerName} followed you`, // Custom message
            timestamp: Timestamp.now(), // Timestamp of when the notification was created
            viewed: false, // Default to false, as the notification is unread
            extra_data: {
                follow_id: null, // You can add a follow ID here if needed
                follower_name : followerName,
            },
        };

        // Storing notification as a map in Firestore under the dynamic collection
        const notificationsRef = doc(firestore, 'notification', userNotificationCollection);
        await setDoc(notificationsRef, {
            [notificationId]: notificationData, // Using notificationId as the key
        }, { merge: true });

        console.log('Follow Notification Data:', notificationData);

    } catch (error) {
        console.error('Error creating follow notification:', error);
    }
};

export const createLikeNotification = async (likerId, likerName, postId, targetUserId) => {
    try {
        const userNotificationCollection = `user_${targetUserId}_Notification`; // Dynamic collection name based on target user ID
        const notificationId = `like_${Timestamp.now().seconds}`; // Using timestamp as notification ID

        const notificationData = {
            user_id: likerId, // ID of the user who liked the post
            target_user_id: targetUserId, // ID of the user receiving the notification
            type: 'like', // Notification type is like
            message: `User ${likerName} liked your post`, // Custom message
            timestamp: Timestamp.now(), // Timestamp of when the notification was created
            viewed: false, // Default to false, as the notification is unread
            extra_data: {
                post_id: postId, // The ID of the post that was liked
                liked_user_name: likerName, // The name of the liker
            },
        };

        // Storing notification as a map in Firestore under the dynamic collection
        const notificationsRef = doc(firestore, 'notification', userNotificationCollection);
        await setDoc(notificationsRef, {
            [notificationId]: notificationData, // Using notificationId as the key
        }, { merge: true });

        console.log('Like Notification Data:', notificationData);

    } catch (error) {
        console.error('Error creating like notification:', error);
    }
};



export const getUserNotifications = async (userId) => {
    try {
        const userNotificationCollection = `user_${userId}_Notification`; // Dynamic collection name based on target user ID

        // Reference to the document in the notification collection for the target user
        const notificationsRef = doc(firestore, 'notification', userNotificationCollection);

        // Fetch the document
        const docSnap = await getDoc(notificationsRef);

        if (docSnap.exists()) {
            // Extract the notification data from the document
            const notificationsData = docSnap.data();

            // Extract the notification IDs (keys) and the data (values)
            const notifications = Object.keys(notificationsData).map(notificationId => ({
                notificationId,
                ...notificationsData[notificationId],
            }));

            console.log('Notifications for User:', notifications);
            return notifications;
        } else {
            console.log('No notifications found for this user.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};
