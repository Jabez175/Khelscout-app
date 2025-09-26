import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XIcon } from './Icons';

interface StartLiveSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Dummy data for mentor's athletes roster
const athletesRoster = [
    { id: 'athlete1', name: 'Ethan Carter', avatar: 'https://picsum.photos/seed/ethan/100' },
    { id: 'athlete2', name: 'Sophia Chen', avatar: 'https://picsum.photos/seed/sophia/100' },
    { id: 'athlete3', name: 'Liam Rodriguez', avatar: 'https://picsum.photos/seed/liam/100' },
];

const StartLiveSessionModal: React.FC<StartLiveSessionModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleStartSession = () => {
        if (selectedAthleteId) {
            console.log(`Starting live session with athlete: ${selectedAthleteId}`);
            onClose();
            navigate(`/live-session/${selectedAthleteId}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1A2E29] w-full max-w-sm rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Start Live Session</h2>
                    <button onClick={onClose} className="p-2 -mr-2"><XIcon /></button>
                </div>
                <p className="text-sm text-gray-300">Choose an athlete to begin a one-on-one live feedback session.</p>

                <div className="space-y-3 max-h-60 overflow-y-auto border-t border-b border-gray-700 py-3">
                    {athletesRoster.map(athlete => (
                        <div 
                            key={athlete.id} 
                            onClick={() => setSelectedAthleteId(athlete.id)}
                            className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${selectedAthleteId === athlete.id ? 'bg-emerald-500/20 ring-1 ring-emerald-400' : 'hover:bg-gray-700/50'}`}
                        >
                            <input 
                                type="radio"
                                id={`athlete-${athlete.id}`}
                                name="live-session-athlete"
                                value={athlete.id}
                                checked={selectedAthleteId === athlete.id}
                                onChange={() => setSelectedAthleteId(athlete.id)}
                                className="h-4 w-4 accent-emerald-500"
                            />
                            <img src={athlete.avatar} alt={athlete.name} className="w-10 h-10 rounded-full mx-3" />
                            <label htmlFor={`athlete-${athlete.id}`} className="text-white font-medium cursor-pointer">{athlete.name}</label>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={handleStartSession}
                    disabled={!selectedAthleteId}
                    className="w-full mt-2 bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 disabled:bg-gray-600"
                >
                    Start Session
                </button>
            </div>
        </div>
    );
};

export default StartLiveSessionModal;