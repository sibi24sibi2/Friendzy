import { useEffect, useState, useMemo } from 'react';
import { MoreHorizontal } from 'react-feather';
import moment from 'moment';
// import ProgressiveImage from 'rn-progressive-image'
import { useAuth } from '../Api/AuthApi';
import { listenToAllPosts, listenToUsers, savePostForUser, removeSavedPostForUser } from '../Api/CommanApi';
import PostLoading from './LoadingComponents/PostLoading';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import DeleteButtonModal from './Modal/DeleteButtonModal';
import { CommentsComponent } from './CommentsComponent';
import { PostActions } from './PostActions';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Postcontent = ({ userProfileData, savedPost, isOwnPost }) => {


    const { userData } = useAuth();
    const currentUserId = userData?.userID;
    const savedPostsSet = useMemo(() => new Set(userData?.savedPosts || []), [userData?.savedPosts]);


    const [userPost, setUserPost] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [, setOpenComments] = useState(false);
    const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
    const [savingPostId, setSavingPostId] = useState(null);


    useEffect(() => {
        // Fetch posts and users simultaneously
        const unsubscribePosts = listenToAllPosts((posts) => {
            setUserPost(posts);
            setIsLoadingPosts(false);
        });

        const unsubscribeUsers = listenToUsers((users) => {
            setUsersData(users);
            setIsLoadingUsers(false);
        });

        // Cleanup function
        return () => {
            unsubscribePosts();
            unsubscribeUsers();
        };
    }, []);

    // Filter posts for the given user
    const postDatas = userPost.map((post) => {
        const postUser = usersData.find((user) => user.userID === post.userID)

        return {
            ...post,
            user: postUser,
            isSaved: savedPostsSet.has(post.id),
        };
    });

    const filteredPosts = useMemo(() => {
        let posts = [...postDatas];

        if (userProfileData) {
            posts = posts.filter((post) => post.userID === userProfileData);
        }

        if (savedPost) {
            posts = posts.filter((post) => savedPostsSet.has(post.id));
        }

        posts = posts.filter((post) => {
            const isOwner = post.userID === currentUserId;
            const isPublic = post.visiblity !== false;

            if (!isOwner && !isPublic) {
                return false;
            }

            if (userProfileData && userProfileData !== currentUserId) {
                return isPublic;
            }

            if (!userProfileData && !savedPost) {
                return isOwner || isPublic;
            }

            return true;
        });

        posts.sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;
            return bTime - aTime;
        });

        return posts;
    }, [postDatas, userProfileData, savedPost, savedPostsSet, currentUserId]);


    // Check if either posts or users are still loading
    if (isLoadingPosts || isLoadingUsers) {
        return <PostLoading />;
    }


    const handleDeletePost = (postId) => {
        setSelectedPostId(postId);
    };

    const handleToggleSavePost = async (postId, shouldSave) => {
        if (!currentUserId) {
            toast.error('You need to be signed in to save posts.');
            return;
        }

        try {
            setSavingPostId(postId);
            if (shouldSave) {
                await savePostForUser(currentUserId, postId);
                toast.success('Post saved to your collection.');
            } else {
                await removeSavedPostForUser(currentUserId, postId);
                toast.success('Removed from saved posts.');
            }
        } catch (error) {
            toast.error('Unable to update saved posts. Please try again.');
        } finally {
            setSavingPostId(null);
        }
    };

    const getEmptyState = () => {
        if (savedPost) {
            return (
                <div className="text-center p-20">
                    <h2 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">No saved posts yet</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't saved any posts yet. To save a post, click on the save option from the post menu.</p>
                </div>
            );
        }

        if (userProfileData && userProfileData !== currentUserId) {
            return (
                <div className="text-center p-20">
                    <h2 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">No posts found</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">This user hasn't shared any public posts yet.</p>
                </div>
            );
        }

        if (userProfileData && userProfileData === currentUserId) {
            return (
                <div className="text-center p-20">
                    <h2 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">No posts yet</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Share your first post to get started.</p>
                </div>
            );
        }

        return (
            <div className="text-center p-20">
                <h2 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">No posts available</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Follow more people or share something to see it here.</p>
            </div>
        );
    };


    if (filteredPosts.length === 0) {
        return getEmptyState();
    }


    const toggleComments = (postId) => {
        // If the clicked post already has its comments open, close it (set to null)
        if (openCommentsPostId === postId) {
            setOpenCommentsPostId(null);
        } else {
            // Otherwise, open the clicked post's comments and close others
            setOpenCommentsPostId(postId);
        }
    };


    return (
        <>
            <div>
                {filteredPosts.map((post) => (
                    <div key={post?.id} className="post-content">
                        {/* Post Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                            <div className="p-4">
                                {/* Post Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <Link
                                        to={`/profile/${post.userID}`}
                                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                    >
                                        <img
                                            src={post.user?.profilePic || 'https://placehold.co/100x100'}
                                            alt={post.user?.name || 'User'}
                                            className="w-10 h-10 rounded-full cursor-pointer"
                                        />
                                        <div>
                                            <div className="items-center gap-2">
                                                <span className="font-medium text-gray-900 dark:text-white cursor-pointer ">
                                                    {post.user?.name || 'User'}
                                                </span>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {post.createdAt?.seconds ? moment(post.createdAt.seconds * 1000).fromNow() : 'Just now'}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        {post.visiblity === false && post.userID === currentUserId && (
                                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">Private</span>
                                        )}
                                        <Menu as="div" className="relative">
                                            <MenuButton className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </MenuButton>

                                            <MenuItems
                                                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700"
                                            >
                                                <MenuItem>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleSavePost(post.id, !post.isSaved)}
                                                        disabled={savingPostId === post.id}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700 focus:bg-blue-100 focus:outline-none rounded-md disabled:opacity-60"
                                                    >
                                                        {savingPostId === post.id
                                                            ? 'Updating...'
                                                            : post.isSaved
                                                                ? 'Remove from saved'
                                                                : 'Save post'}
                                                    </button>
                                                </MenuItem>
                                                {post.userID === currentUserId && (
                                                    <MenuItem>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeletePost(post.id)}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700 focus:bg-blue-100 focus:outline-none rounded-md"
                                                        >
                                                            Delete the post
                                                        </button>
                                                    </MenuItem>
                                                )}
                                                <MenuItem>
                                                    <button
                                                        type="button"
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700 focus:bg-blue-100 focus:outline-none rounded-md"
                                                    >
                                                        More options coming soon
                                                    </button>
                                                </MenuItem>
                                            </MenuItems>
                                        </Menu>
                                    </div>
                                </div>

                                {/* Post Content */}
                                {post.content && (
                                    <p className="text-gray-900 dark:text-white mb-4 whitespace-pre-wrap">
                                        {post.content}
                                    </p>
                                )}

                                {/* Post Image */}
                                {post.imageUrl && (
                                    <LazyLoadImage
                                        src={post.imageUrl}
                                        alt="Post"
                                        effect="blur"

                                        className="w-full h-auto object-cover rounded-lg mb-4"
                                    />
                                )}


                                {/* Post Actions */}
                                <PostActions postId={post.id} postData={userPost} allPostData={post} setOpenComments={setOpenComments} toggleComments={toggleComments} />
                            </div>
                        </div>
                        {openCommentsPostId === post.id && <CommentsComponent postId={post.id} commenter={post.user} />}


                        {/* Modal for deleting post */}
                        {selectedPostId && (
                            <DeleteButtonModal
                                isOpen={true}
                                setIsOpen={() => setSelectedPostId(null)}
                                postId={selectedPostId}

                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};
