import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XIcon, CameraIcon, CalendarIcon, TagIcon } from './Icons';

const CreatePostPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="bg-[#0D1A18] text-white min-h-screen">
            <div className="max-w-md mx-auto flex flex-col h-screen">
                <header className="flex items-center justify-between p-4">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <XIcon />
                    </button>
                    <h1 className="text-xl font-bold">Create Post</h1>
                    <div className="w-10"></div>
                </header>

                <main className="flex-grow px-4">
                    <div className="bg-[#1A2E29] rounded-lg p-1 flex mb-4">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'create' ? 'bg-emerald-400 text-[#0D1A18]' : 'text-gray-300'}`}
                        >
                            Create Post
                        </button>
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'live' ? 'bg-emerald-400 text-[#0D1A18]' : 'text-gray-300'}`}
                        >
                            Go Live
                        </button>
                    </div>

                    <textarea
                        placeholder="What's on your mind, Mentor?"
                        className="w-full h-36 bg-[#1A2E29] rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                    ></textarea>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <button className="flex flex-col items-center justify-center bg-[#1A2E29] h-24 rounded-lg text-gray-300 hover:bg-gray-700">
                            <CameraIcon />
                            <span className="text-xs mt-2">Photo/Video</span>
                        </button>
                        <button className="flex flex-col items-center justify-center bg-[#1A2E29] h-24 rounded-lg text-gray-300 hover:bg-gray-700">
                            <CalendarIcon />
                            <span className="text-xs mt-2">Schedule</span>
                        </button>
                        <button className="flex flex-col items-center justify-center bg-[#1A2E29] h-24 rounded-lg text-gray-300 hover:bg-gray-700">
                            <TagIcon />
                            <span className="text-xs mt-2">Tag Products</span>
                        </button>
                    </div>
                </main>

                <footer className="p-4">
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors"
                    >
                        Publish
                    </button>
                </footer>
                
                {/* The create page replaces the bottom nav */}
            </div>
        </div>
    );
};

export default CreatePostPage;