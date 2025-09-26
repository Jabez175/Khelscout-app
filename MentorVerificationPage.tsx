import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, VideoIcon } from './Icons';

const MentorVerificationPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { name, role, sport } = location.state || {};

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [step, setStep] = useState(1);

    const handleChooseVideo = () => {
        setIsUploading(true);
        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally submit all the form data and video to your backend
        console.log("Submitting mentor verification for:", { name, role, sport });
        
        // Navigate to the onboarding flow instead of logging in directly
        if (role && sport) {
            navigate('/mentor-onboarding', { state: { name, role, sport } });
        } else {
            navigate('/login');
        }
    };
    
    const StepIndicator = () => (
        <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1 px-1">
                <span className={step >= 1 ? 'font-bold text-white' : ''}>Profile Details</span>
                <span className={step >= 2 ? 'font-bold text-white' : ''}>Verification Video</span>
            </div>
            <div className="flex items-center gap-2">
                <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-emerald-400' : 'bg-gray-700'}`}></div>
                <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-emerald-400' : 'bg-gray-700'}`}></div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#0D1A18] p-6">
            <header className="flex items-center mb-4 -ml-2">
                <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="p-2">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-white mx-auto pr-8">Mentor Account Setup</h1>
            </header>

            <StepIndicator />

            <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                <div className="flex-grow overflow-y-auto">
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-white">Set Up Your Mentor Profile</h2>
                            <p className="text-gray-400 mt-2 mb-6">Tell us about your expertise and coaching philosophy. This will be visible to athletes.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                                    <input type="text" defaultValue={name} placeholder="Enter your full name" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Specialization</label>
                                    <input type="text" placeholder="e.g., Basketball Shooting Coach" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                                    <textarea placeholder="Describe your training philosophy and experience" rows={4} className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-white">Verify Your Training Expertise</h2>
                            <p className="text-gray-400 mt-2 mb-6">To ensure authenticity, please upload a video of you demonstrating a key training drill. Our AI will analyze it for originality.</p>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-3">Upload Training Video</h3>
                                <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center bg-[#1A2E29]/50">
                                    <div className="bg-emerald-400/20 inline-block p-4 rounded-full mb-4">
                                        <VideoIcon />
                                    </div>
                                    <p className="font-semibold text-white">Tap to Upload</p>
                                    <p className="text-xs text-gray-400 mt-1">Max video length: 5 minutes. Clearly show you performing the exercise.</p>
                                    <button type="button" onClick={handleChooseVideo} className="mt-4 bg-emerald-400 text-[#0D1A18] font-bold py-2 px-6 rounded-lg hover:bg-emerald-500 transition-colors text-sm">
                                        Choose Video
                                    </button>
                                </div>
                            </div>

                            {isUploading && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-3">Verification Progress</h3>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-emerald-400 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                    <p className="text-right text-emerald-400 text-sm mt-2">{uploadProgress}% Complete</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 flex gap-4">
                    {step === 1 && (
                        <button type="button" onClick={() => setStep(2)} className="w-full bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors">
                            Next: Upload Video
                        </button>
                    )}
                    {step === 2 && (
                        <>
                            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#1A2E29] text-white font-bold py-3 rounded-xl border border-gray-700 hover:bg-gray-700">
                                Back
                            </button>
                            <button type="submit" className="flex-grow bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors">
                                Submit for Verification
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default MentorVerificationPage;