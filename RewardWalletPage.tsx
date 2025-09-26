import React from 'react';
import Layout from './Layout';
import { GiftIcon } from './Icons';
import { Reward } from './types';
import { useNavigate } from 'react-router-dom';

const userPoints = 1250; // Mock data

const rewards: Reward[] = [
    { id: '1', title: 'Khelscout T-Shirt', description: 'Official merchandise.', cost: 1000, type: 'Merchandise' },
    { id: '2', title: '50% Off Event Entry', description: 'Discount for next tournament.', cost: 1500, type: 'Discount' },
    { id: '3', title: 'Advanced Training PDF', description: 'E-book from a pro coach.', cost: 500, type: 'Resource' },
];

const RewardCard: React.FC<{ reward: Reward }> = ({ reward }) => {
    const canAfford = userPoints >= reward.cost;
    return (
        <div className="bg-[#1A2E29] p-4 rounded-xl flex justify-between items-center">
            <div>
                <h3 className="font-bold text-white">{reward.title}</h3>
                <p className="text-xs text-gray-400">{reward.description}</p>
                <p className="text-sm font-bold text-emerald-400 mt-2">{reward.cost} Points</p>
            </div>
            <button
                disabled={!canAfford}
                className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-md text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                Redeem
            </button>
        </div>
    );
};

const RewardWalletPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Layout title="Reward Wallet" showBackButton>
            <div className="space-y-8">
                <section className="bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl p-6 text-white text-center">
                    <p className="text-emerald-100">Your Points Balance</p>
                    <p className="text-5xl font-bold my-1">{userPoints.toLocaleString()}</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><GiftIcon /> Redeem Rewards</h2>
                    {rewards.length > 0 ? (
                        <div className="space-y-3">
                            {rewards.map(reward => <RewardCard key={reward.id} reward={reward} />)}
                        </div>
                    ) : (
                         <div className="text-center py-12 flex flex-col items-center">
                            <div className="text-emerald-400 bg-emerald-400/20 p-4 rounded-full inline-block mb-4">
                                <GiftIcon />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">No Rewards Available Yet</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">Earn points by completing challenges and SAI tests to unlock exclusive rewards.</p>
                            <button
                                onClick={() => navigate('/skill-test')}
                                className="bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                                Take a Test
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
};
export default RewardWalletPage;