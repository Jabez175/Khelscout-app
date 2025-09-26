import React, { useState } from 'react';
import Layout from './Layout';
import { InjuryLog } from './types';
import { PlusIcon, HeartbeatIcon } from './Icons';

const mockInjuryLogs: InjuryLog[] = [
    { id: '1', date: '2024-05-20', injury: 'Ankle Sprain', severity: 'Medium', status: 'Recovering', notes: 'Twisted during practice. Applying RICE protocol.' },
    { id: '2', date: '2024-04-10', injury: 'Shoulder Strain', severity: 'Low', status: 'Recovered', notes: 'Overuse from throwing drills. Rested for a week.' },
];

const HealthPage: React.FC = () => {
    const [logs, setLogs] = useState(mockInjuryLogs);

    const getStatusColor = (status: InjuryLog['status']) => {
        switch (status) {
            case 'Recovering': return 'bg-yellow-500/20 text-yellow-400';
            case 'Recovered': return 'bg-emerald-500/20 text-emerald-400';
            case 'Ongoing': return 'bg-red-500/20 text-red-400';
        }
    };

    return (
        <Layout title="Health Log" showBackButton>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Injury History</h2>
                    <button className="flex items-center gap-2 bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-md text-sm">
                        <PlusIcon /> Add Log
                    </button>
                </div>
                {logs.length > 0 ? (
                    <div className="space-y-4">
                        {logs.map(log => (
                            <div key={log.id} className="bg-[#1A2E29] p-4 rounded-xl">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg text-white">{log.injury}</p>
                                        <p className="text-xs text-gray-400">{new Date(log.date).toDateString()}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(log.status)}`}>{log.status}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-3 border-t border-gray-700 pt-3">{log.notes}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16">
                        <div className="text-emerald-400 bg-emerald-400/20 p-4 rounded-full inline-block mb-4">
                            <HeartbeatIcon />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No Injuries Logged</h3>
                        <p className="text-gray-400 text-sm">Track any injuries here to monitor your recovery.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};
export default HealthPage;
