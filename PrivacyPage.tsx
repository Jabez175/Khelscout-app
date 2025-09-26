import React from 'react';
import Layout from './Layout';
import { ShieldIcon, ChevronRightIcon } from './Icons';

const PrivacyToggle: React.FC<{ title: string; description: string; defaultChecked?: boolean }> = ({ title, description, defaultChecked }) => (
    <div className="flex justify-between items-center bg-[#1A2E29] p-4 rounded-xl">
        <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </div>
    </div>
);

const PrivacyPage: React.FC = () => {
    return (
        <Layout title="Privacy & Data" showBackButton>
            <div className="space-y-8">
                <section>
                    <h2 className="text-lg font-bold mb-4 text-gray-400">Data Sharing</h2>
                    <div className="space-y-3">
                       <PrivacyToggle title="Share Raw Video Data" description="Allow SAI officials to view your raw test videos." />
                       <PrivacyToggle title="Share Performance Data" description="Allow anonymized data for research." defaultChecked />
                    </div>
                </section>
                <section>
                    <h2 className="text-lg font-bold mb-4 text-gray-400">Manage Your Data</h2>
                     <div className="space-y-3">
                        <button className="w-full flex items-center bg-[#1A2E29] p-4 rounded-xl text-left hover:bg-gray-800">
                            <div className="text-emerald-400"><ShieldIcon /></div>
                            <span className="flex-grow ml-4 font-semibold">Download Your Data (JSON)</span>
                            <ChevronRightIcon />
                        </button>
                         <button className="w-full flex items-center bg-[#1A2E29] p-4 rounded-xl text-left hover:bg-gray-800">
                            <div className="text-red-400"><ShieldIcon /></div>
                            <span className="flex-grow ml-4 font-semibold">Request Account Deletion</span>
                            <ChevronRightIcon />
                        </button>
                    </div>
                </section>
            </div>
        </Layout>
    );
};
export default PrivacyPage;
