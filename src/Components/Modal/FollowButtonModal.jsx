import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import toast from "react-hot-toast";

function FollowButtonModal({ isOpen, setIsOpen, followed, onConfirm }) {
    const customTitle = followed
        ? "Are you sure you want to unfollow this user?"
        : "Are you sure you want to follow this user?";
    const customDescription = followed
        ? "Unfollowing will remove this user from your connections."
        : "Following this user will add them to your connections.";
    const customActionButton = followed ? "Yes, Unfollow" : "Yes, Follow";

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
                <DialogPanel className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 max-w-md w-full">
                    <button
                        type="button"
                        className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    <div className="p-5 text-center">
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M715.086 175.231c84.209 83.541 84.209 219.068 0 302.609L473.844 717.177c-27.011 26.808-70.757 26.808-97.766.003L134.834 477.841c-84.209-83.541-84.209-219.068 0-302.609 79.465-78.834 205.507-83.196 290.126-13.085 84.619-70.111 210.661-65.749 290.126 13.085zm-304.55 29.078c-68.15-67.609-178.704-67.609-246.854 0-68.059 67.519-68.059 176.933 0 244.453l241.247 239.342c11.041 10.958 29.021 10.958 40.064-.003l241.244-239.34c68.059-67.519 68.059-176.933 0-244.453-68.15-67.609-178.704-67.609-246.854 0-7.985 7.921-20.863 7.921-28.847 0zm512.659 447.719c41.568 41.25 41.568 108.188-.002 149.427L817.049 906.759c-16.362 16.242-42.825 16.242-59.183.004L651.718 801.455c-41.57-41.239-41.57-108.177 0-149.429 36.964-36.67 94.329-40.671 135.737-11.999 41.408-28.671 98.773-24.671 135.739 12.001zM773.03 681.102c-25.51-25.315-66.943-25.315-92.462 0-25.423 25.228-25.423 66.056-.002 91.275l106.152 105.312c.391.388 1.084.388 1.479-.004l106.148-105.308c25.42-25.218 25.42-66.046 0-91.272-25.52-25.318-66.953-25.318-92.464-.002-7.985 7.924-20.867 7.924-28.852 0z"></path></g></svg>
                        <DialogTitle
                            as="h3"
                            className="text-lg font-medium text-gray-900 dark:text-white"
                        >
                            {customTitle}
                        </DialogTitle>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {customDescription}
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
                                className="py-2.5 px-5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-blue-800"
                                onClick={() => {
                                    onConfirm();
                                    setIsOpen(false);
                                }}
                            >
                                {customActionButton}
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default FollowButtonModal;
