import React from 'react';
import Layout from './Layout';
import { RocketIcon, ShieldCheckIcon, SmartphoneIcon } from './Icons'; // Assuming these exist

const RoadmapItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-[#1A2E29] p-4 rounded-xl flex items-start gap-4">
        <div className="text-emerald-400 bg-emerald-400/20 p-3 rounded-lg mt-1">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-lg text-white">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
        </div>
    </div>
);

const FutureRoadmapPage: React.FC = () => {
    return (
        <Layout title="Future Roadmap" showBackButton>
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">The Future of Khelscout</h2>
                    <p className="text-gray-400">We're committed to building the most advanced and trustworthy talent assessment platform. Here's what's next.</p>
                </div>
                <RoadmapItem 
                    icon={<SmartphoneIcon />}
                    title="Smart Wearables Integration"
                    description="Pair with smart bands (like Mi Band, Fitbit) to capture live Heart Rate and VO₂ max data during tests, providing deeper physiological insights and an extra layer of verification."
                />
                <RoadmapItem 
                    icon={<ShieldCheckIcon />}
                    title="Blockchain-Verified Certificates"
                    description="Issue verified test results and achievements as tamper-proof digital credentials on a blockchain. Athletes will have a permanent, verifiable record of their career milestones."
                />
                 <RoadmapItem 
                    icon={<RocketIcon />}
                    title="Direct SAI Database Integration"
                    description="Enable seamless, two-way data synchronization with the official Khelo India athlete database, ensuring all records are up-to-date and reducing administrative overhead for officials."
                />
            </div>
        </Layout>
    );
};

export default FutureRoadmapPage;