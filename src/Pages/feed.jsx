
import { PostCreation } from '../Components/post-creation'
import { Postcontent } from '../Components/Post-content';
import { useEffect, useState } from 'react';
import { listenToAllPosts } from '../Api/CommanApi';
import { useAuth } from '../Api/AuthApi';

export default function FeedPage() {






  return (

    <div className="space-y-6">
      {/* Post Creation */}

      <PostCreation />
      {/* Posts Feed */}
      <div className="space-y-6">
        <Postcontent isPublicPost />

      </div>
    </div>

  )
}

