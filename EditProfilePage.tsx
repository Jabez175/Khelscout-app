import React from 'react';
import Layout from './Layout';
import { useAuth } from './AuthContext';
import { UploadIcon } from './Icons';

const achievements = [
    { id: '1', title: 'MVP Award - Regional Championship', year: 2023, verified: true },
    { id: '2', title: 'All-Star Selection - National League', year: 2022, verified: false },
];

const EditProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <Layout title="Edit Profile" showBackButton>
            <div className="space-y-8">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img src={user?.avatarUrl} alt={user?.name} className="w-28 h-28 rounded-full border-4 border-gray-700" />
                        <button className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full border-2 border-[#0D1A18]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                    </div>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Specialization</label>
                        <input type="text" defaultValue={user?.specialization} className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                        <textarea rows={4} defaultValue={user?.bio} className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white resize-none"></textarea>
                    </div>
                </form>

                <section>
                    <h2 className="text-xl font-bold mb-4">Achievements</h2>
                    <div className="space-y-3">
                        {achievements.map(ach => (
                            <div key={ach.id} className="bg-[#1A2E29] p-3 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{ach.title}</p>
                                    <p className="text-xs text-gray-400">{ach.year}</p>
                                </div>
                                {ach.verified ? (
                                    <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">Verified</span>
                                ) : (
                                    <button className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">Verify</button>
                                )}
                            </div>
                        ))}
                    </div>
                     <div className="mt-4 border-2 border-dashed border-gray-600 rounded-2xl p-4 text-center">
                        <p className="font-semibold text-white mb-2">Add New Achievement</p>
                        <input type="text" placeholder="Achievement Title" className="w-full mb-2 px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg text-sm" />
                        <button className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white py-2 rounded-lg text-sm">
                            <UploadIcon />
                            Upload Certificate
                        </button>
                    </div>
                </section>

                 <button className="w-full bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors">
                    Save Changes
                </button>
            </div>
        </Layout>
    );
};

export default EditProfilePage;