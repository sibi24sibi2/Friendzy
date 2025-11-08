import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { welcomeMainImage } from '../assets/assets';
import { useAuth } from '../Api/AuthApi';
import { NavLink } from 'react-router-dom';
import TopNav from '../Components/top-nav';

const ContactUs = () => {

    const { currentUser } = useAuth();


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        // Reset form after submission
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="bg-gray-100 min-h-screen py-12 pt-36 lg:pt-28 lg:px-auto px-4">
            <TopNav />
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="relative ">
                        <img
                            src={welcomeMainImage[5]}
                            alt="Placeholder"
                            className=" mx-auto    md:w-auto w-1/2"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-blue-800 mb-6">Get in Touch</h2>
                        <p className="text-gray-700 mb-8">
                            We'd love to hear from you! Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <FaEnvelope className="text-blue-600 mr-4 text-xl" />
                                <span className="text-gray-700">support@friendzy.com</span>
                            </div>
                            <div className="flex items-center">
                                <FaPhone className="text-blue-600 mr-4 text-xl" />
                                <span className="text-gray-700">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center">
                                <FaMapMarkerAlt className="text-blue-600 mr-4 text-xl" />
                                <span className="text-gray-700">123 Social Street, Internet City, 94000</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 font-semibold">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
