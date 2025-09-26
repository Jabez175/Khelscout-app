

import React, { useState } from 'react';
import Layout from './Layout';
import { PlusIcon, ChevronRightIcon, BarChart2Icon, AlertTriangleIcon } from './Icons';
import type { Event } from './types';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const myEvents: Event[] = [
    { id: '1', title: 'Youth Basketball Tournament', sport: 'Basketball', date: 'June 15, 2024', time: '9:00 AM', imageUrl: 'https://picsum.photos/seed/bball/400/200', district: 'Mumbai', location: 'Andheri Sports Complex', organizedBy: 'Global Sports Org', isGovernment: false, description: 'An open tournament for under-18 basketball players.' },
    { id: '2', title: 'Summer Soccer Camp', sport: 'Soccer', date: 'July 1-5, 2024', time: '10:00 AM', imageUrl: 'https://picsum.photos/seed/soccer/400/200', district: 'Delhi', location: 'Delhi Football Ground', organizedBy: 'Global Sports Org', isGovernment: false, description: 'A week-long training camp for aspiring soccer players.' },
];

const eventRegistrations: { [key: string]: { total: number; ages: { age: string; count: number }[] } } = {
    '1': { total: 128, ages: [{ age: '14-16', count: 45 }, { age: '17-18', count: 83 }] },
    '2': { total: 92, ages: [{ age: '12-14', count: 60 }, { age: '15-16', count: 32 }] },
};


const ManageEventsPage: React.FC = () => {
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(prevId => (prevId === id ? null : id));
    };
    
    return (
        <Layout title="Manage Events" showSettingsButton>
            <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => navigate('/create-event')}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <PlusIcon /> Create Event
                    </button>
                    <button 
                        onClick={() => navigate('/analytics/events')}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-blue-400 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <BarChart2Icon /> View Analytics
                    </button>
                </div>
                 <button 
                    onClick={() => navigate('/anomaly-heatmap')}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                    <AlertTriangleIcon /> Anomaly Map
                </button>

                <h2 className="text-xl font-bold text-white pt-4">Your Upcoming Events</h2>
                {myEvents.map(event => (
                     <div key={event.id} className="bg-[#0E1B17] rounded-2xl ring-1 ring-white/10">
                        <div className="p-3 flex items-center gap-4 cursor-pointer" onClick={() => toggleExpand(event.id)}>
                            <img src={event.imageUrl} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
                            <div className="flex-grow">
                                <h3 className="font-bold">{event.title}</h3>
                                <p className="text-sm text-gray-400">{event.date}</p>
                                <p className="text-sm font-semibold text-emerald-400">{eventRegistrations[event.id]?.total || 0} Registrations</p>
                            </div>
                            <ChevronRightIcon className={`transition-transform ${expandedId === event.id ? 'rotate-90' : ''}`} />
                        </div>

                        {expandedId === event.id && (
                            <div className="px-4 pb-4 border-t border-white/10">
                                <div className="mt-4">
                                    <h4 className="text-md font-bold mb-2">Registration Analytics</h4>
                                     <div className="flex gap-2 mb-4">
                                        <button className="text-xs bg-gray-700 px-3 py-1 rounded-md">Edit Event</button>
                                        <button className="text-xs bg-red-800/50 text-red-400 px-3 py-1 rounded-md">Delete</button>
                                     </div>
                                    <div className="w-full h-48">
                                        <ResponsiveContainer>
                                            <BarChart data={eventRegistrations[event.id]?.ages} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                                <XAxis type="number" hide />
                                                <YAxis type="category" dataKey="age" stroke="#9CA3AF" width={50} tickLine={false} axisLine={false} fontSize={12} />
                                                <Tooltip cursor={{fill: '#0E1B17'}} contentStyle={{ backgroundColor: '#050e0c', border: '1px solid #374151' }} />
                                                <Bar dataKey="count" fill="#34D399" radius={[0, 4, 4, 0]} barSize={16} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default ManageEventsPage;