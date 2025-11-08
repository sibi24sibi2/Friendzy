import React, { useState } from 'react'
import { Image, Edit3 } from 'react-feather'
import { useAuth } from '../Api/AuthApi'
import { PostCreationModal } from './Modal/PostCreationModal';


export const PostCreation = () => {

    const { userData } = useAuth()

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openComposer = () => setIsModalOpen(true)
    const closeComposer = () => setIsModalOpen(false)

    return (

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="skeleton-circle h-12 w-12">
                        <img
                            src={userData?.profilePic || 'https://placehold.co/100x100'}
                            alt={userData?.name || 'User avatar'}
                            className="h-12 w-12 object-cover rounded-full"
                        />
                    </div>
                    <button
                        onClick={openComposer}
                        className="flex-1 text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {`What's on your mind${userData?.name ? `, ${userData.name.split(' ')[0]}` : ''}?`}
                    </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={openComposer}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
                    >
                        <Image className="w-5 h-5" />
                        <span>Photo / Video</span>
                    </button>
                    {/* <button
                        onClick={openComposer}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
                    >
                        <Edit3 className="w-5 h-5" />
                        <span>Write Post</span>
                    </button> */}
                    <button
                        onClick={openComposer}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Create
                    </button>
                </div>
            </div>
            <PostCreationModal isOpen={isModalOpen} onClose={closeComposer} />
        </div>

    )
}
