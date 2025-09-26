import React from 'react';
import Layout from './Layout';

const queuedUploads = [
    { id: '1', fileName: 'vertical_jump_01.mp4', size: '25.3 MB', progress: 100, status: 'Complete' },
    { id: '2', fileName: 'shuttle_run_final.mp4', size: '42.1 MB', progress: 45, status: 'Uploading...' },
    { id: '3', fileName: 'situps_test.mp4', size: '18.9 MB', progress: 0, status: 'Queued (Wi-Fi)' },
];

const SyncManagerPage: React.FC = () => {
    return (
        <Layout title="Offline Sync Manager" showBackButton>
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#1A2E29] p-4 rounded-xl">
                    <div>
                        <h3 className="font-semibold text-white">Upload only on Wi-Fi</h3>
                        <p className="text-sm text-gray-400">Conserve mobile data.</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </div>
                </div>
                
                <section>
                    <h2 className="text-xl font-bold mb-4">Upload Queue</h2>
                    <div className="space-y-3">
                        {queuedUploads.map(upload => (
                            <div key={upload.id} className="bg-[#1A2E29] p-4 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold truncate">{upload.fileName}</p>
                                    <p className="text-sm text-gray-400">{upload.size}</p>
                                </div>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${upload.progress}%` }}></div>
                                    </div>
                                    <p className="text-right text-xs text-emerald-400 mt-1">{upload.status} {upload.progress > 0 && upload.progress < 100 && `(${upload.progress}%)`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};
export default SyncManagerPage;
