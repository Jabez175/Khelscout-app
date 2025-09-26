

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { indianDistricts } from './constants';

const sports = ['Basketball', 'Soccer', 'Tennis', 'Running', 'Cricket'];

const CreateEventPage: React.FC = () => {
    const navigate = useNavigate();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would handle form submission to your API
        console.log("Creating new event...");
        navigate('/manage-events'); // Redirect after creation
    };

    return (
        <Layout title="Create New Event" showBackButton>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Event Title</label>
                    <input type="text" id="title" placeholder="e.g., Summer Soccer Championship" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" required />
                </div>

                <div>
                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-400 mb-1">Organizer Name</label>
                    <input type="text" id="organizer" placeholder="e.g., State Sports Association" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="sport" className="block text-sm font-medium text-gray-400 mb-1">Sport</label>
                        <select id="sport" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none" required>
                            {sports.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                        <input type="date" id="date" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" required />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">Location / Venue</label>
                        <input type="text" id="location" placeholder="e.g., City Stadium" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" required />
                    </div>
                     <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-400 mb-1">District</label>
                        <select id="district" className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none" required>
                             {indianDistricts.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea id="description" rows={4} placeholder="Provide key details about the event..." className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white resize-none"></textarea>
                </div>
                
                <div className="flex items-center">
                    <input id="is-government" type="checkbox" className="h-4 w-4 rounded accent-emerald-500 bg-gray-700 border-gray-600 focus:ring-emerald-600" />
                    <label htmlFor="is-government" className="ml-2 block text-sm text-gray-300">This is a government-affiliated event</label>
                </div>

                <div className="pt-4">
                     <button
                        type="submit"
                        className="w-full bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors"
                    >
                        Publish Event
                    </button>
                </div>
            </form>
        </Layout>
    );
};

export default CreateEventPage;