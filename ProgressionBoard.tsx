import React from 'react';
import Layout from './Layout';
import { TrophyIcon } from './Icons';

const timelineEvents = [
    { title: 'National Level Shortlist', date: 'May 2024', description: 'Selected for the national training camp based on verified scores.', status: 'current' },
    { title: 'State Champion', date: 'Feb 2024', description: 'Won the gold medal in the State Basketball Championship.', status: 'complete' },
    { title: 'District Team Selection', date: 'Nov 2023', description: 'Selected to represent Mumbai district.', status: 'complete' },
    { title: 'First SAI Assessment', date: 'Sep 2023', description: 'Completed initial skill assessment via Khelscout.', status: 'complete' },
];

const ProgressionBoard: React.FC = () => {
    return (
        <Layout title="Progression Board" showBackButton>
            <div className="p-2">
                <p className="text-center text-gray-400 mb-8">Your journey from a promising talent to a national athlete, tracked and verified.</p>
                <div className="relative border-l-2 border-dashed border-gray-600 ml-4">
                    {timelineEvents.map((event, index) => (
                        <div key={index} className="mb-8 pl-8 relative">
                            <div className={`absolute -left-5 top-1 w-9 h-9 rounded-full flex items-center justify-center ${event.status === 'current' ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                                <TrophyIcon />
                            </div>
                            <p className={`font-bold text-lg ${event.status === 'current' ? 'text-emerald-400' : 'text-white'}`}>{event.title}</p>
                            <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                            <p className="text-sm text-gray-300">{event.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProgressionBoard;
