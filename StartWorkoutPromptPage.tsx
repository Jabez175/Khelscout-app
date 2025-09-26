import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { CameraIcon, VideoIcon } from './Icons';

const StartWorkoutPromptPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { workout } = location.state || {}; // Get workout from route state

    const title = workout?.title || "Start Workout";

    return (
        <Layout title={title} showBackButton>
            <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-[#1A2E29] p-8 rounded-2xl shadow-lg w-full">
                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Go?</h2>
                    <p className="text-gray-400 mb-8">Choose how you want to record your performance for AI analysis.</p>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/record-workout')}
                            className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors text-lg"
                        >
                            <CameraIcon />
                            <span>Start Recording</span>
                        </button>
                        <button
                            onClick={() => navigate('/record-workout')}
                            className="w-full flex items-center justify-center gap-3 bg-[#2A3F3A] text-white font-bold py-4 rounded-xl border border-gray-600 hover:bg-gray-700 transition-colors text-lg"
                        >
                            <VideoIcon />
                            <span>Upload Video</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StartWorkoutPromptPage;