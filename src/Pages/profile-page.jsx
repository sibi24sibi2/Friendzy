
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'; // Use Link for navigation
import { Settingspage } from './Settings-page';
import { useAuth } from '../Api/AuthApi';
import { Postcontent } from '../Components/Post-content';
import { listenToAllPosts, listenToUserFollowers, listenToUserFollowing, listenToUserPosts, listenToSingleUser } from '../Api/CommanApi';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const location = useLocation();
  const { userData: currentUserData } = useAuth();
  
  // Extract userID from pathname
  // Path structure: /profile or /profile/:userID or /profile/:userID/saved-post, etc.
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  // Check if we're on a known route (saved-post, settings) or if it's a userID
  const secondSegment = pathParts[1];
  const isKnownRoute = secondSegment === 'saved-post' || secondSegment === 'settings';
  
  // If there's a second segment and it's not a known route, treat it as a userID
  // If there's no second segment or it's a known route, show own profile
  const profileUserID = secondSegment && !isKnownRoute ? secondSegment : null;
  
  const viewingOwnProfile = !profileUserID || profileUserID === currentUserData?.userID;
  const targetUserID = profileUserID || currentUserData?.userID;

  const [profileUserData, setProfileUserData] = useState(null);
  const [ownPostCount, setOwnPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch profile user data
  useEffect(() => {
    if (!targetUserID) return;
    
    setIsLoadingProfile(true);
    
    if (viewingOwnProfile) {
      // Use current user data directly
      setProfileUserData(currentUserData);
      setIsLoadingProfile(false);
    } else {
      // Fetch other user's data
      const unsubscribe = listenToSingleUser((user) => {
        setProfileUserData(user);
        setIsLoadingProfile(false);
      }, targetUserID);
      
      return () => unsubscribe();
    }
  }, [targetUserID, viewingOwnProfile, currentUserData]);

  // Fetch counts for the target user
  useEffect(() => {
    if (!targetUserID) return;
    
    listenToUserPosts(targetUserID, setOwnPostCount);
    listenToUserFollowers(targetUserID, setFollowersCount);
    listenToUserFollowing(targetUserID, setFollowingCount);
  }, [targetUserID]);


  // Build base path for navigation links
  const baseProfilePath = viewingOwnProfile ? '/profile' : `/profile/${targetUserID}`;

  if (isLoadingProfile || !profileUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=' min-h-screen'>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
        <div className="px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 -mt-16">
            <div className="skeleton-circle w-32 h-32">
              <img
                src={profileUserData?.profilePic || 'https://placehold.co/100x100'}
                alt={profileUserData?.name || 'User'}
                className=" rounded-full h-full w-full p-[1px] object-cover border-4 border-white dark:border-gray-800"
              />
            </div>
            <div className="text-center sm:text-left mt-4 sm:mt-16">
              <div className=" gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileUserData?.name || 'User'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{`@ ${profileUserData?.username || 'user_name'}`}</p>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{profileUserData?.role || ''}</p>
            </div>
            <div className="flex gap-6 lg:ml-auto mt-4 sm:mt-16">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{ownPostCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{followersCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{followingCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <Link 
              to={baseProfilePath} 
              className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-blue-400 dark:border-blue-400"
            >
              {viewingOwnProfile ? 'My Posts' : 'Posts'}
            </Link>
            {viewingOwnProfile && (
              <>
                <Link 
                  to={`${baseProfilePath}/saved-post`} 
                  className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Saved Posts
                </Link>
                <Link 
                  to={`${baseProfilePath}/settings`} 
                  className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Settings
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Add Routes to render different components */}
        <Routes>
          <Route path="" element={<Postcontent userProfileData={targetUserID} isOwnPost={viewingOwnProfile} />} />
          {viewingOwnProfile && (
            <>
              <Route path="saved-post" element={<Postcontent savedPost />} />
              <Route path="settings" element={<Settingspage />} />
            </>
          )}
          {/* Handle case where nested route is a userID (shouldn't happen, but handle gracefully) */}
          <Route path="*" element={<Postcontent userProfileData={targetUserID} isOwnPost={viewingOwnProfile} />} />
        </Routes>
      </div>
    </div>
  );
}
