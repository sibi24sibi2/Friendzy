import { useEffect, useState } from 'react';
import { ThumbsUp, MessageCircle, MoreHorizontal } from 'react-feather';
import moment from 'moment';
// import ProgressiveImage from 'rn-progressive-image'
import { useAuth } from '../Api/AuthApi';
import { listenToAllPosts, listenToUsers } from '../Api/CommanApi';
import PostLoading from './LoadingComponents/PostLoading';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import DeleteButtonModal from './Modal/DeleteButtonModal';
import { CommentsComponent } from './CommentsComponent';
import { PostActions } from './PostActions';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const Postcontent = ({ userProfileData, savedPost, isOwnPost }) => {


    const [userPost, setUserPost] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [setOpenComments] = useState(false);
    const [openCommentsPostId, setOpenCommentsPostId] = useState(null);


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
        };
    });

    const postData = userProfileData
        ? postDatas.filter((post) => post.userID === userProfileData)
        : postDatas;

    // Check if either posts or users are still loading
    if (isLoadingPosts || isLoadingUsers) {
        return <PostLoading />;
    }

    const handleDeletePost = (postId) => {
        setSelectedPostId(postId);
    };

    const toggleComments = (postId) => {
        // If the clicked post already has its comments open, close it (set to null)
        if (openCommentsPostId === postId) {
            setOpenCommentsPostId(null);
        } else {
            // Otherwise, open the clicked post's comments and close others
            setOpenCommentsPostId(postId);
        }
    };


    if (postData.length === 0) {
        return (
            <div className="text-center p-20">
                <h2 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">No posts found</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {userProfileData ? 'No posts found for this user.' : 'No posts found in your saved posts.'}
                </p>
            </div>
        );
    }

    if (savedPost) { //no saved post yet
        return (
            <div className="text-center p-20">
                <h2 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">No saved posts yet</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't saved any posts yet. To save a post, click on the heart icon next to the post.</p>
            </div>


        );
    }



    return (
        <>
            <div>
                {postData.map((post) => (
                    <div key={post?.id} className="post-content">
                        {/* Post Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                            <div className="p-4">
                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={post.user?.profilePic || 'https://placehold.co/100x100'}
                                            alt={post.user?.name || 'User'}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <div className="items-center gap-2">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {post.user?.name || 'User'}
                                                </span>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {moment(post.createdAt.seconds * 1000).fromNow()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Menu as="div" className="relative">
                                        <MenuButton className="p-2 rounded-full dark:text-slate-200 dark:hover:bg-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <MoreHorizontal className='w-5 h-5' />
                                        </MenuButton>
                                        <MenuItems
                                            className="absolute mt-2 w-48 bg-white dark:bg-black rounded-lg shadow-lg z-10 border dark:border-gray-800 border-gray-300 -translate-x-40"
                                        >
                                            {isOwnPost && <MenuItem>
                                                <a
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="block px-4 py-2 text-sm  dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 text-gray-700 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                                                >
                                                    Delete the post
                                                </a>
                                            </MenuItem>}
                                            <MenuItem>
                                                <a
                                                    className="block px-4 py-2 text-sm  dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 text-gray-700 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                                                >
                                                    More
                                                </a>
                                            </MenuItem>
                                        </MenuItems>
                                    </Menu>
                                </div>

                                {/* Post Content */}
                                <p className="text-gray-900 dark:text-white mb-4">
                                    {post.content}
                                </p>

                                {/* Post Image */}

                                <LazyLoadImage
                                    src={post.imageUrl}
                                    alt="Post"
                                    effect="blur"

                                    className="w-full h-auto object-cover rounded-lg mb-4"
                                />


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
