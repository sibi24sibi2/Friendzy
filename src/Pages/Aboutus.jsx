import React from 'react';
import { FaUsers, FaLightbulb, FaHeart } from 'react-icons/fa';
import { welcomeMainImage } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Api/AuthApi';
import TopNav from '../Components/top-nav';

const AboutUs = () => {

    const { currentUser } = useAuth();

    return (
        <div className="bg-gray-100 min-h-screen py-12  pt-36 lg:pt-28  lg:px-auto px-4">
            <TopNav />
            <div className="container mx-auto px-4">
                {/* <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">About Friendzy</h1> */}

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div >
                        <img src={welcomeMainImage[2]} alt="About Friendzy" className=" mx-auto h-80 " />
                    </div>
                    <div>
                        <h2 className="text-3xl font-semibold text-blue-800 mb-4">Our Mission</h2>
                        <p className="text-gray-700 mb-6">
                            At Friendzy, we're on a mission to bring people together in meaningful ways. We believe in the power of connections to transform lives, spark innovation, and create positive change in the world.
                        </p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                            Join Our Community
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        { icon: <FaUsers className="text-5xl text-blue-600 mb-4" />, title: "Connect", description: "Build meaningful relationships with people who share your interests and passions." },
                        { icon: <FaLightbulb className="text-5xl text-blue-600 mb-4" />, title: "Inspire", description: "Share your ideas and get inspired by a diverse community of creative minds." },
                        { icon: <FaHeart className="text-5xl text-blue-600 mb-4" />, title: "Grow", description: "Learn, evolve, and grow together with a supportive network of individuals." },
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                            {item.icon}
                            <h3 className="text-xl font-semibold text-blue-800 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-blue-800 mb-4">Join Us Today</h2>
                    <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                        Be part of a vibrant community that's shaping the future of social connections. Your journey with Friendzy starts here.
                    </p>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 text-lg font-semibold">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;

