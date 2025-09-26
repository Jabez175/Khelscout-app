import React, { useState } from 'react';
import { XIcon } from './Icons';

interface AssignWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Dummy data for workouts and athletes
const workoutTemplates = [
    { id: 'w1', name: 'Explosive Power Routine' },
    { id: 'w2', name: 'Agility & Footwork Drills' },
    { id: 'w3', name: 'Endurance Building Program' },
];
const athletesRoster = [
    { id: 'athlete1', name: 'Ethan Carter', avatar: 'https://picsum.photos/seed/ethan/100' },
    { id: 'athlete2', name: 'Sophia Chen', avatar: 'https://picsum.photos/seed/sophia/100' },
    { id: 'athlete3', name: 'Liam Rodriguez', avatar: 'https://picsum.photos/seed/liam/100' },
];

const AssignWorkoutModal: React.FC<AssignWorkoutModalProps> = ({ isOpen, onClose }) => {
    const [selectedWorkout, setSelectedWorkout] = useState<string>('');
    const [assignedAthletes, setAssignedAthletes] = useState<string[]>([]);

    if (!isOpen) return null;

    const handleToggleAthlete = (athleteId: string) => {
        setAssignedAthletes(prev => 
            prev.includes(athleteId) 
                ? prev.filter(id => id !== athleteId)
                : [...prev, athleteId]
        );
    };

    const handleAssign = () => {
        console.log(`Assigning workout "${selectedWorkout}" to athletes:`, assignedAthletes);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1A2E29] w-full max-w-sm rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Assign Workout</h2>
                    <button onClick={onClose} className="p-2 -mr-2"><XIcon /></button>
                </div>
                
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">1. Select Workout Template</label>
                    <select 
                        value={selectedWorkout} 
                        onChange={(e) => setSelectedWorkout(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0D1A18] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none"
                    >
                        <option value="" disabled>Choose a workout...</option>
                        {workoutTemplates.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">2. Select Athletes</label>
                    <div className="space-y-3 max-h-48 overflow-y-auto border-t border-b border-gray-700 py-3">
                        {athletesRoster.map(athlete => (
                            <div key={athlete.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <img src={athlete.avatar} alt={athlete.name} className="w-10 h-10 rounded-full" />
                                    <span className="text-white font-medium">{athlete.name}</span>
                                </div>
                                <input 
                                    type="checkbox"
                                    checked={assignedAthletes.includes(athlete.id)}
                                    onChange={() => handleToggleAthlete(athlete.id)}
                                    className="h-5 w-5 rounded accent-emerald-500 bg-gray-700 border-gray-600 focus:ring-emerald-600"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleAssign}
                    disabled={assignedAthletes.length === 0 || !selectedWorkout}
                    className="w-full mt-2 bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 disabled:bg-gray-600"
                >
                    Assign Workout
                </button>
            </div>
        </div>
    );
};

export default AssignWorkoutModal;