import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityIcon, ArrowRightIcon, VideoIcon, XIcon, DumbbellIcon, BriefcaseIcon } from './Icons';
import { LeafIcon } from './Icons';

interface AiHubModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeatureCard: React.FC<{ title: string; description: string; to: string; icon: React.ReactNode; onClose: () => void }> = ({ title, description, to, icon, onClose }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        onClose();
        navigate(to);
    };
    return (
        <button
            onClick={handleClick}
            className="w-full bg-[#0E1B17] p-4 rounded-xl text-left flex items-center justify-between ring-1 ring-white/10 hover:ring-emerald-400/50 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="bg-emerald-400/10 text-emerald-400 p-3 rounded-lg">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-white">{title}</h3>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>
            </div>
            <div className="text-gray-500">
                <ArrowRightIcon />
            </div>
        </button>
    );
};

const AiHubModal: React.FC<AiHubModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const handleNavigate = (path: string) => {
        onClose();
        navigate(path);
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[99] flex items-end transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-[#0E1B17]/80 backdrop-blur-xl ring-1 ring-white/10 w-full max-w-md mx-auto rounded-t-2xl transition-transform duration-300 ease-in-out flex flex-col max-h-[90vh] overflow-y-auto"
                style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 flex-shrink-0 px-4 pt-4 bg-[#0E1B17]/80 backdrop-blur-xl z-10">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">AI Assessment Hub</h2>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <XIcon />
                        </button>
                    </div>
                </div>
                
                <div className="px-4 pb-4">
                    <div className="space-y-6 pt-4">
                        <section>
                            <p className="text-gray-300 text-center mb-6">Your central hub for AI-powered performance assessment and verification.</p>
                            <div className="space-y-4">
                                 <FeatureCard 
                                    title="SAI National Tests"
                                    description="Complete standardized tests for official assessment."
                                    to="/skill-test"
                                    icon={<ActivityIcon />}
                                    onClose={onClose}
                                />
                                 <FeatureCard 
                                    title="AI Guided Training"
                                    description="Follow workouts tailored for your sport."
                                    to="/training"
                                    icon={<DumbbellIcon />}
                                    onClose={onClose}
                                />
                                 <FeatureCard 
                                    title="AI Diet Planner"
                                    description="Get a personalized meal plan for your goals."
                                    to="/diet-planner"
                                    icon={<LeafIcon />}
                                    onClose={onClose}
                                />
                                <FeatureCard 
                                    title="AI Career Advisor"
                                    description="Get AI guidance on your sports career path."
                                    to="/career-advisor"
                                    icon={<BriefcaseIcon />}
                                    onClose={onClose}
                                />
                            </div>
                        </section>
                         
                        <section>
                            <h2 className="text-xl font-bold mb-4">AI Video Verification</h2>
                            <div className="bg-[#050e0c] rounded-2xl p-4 ring-1 ring-white/10">
                               <p className="text-sm text-gray-400 mb-4">Our AI analyzes your uploaded videos to verify performance and detect cheating, ensuring fair and accurate results.</p>
                               <button 
                                    onClick={() => handleNavigate('/record-workout')} 
                                    className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                               >
                                   <VideoIcon /> Analyze Video
                               </button>
                            </div>
                        </section>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AiHubModal;