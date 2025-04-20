import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { handleDeletePost } from "../../Api/CommanApi";
import toast from "react-hot-toast";

function DeleteButtonModal({ isOpen, setIsOpen, postId }) {


    const onHandleDeletePost = async () => {
        try {
            await handleDeletePost(postId);
            setIsOpen(false);
        } catch (e) {
            console.error("Failed to delete post: ", e);
            toast.error('Failed to delete post');
        }
    }


    const customTitle = "Confirm Deletion"
    const customDescription = "Are you sure you want to delete this post? This action cannot be undone."
    const customActionButton = "Yes, delete it"


    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
                <DialogPanel className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 max-w-md w-full">
                    <button
                        type="button"
                        className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    <div className="p-5 text-center">
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <DialogTitle as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
                            {customTitle || "Are you sure?"}
                        </DialogTitle>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {customDescription || "This action cannot be undone."}
                        </p>

                        <div className="mt-5 flex justify-center gap-4">
                            <button
                                type="button"
                                className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                No, cancel
                            </button>
                            <button
                                type="button"
                                className="py-2.5 px-5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
                                onClick={onHandleDeletePost}
                            >
                                {customActionButton || "Yes, I'm sure"}
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default DeleteButtonModal;
