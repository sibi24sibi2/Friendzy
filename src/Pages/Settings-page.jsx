import { useState, useEffect } from "react";
import { Edit } from "react-feather";
import { fetchUserDetails, updateUserDetails } from "../Api/CommanApi";
import { useAuth } from "../Api/AuthApi";
import { uploadProfile } from "../Api/UploadApi"; // Import the uploadProfile function

export const Settingspage = () => {

    const { isDark, setIsDark } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);


    const [notifications, setNotifications] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);

    // User data state
    const [userData, setUserData] = useState({
        fullName: "",
        username: "",
        bio: "",
        location: "",
        phoneNumber: "",
        email: "",
        website: "",
        profilePic: "",
    });

    const { userData: authUser } = useAuth(); // Get user data from authentication context

    useEffect(() => {
        const fetchProfileData = async () => {
            setProfileLoading(true); // Start the loading
            try {
                await fetchUserDetails(authUser.userID, (data) => {
                    setUserData({
                        fullName: data.name || "",
                        username: data.username || "",
                        bio: data.bio || "",
                        location: data.location || "",
                        phoneNumber: data.phoneNumber || "",
                        email: data.email || "",
                        website: data.website || "",
                        profilePic: data.profilePic || "",
                    });
                });
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setProfileLoading(false); // End the loading
            }
        };

        fetchProfileData();
    }, [authUser.userID]);


    const handleInputChange = (field, value) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    const handleProfilePicUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const profilePicURL = await uploadProfile(file);
                setUserData((prev) => ({ ...prev, profilePic: profilePicURL })); // Update the profile pic in the state
            } catch (error) {
                console.error("Error uploading profile picture:", error);

            }
        }
    };
    const handleSaveChanges = async () => {
        const updatedData = {
            name: userData.fullName || "",
            username: userData.username || "",
            bio: userData.bio || "",
            location: userData.location || "",
            phoneNumber: userData.phoneNumber || "",
            email: userData.email || "",
            website: userData.website || "",
            profilePic: userData.profilePic || "",
        };

        setIsSaving(true);
        setSaveSuccess(false);

        try {
            await updateUserDetails(authUser.userID, updatedData);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000); // reset "Saved!" message after 2s
        } catch (error) {
            console.error("Error saving changes:", error);
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <div className="space-y-6 m-5 p-5">
            {/* Profile Section */}
            <div>
                <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <img
                                src={userData.profilePic || "https://via.placeholder.com/128"}

                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                            />
                            {profileLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                    <span className="text-white text-sm">loading ...</span>
                                </div>
                            )}
                            <label
                                htmlFor="profile-pic"
                                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer"
                            >
                                <Edit size={18} />
                                <input
                                    type="file"
                                    id="profile-pic"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfilePicUpload}
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm dark:text-gray-400 font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={userData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            className="w-full px-4 dark:bg-gray-800 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm dark:text-gray-400 font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={userData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            className="w-full px-4 dark:bg-gray-800 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm dark:text-gray-400 font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                            value={userData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            rows="4"
                            className="w-full px-4 dark:bg-gray-800 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-900 dark:text-white placeholder-gray-500"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm dark:text-gray-400 font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={userData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            className="w-full px-4 dark:bg-gray-800 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm dark:text-gray-400 font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={userData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            className="w-full px-4 dark:bg-gray-800 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm dark:text-gray-400 font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full px-4 dark:bg-gray-800 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm dark:text-gray-400 font-medium text-gray-700 mb-1">Website Link</label>
                        <input
                            type="url"
                            value={userData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            className="w-full px-4 dark:bg-gray-800 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Preferences Section */}
            <div>
                <h2 className="text-lg font-semibold dark:text-gray-300 text-gray-900 mb-4">Preferences</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm dark:text-gray-400 font-medium text-gray-700">Enable Notifications</h3>
                            <p className="text-sm dark:text-gray-500 text-gray-500">Receive notifications about your account</p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? "bg-blue-600" : "bg-gray-200"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm dark:text-gray-400 font-medium text-gray-700">Dark Mode</h3>
                            <p className="text-sm text-gray-500">Switch to dark theme</p>
                        </div>
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? "bg-blue-600" : "bg-gray-200"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`w-full py-2 px-4 rounded-lg transition-colors
    ${isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
    text-white flex justify-center items-center gap-2`}
            >
                {isSaving ? (
                    <span>Saving...</span>
                ) : saveSuccess ? (
                    <span>Saved!</span>
                ) : (
                    <span>Save Changes</span>
                )}
            </button>

        </div>
    );
};
