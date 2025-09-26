import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

// Dummy data for mentor's athletes roster
const athletesRoster = [
    { id: 'athlete1', name: 'Ethan Carter', avatar: 'https://picsum.photos/seed/ethan/100' },
    { id: 'athlete2', name: 'Sophia Chen', avatar: 'https://picsum.photos/seed/sophia/100' },
    { id: 'athlete3', name: 'Liam Rodriguez', avatar: 'https://picsum.photos/seed/liam/100' },
    { id: 'athlete4', name: 'Olivia Kim', avatar: 'https://picsum.photos/seed/olivia/100' },
];

const CreateSessionPage: React.FC = () => {
    const navigate = useNavigate();
    const [assignedAthletes, setAssignedAthletes] = useState<string[]>([]);

    const handleToggleAthlete = (athleteId: string) => {
        setAssignedAthletes(prev => 
            prev.includes(athleteId) 
                ? prev.filter(id => id !== athleteId)
                : [...prev, athleteId]
        );
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would handle the form submission logic
        console.log("Session Created!");
        navigate('/dashboard'); // Go back to dashboard after creation
    };

    return (
        <Layout title="Create Session" showBackButton>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Session Title</label>
                    <input type="text" id="title" placeholder="e.g., Morning Agility Drills" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">Session Type</label>
                        <select id="type" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none" required>
                            <option>Strength</option>
                            <option>Agility</option>
                            <option>Endurance</option>
                            <option>Skill Specific</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                        <input type="date" id="date" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" required />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Assign Athletes</label>
                    <div className="space-y-3 max-h-48 overflow-y-auto bg-[#1A2E29] p-3 rounded-xl border border-gray-700">
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

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea id="description" rows={4} placeholder="Add notes or goals for this session..." className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white resize-none"></textarea>
                </div>
                
                <div className="pt-4">
                     <button
                        type="submit"
                        className="w-full bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors"
                    >
                        Schedule Session
                    </button>
                </div>
            </form>
        </Layout>
    );
};

export default CreateSessionPage;