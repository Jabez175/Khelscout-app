import React, { useState, useMemo } from 'react';
import Layout from './Layout';
import { useAuth } from './AuthContext';
import { Drill } from './types';
import { BookOpenIcon, VideoIcon, DumbbellIcon } from './Icons';
import AssignDrillModal from './AssignDrillModal';
import StartLiveSessionModal from './StartLiveSessionModal';
import AssignWorkoutModal from './AssignWorkoutModal';
import { DRILLS_DATA } from './constants';

const DrillLibraryPage: React.FC = () => {
    const { user } = useAuth();
    const [isAssignDrillModalOpen, setAssignDrillModalOpen] = useState(false);
    const [isLiveSessionModalOpen, setLiveSessionModalOpen] = useState(false);
    const [isWorkoutModalOpen, setWorkoutModalOpen] = useState(false);
    const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);

    const drills = useMemo(() => {
        if (!user?.sport || !DRILLS_DATA[user.sport]) {
            return [];
        }
        return DRILLS_DATA[user.sport];
    }, [user?.sport]);
    
    const handleAssignClick = (drill: Drill) => {
        setSelectedDrill(drill);
        setAssignDrillModalOpen(true);
    };

    return (
        <>
            <Layout title="Coaching Hub" showBackButton>
                <div className="space-y-6">
                    <p className="text-gray-400 text-center">AI-generated drills and coaching tools for <span className="font-bold text-white">{user?.sport}</span>.</p>
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setLiveSessionModalOpen(true)}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1A2E29] rounded-2xl ring-1 ring-white/10 hover:ring-emerald-400/50 transition-all">
                            <VideoIcon />
                            <span className="font-semibold text-sm">Start Live Session</span>
                        </button>
                        <button 
                            onClick={() => setWorkoutModalOpen(true)}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1A2E29] rounded-2xl ring-1 ring-white/10 hover:ring-emerald-400/50 transition-all">
                            <DumbbellIcon />
                            <span className="font-semibold text-sm">Assign Workout</span>
                        </button>
                    </div>

                    <h2 className="text-xl font-bold pt-4">Drill Library</h2>
                    
                    <div className="space-y-4">
                        {drills.length > 0 ? (
                            drills.map(drill => (
                                <div key={drill.id} className="bg-[#1A2E29] p-4 rounded-xl">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{drill.name}</h3>
                                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{drill.category}</span>
                                        </div>
                                        <button onClick={() => handleAssignClick(drill)} className="text-xs bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-md">Assign</button>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-3">{drill.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-8 bg-[#1A2E29] rounded-2xl">
                                <h3 className="font-semibold text-lg mb-2">No Drills Found</h3>
                                <p className="text-gray-400 text-sm">There are no pre-defined drills for this sport yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
            <AssignDrillModal
                isOpen={isAssignDrillModalOpen}
                onClose={() => setAssignDrillModalOpen(false)}
                drillName={selectedDrill?.name || ''}
            />
            <StartLiveSessionModal
                isOpen={isLiveSessionModalOpen}
                onClose={() => setLiveSessionModalOpen(false)}
            />
            <AssignWorkoutModal
                isOpen={isWorkoutModalOpen}
                onClose={() => setWorkoutModalOpen(false)}
            />
        </>
    );
};

export default DrillLibraryPage;