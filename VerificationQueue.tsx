import React from 'react';
import Layout from './Layout';
import { WarningTriangleIcon } from './Icons';

const flaggedSubmissions = [
    { id: 's1', athleteName: 'Olivia Kim', test: 'Standing Broad Jump', reason: 'Unusual acceleration detected.', videoUrl: '#' },
    { id: 's2', athleteName: 'Aarav Sharma', test: '30m Sprint', reason: 'Potential video cut detected at 3s mark.', videoUrl: '#' },
];

const VerificationQueue: React.FC = () => {
    return (
        <Layout title="Verification Queue" showBackButton>
            <div className="space-y-6">
                 <p className="text-gray-400 text-center">Review athlete submissions that were automatically flagged by the AI for potential integrity issues.</p>
                 <div className="space-y-4">
                    {flaggedSubmissions.map(sub => (
                        <div key={sub.id} className="bg-[#1A2E29] p-4 rounded-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-white">{sub.athleteName}</h3>
                                    <p className="text-sm text-gray-400">{sub.test}</p>
                                </div>
                                <a href={sub.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-md">
                                    Watch Video
                                </a>
                            </div>
                             <div className="mt-3 border-t border-gray-700 pt-3">
                                <p className="text-sm font-semibold text-yellow-400 flex items-center gap-2"><WarningTriangleIcon /> Flag Reason</p>
                                <p className="text-sm text-gray-300 mt-1">{sub.reason}</p>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button className="w-full bg-emerald-500 text-white font-semibold py-2 rounded-md text-sm">Accept</button>
                                <button className="w-full bg-red-500 text-white font-semibold py-2 rounded-md text-sm">Reject</button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </Layout>
    );
};

export default VerificationQueue;
