import React, { useEffect, useState } from 'react'
import { Image } from 'react-feather'
import { useAuth } from '../Api/AuthApi'
import { listenToSingleUser } from '../Api/CommanApi'
import { PostCreationModal } from './Modal/PostCreationModal';


export const PostCreation = () => {

    const { currentUser } = useAuth()

    const [userData, setUserData] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)



    useEffect(() => {
        if (currentUser?.uid) {
            const unsubscribe = listenToSingleUser(setUserData, currentUser.uid);
            return () => {
                unsubscribe();
            };

        }
    }, [])




    return (

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex gap-3">
                <div className="skeleton-circle h-10 w-10 ">
                    <img
                        src={userData?.profilePic}

                        className="w-10 h-10  object-cover rounded-full"
                    />

                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <Image className="w-5 h-5" />
                    <span>Add Media</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Post
                </button>
                <PostCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </div>

    )
}
