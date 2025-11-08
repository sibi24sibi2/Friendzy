import { useState, useMemo } from 'react'
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

    const isShareDisabled = useMemo(() => {
        return !caption.trim() && !selectedFile
    }, [caption, selectedFile])

    if (!isOpen) return null

    const resetForm = () => {
        setIsPublic(true)
        setSelectedFile(null)
        setPreview(null)
        setCaption('')
        setLoading(false)
    }

    const handleClose = () => {
        if (!loading) {
            resetForm()
            onClose()
        }
    }

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
        setSelectedFile(null)
        setPreview(null)
    }

    const onHandleSumbit = async () => {
        if (isShareDisabled) {
            toast.error('Add a caption or upload media before sharing.')
            return
        }

        if (!userData?.userID) {
            toast.error('Please sign in to share a post.')
            return
        }

        try {
            setLoading(true)
            const randomPostID = crypto.randomUUID();
            await addPost(caption.trim(), selectedFile, userData.userID, randomPostID, isPublic)

            resetForm()
            onClose();
        }
        catch (err) {
            console.error(err)
            toast.error('Error while posting')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div className="flex justify-center p-10 px-4 pt-6">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create a post</h2>
                        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <X size={22} />
                        </button>
                    </div>

                    <div className="px-6 py-5 space-y-6">
                        <div className="flex items-start gap-3">
                            <img
                                src={userData?.profilePic || 'https://placehold.co/100x100'}
                                alt={userData?.name || 'User avatar'}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{userData?.name || 'User'}</p>
                                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-700 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsPublic(true)}
                                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition ${isPublic ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                                    >
                                        <Globe size={14} /> Public
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPublic(false)}
                                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition ${!isPublic ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                                    >
                                        <Lock size={14} /> Only me
                                    </button>
                                </div>
                            </div>
                        </div>

                        <textarea
                            placeholder="Share your thoughts..."
                            className="w-full min-h-[120px] resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />

                        <div className="space-y-3">
                            {preview ? (
                                <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-48 object-contain bg-gray-50 dark:bg-gray-800 transition-transform duration-200 "
                                    />
                                    <button
                                        onClick={cancelFileSelection}
                                        className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        title="Remove file"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:border-blue-400 dark:hover:border-blue-400 transition">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                    />
                                    <Upload size={28} className="text-blue-500" />
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Upload media</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Drag & drop, or click to browse</p>
                                    </div>
                                </label>
                            )}
                        </div>

                    </div>

                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isPublic ? 'Visible to everyone on Friendzy.' : 'Visible only to you.'}
                        </p>
                        <div className="flex items-center gap-2">
                            {preview && (
                                <button
                                    type="button"
                                    onClick={cancelFileSelection}
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    Remove media
                                </button>
                            )}
                            <button
                                onClick={onHandleSumbit}
                                disabled={loading || isShareDisabled}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${loading || isShareDisabled ? 'bg-blue-300 dark:bg-blue-800 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={18} />
                                        Posting...
                                    </>
                                ) : 'Share'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

