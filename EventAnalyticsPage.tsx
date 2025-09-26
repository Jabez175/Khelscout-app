
import React from 'react';
import Layout from './Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserIcon } from './Icons';

// Mock data for analytics
const analyticsData = {
    totalRegistrations: 482,
    registrationsByDistrict: [
        { name: 'Mumbai', athletes: 120 },
        { name: 'Delhi', athletes: 95 },
        { name: 'Bangalore', athletes: 80 },
        { name: 'Chennai', athletes: 75 },
        { name: 'Pune', athletes: 62 },
        { name: 'Kolkata', athletes: 50 },
    ],
    registrationsBySport: [
        { name: 'Basketball', value: 180 },
        { name: 'Soccer', value: 152 },
        { name: 'Tennis', value: 90 },
        { name: 'Running', value: 60 },
    ],
};

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

const EventAnalyticsPage: React.FC = () => {
    return (
        <Layout title="Event Analytics" showSettingsButton>
            <div className="space-y-6">
                <div className="bg-[#1A2E29] p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-emerald-400/20 text-emerald-400 p-4 rounded-lg">
                        <UserIcon />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">{analyticsData.totalRegistrations}</p>
                        <p className="text-sm text-gray-400">Total Registrations</p>
                    </div>
                </div>

                <div className="bg-[#1A2E29] p-4 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4">Registrations by District</h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer>
                            <BarChart data={analyticsData.registrationsByDistrict} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={80} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: '#273c37'}} contentStyle={{ backgroundColor: '#0D1A18', border: '1px solid #374151' }} />
                                <Bar dataKey="athletes" fill="#34D399" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="bg-[#1A2E29] p-4 rounded-2xl">
                     <h3 className="font-bold text-lg mb-4">Registrations by Sport</h3>
                     <div className="w-full h-64 flex items-center">
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.registrationsBySport}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analyticsData.registrationsBySport.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0D1A18', border: '1px solid #374151' }} />
                            </PieChart>
                        </ResponsiveContainer>
                         <div className="w-1/2 space-y-2">
                             {analyticsData.registrationsBySport.map((entry, index) => (
                                 <div key={`legend-${index}`} className="flex items-center text-sm">
                                     <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                     <span>{entry.name} ({entry.value})</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                </div>

            </div>
        </Layout>
    );
};

export default EventAnalyticsPage;
