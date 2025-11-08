import React from 'react'
import { Postcontent } from '../Components/Post-content'

function SavedPost() {
    return (
        <div className="space-y-6">
            {/* Post Creation */}
            {/* Posts Feed */}
            <div className="space-y-6">
                <Postcontent savedPost />

            </div>
        </div>
    )
}

export default SavedPost