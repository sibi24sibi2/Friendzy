import React from 'react'

const PostLoading = () => {
  return (
    <div>
          <div key="skeleton-post" className="post-content animate-pulse">

              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow">
                  <div className="p-4">

                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                              <div>
                                  <div className="items-center gap-2">
                                      <span className="font-medium text-gray-900 dark:text-white">
                                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                      </span>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                              <div className="w-5 h-5 bg-gray-300 rounded"></div>
                          </div>
                      </div>


                      <p className="text-gray-900 dark:text-white mb-4">
                          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </p>

                      <div className="w-full h-64 bg-gray-300 rounded-lg mb-4">
                      </div>


                      <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-5 w-12 rounded">
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-5 w-20 rounded">
                          </div>
                      </div>
                  </div>
              </div>


            
          </div>
    </div>
  )
}

export default PostLoading