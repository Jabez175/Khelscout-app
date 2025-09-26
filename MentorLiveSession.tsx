import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { XIcon, MicIcon, VideoIcon } from './Icons'; // Assuming these exist

// Mock user data
const ATHLETES_DATA: { [key: string]: { name: string; avatarUrl: string } } = {
    'athlete1': { name: 'Ethan Carter', avatarUrl: 'https://picsum.photos/seed/ethan/100' },
    'athlete2': { name: 'Sophia Chen', avatarUrl: 'https://picsum.photos/seed/sophia/100' },
};

const MentorLiveSession: React.FC = () => {
    const navigate = useNavigate();
    const { athleteId } = useParams<{ athleteId: string }>();
    const athlete = athleteId ? ATHLETES_DATA[athleteId] : null;

    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col z-50">
            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <div>
                    <h1 className="text-xl font-bold">Live Session</h1>
                    <p className="text-sm text-gray-300">with {athlete?.name || 'Athlete'}</p>
                </div>
                <button onClick={() => navigate(-1)} className="p-2 bg-red-600 text-white rounded-full">
                    End Session
                </button>
            </header>

            <div className="flex-grow flex items-center justify-center bg-black relative">
                {/* Mock Athlete Video Feed */}
                <img src="https://picsum.photos/seed/livefeed/400/800" className="w-full h-full object-cover opacity-80" alt="Athlete live feed" />

                {/* Mock Annotation Overlay */}
                <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 400 800">
                        {/* Example annotation: circle */}
                        <circle cx="200" cy="450" r="50" stroke="yellow" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                        {/* Example annotation: text */}
                        <text x="200" y="380" fill="yellow" fontSize="16" textAnchor="middle">Keep elbow high</text>
                    </svg>
                </div>
            </div>

            <footer className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex justify-center items-center gap-4">
                    <button className="bg-white/20 p-4 rounded-full"><MicIcon /></button>
                    <button className="bg-white/20 p-4 rounded-full"><VideoIcon /></button>
                    {/* Mock Annotation Tools */}
                    <button className="bg-yellow-500/50 p-4 rounded-full border-2 border-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default MentorLiveSession;