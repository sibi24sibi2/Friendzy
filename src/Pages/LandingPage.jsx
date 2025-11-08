import {
  FaUserFriends, FaComments,
   FaGlobe, FaMobile, FaHashtag, FaUserCircle, FaRegSmile,
  FaCamera, FaVideo, FaUsers,
 
} from 'react-icons/fa'
import { IoMdPhotos } from 'react-icons/io'
import { MdGroups, MdExplore } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import { welcomeMainImage } from '../assets/assets'
import { useAuth } from '../Api/AuthApi'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faAppStoreIos, faGooglePlay } from '@fortawesome/free-brands-svg-icons'
import TopNav from '../Components/top-nav'

export default function LandingPage() {

  const { currentUser } = useAuth();


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-10 lg:px-auto px-4">
    
    <TopNav/>
      {/* Hero Section */}
      <section className="pt-12 pb-16 lg:pt-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Connect, Share, <span className="text-blue-600">Thrive</span> Together
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join millions of people who use Friendzy to share moments, build relationships, and create meaningful connections in a vibrant online community.
              </p>
              <div className="flex gap-4">

                {currentUser ?
                  <NavLink to="/home">
                    <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition text-lg">
                      Explore Now
                    </button>
                  </NavLink>
                  :
                  <NavLink to="/signup">
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-lg">
                      Get Started Free
                    </button>
                  </NavLink>
                }




              </div>
            </div>
            <div className="relative">
              <img
                src={welcomeMainImage[4]}
                alt="Social Connection"
                className="rounded-2xl "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10M+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100M+</div>
              <div className="text-gray-600">Shared Posts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Everything you need to connect</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <FaUserFriends className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Connect Friends</h3>
              <p className="text-sm text-gray-600">Find and connect with friends worldwide</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <IoMdPhotos className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Share Moments</h3>
              <p className="text-sm text-gray-600">Share your precious moments instantly</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <MdGroups className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Join Groups</h3>
              <p className="text-sm text-gray-600">Find your community of interest</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <FaComments className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600">Real-time messaging with friends</p>
            </div>
          </div>
        </div>
      </section>



      {/* Features Showcase */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Share Your Story</h2>
              <p className="text-lg text-gray-600 mb-8">
                Express yourself through photos, videos, and stories. Connect with friends and family in meaningful ways.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaCamera className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Photo Sharing</h3>
                    <p className="text-gray-600">Share your moments with beautiful filters</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaVideo className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Video Stories</h3>
                    <p className="text-gray-600">Create engaging video content</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaRegSmile className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Interactive Reactions</h3>
                    <p className="text-gray-600">React with emojis and comments</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={welcomeMainImage[3]}
                alt="Share Features"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* How It Works */}
          <section className="py-16 bg-gray-50 my-6 lg:my-32">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How Friendzy Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUserCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Create Profile</h3>
                  <p className="text-gray-600">Set up your personal profile with photos, interests, and bio</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUsers className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Connect People</h3>
                  <p className="text-gray-600">Find and connect with friends, family, and like-minded individuals</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IoMdPhotos className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Share Content</h3>
                  <p className="text-gray-600">Share photos, videos, stories, and updates with your network</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src={welcomeMainImage[1]}
                alt="Community Features"
                className="rounded-2xl "
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Build Communities</h2>
              <p className="text-lg text-gray-600 mb-8">
                Create and join communities around shared interests. Connect with people who share your passions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MdGroups className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Group Discussions</h3>
                    <p className="text-gray-600">Engage in meaningful conversations</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaHashtag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Trending Topics</h3>
                    <p className="text-gray-600">Stay updated with what's popular</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MdExplore className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Discover Content</h3>
                    <p className="text-gray-600">Explore new interests and topics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://i.pravatar.cc/150?img=33"
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">Digital Creator</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Friendzy has transformed how I connect with my audience. The engagement features are incredible!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://i.pravatar.cc/150?img=17"
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">Mike Chen</h3>
                  <p className="text-sm text-gray-600">Community Leader</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Building a community has never been easier. The group features are powerful and intuitive."
              </p></div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://i.pravatar.cc/150?img=45"
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">Lisa Taylor</h3>
                  <p className="text-sm text-gray-600">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The platform helped me grow my business network exponentially. The professional features are outstanding!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Take Friendzy Everywhere</h2>
              <p className="text-lg text-gray-600 mb-8">
                Stay connected on the go with our mobile app. Available for iOS and Android devices.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <FaMobile className="w-6 h-6 text-blue-600" />
                  <p className="text-gray-600">Real-time notifications</p>
                </div>
                <div className="flex items-center gap-4">
                  <FaCamera className="w-6 h-6 text-blue-600" />
                  <p className="text-gray-600">Quick photo and video sharing</p>
                </div>
                <div className="flex items-center gap-4">
                  <FaGlobe className="w-6 h-6 text-blue-600" />
                  <p className="text-gray-600">Access anywhere, anytime</p>
                </div>
              </div>
              <div className="flex gap-4 lg:flex-row flex-col">
                <button className="lg:px-6 lg:py-3 py-2 px-4  bg-black text-white rounded-lg hover:bg-gray-800 transition">
                  {/* <FontAwesomeIcon icon={faAppStoreIos} className=' float-left py-1  px-2' />Download for iOS */}
                </button>
                <button className="lg:px-6 lg:py-3 py-2 px-4  bg-black text-white rounded-lg hover:bg-gray-800 transition">
                  {/* <FontAwesomeIcon icon={faGooglePlay} className='float-left py-1 px-2 ' />  Download for Android */}
                </button>

                
              </div>
            </div>
            <div>
              <img
                src={welcomeMainImage[0]}

                alt="Mobile App"
                className="rounded-2xl "
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Connect?</h2>
            <p className="text-lg mb-8 text-blue-100">Join our growing community of millions and start sharing your story today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition text-lg font-semibold">
                Create Free Account
              </button>
              <button className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition text-lg font-semibold border border-blue-400">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}

