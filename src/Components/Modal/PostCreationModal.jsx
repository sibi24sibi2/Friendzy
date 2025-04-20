import { useState } from 'react'
import { X, Upload, Globe, Lock, Loader } from 'react-feather'
import { addPost } from '../../Api/CommanApi'
import { useAuth } from '../../Api/AuthApi'
import toast from 'react-hot-toast'

export function PostCreationModal({ isOpen, onClose }) {

    const { userData } = useAuth()

    const [isPublic, setIsPublic] = useState(true)
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const cancelFileSelection = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    const onHandleSumbit = async () => {
        try {
            setLoading(true)
            const randomPostID = crypto.randomUUID();
            await addPost(caption, selectedFile, userData.userID, randomPostID)
            setLoading(false)
            onClose();
        }
        catch (err) {
            console.error(err)
            toast.error('Error while posting')
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 md:m-0 m-7 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Post</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {preview ? (
                    <div className="mb-4 relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-scale-down rounded-lg"
                        />
                        <button
                            onClick={cancelFileSelection}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center mb-4">
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="fileInput"
                            className="cursor-pointer flex  justify-center items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            <Upload size={24} className="" />
                            <span className="text-sm mx-5">Upload Photo/Video</span>
                        </label>
                    </div>
                )}

                <textarea
                    placeholder="Write a caption..."
                    className="w-full p-2 mb-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows="3"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                ></textarea>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Post visibility:</span>
                    <button
                        onClick={() => setIsPublic(!isPublic)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${isPublic
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                            }`}
                    >
                        {isPublic ? (
                            <span className="flex items-center"><Globe size={14} className="mr-1" /> Public</span>
                        ) : (
                            <span className="flex items-center"><Lock size={14} className="mr-1" /> Private</span>
                        )}
                    </button>
                </div>
                <button
                    onClick={onHandleSumbit}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-300 dark:bg-gray-500 dark:text-slate-300 text-slate-700 hover:bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-600 bg-blue-500 text-white'} w-full px-4 py-2  text-center  rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center`}
                >
                    {loading ?
                        <>
                            <Loader className='mr-2' />
                            Posting...
                        </>

                        : 'Share'}

                </button>

            </div>
        </div>
    )
}

