import React from 'react';
import Layout from './Layout';
import { FlameIcon, ActivityIcon, DumbbellIcon } from './Icons';

const challenges = [
    { title: 'Daily Sit-up Challenge', description: 'Complete 50 sit-ups.', progress: 35, goal: 50, icon: <ActivityIcon /> },
    { title: 'Weekly Run', description: 'Run a total of 15km this week.', progress: 8, goal: 15, icon: <DumbbellIcon /> },
];

const ChallengeCard: React.FC<(typeof challenges)[0]> = ({ title, description, progress, goal, icon }) => (
    <div className="bg-[#1A2E29] p-4 rounded-2xl">
        <div className="flex items-center gap-4">
            <div className="text-emerald-400 bg-emerald-400/20 p-3 rounded-lg">{icon}</div>
            <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
        <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{progress} / {goal}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-emerald-400 h-2.5 rounded-full" style={{ width: `${(progress / goal) * 100}%` }}></div>
            </div>
        </div>
    </div>
);

const ChallengePage: React.FC = () => {
    const workoutStreak = 7; // Mock data

    return (
        <Layout title="Streaks & Challenges" showBackButton>
            <div className="space-y-8">
                <section className="bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl p-6 text-white text-center">
                    <div className="flex items-center justify-center gap-2">
                        <FlameIcon />
                        <h2 className="text-2xl font-bold">Workout Streak</h2>
                    </div>
                    <p className="text-5xl font-bold my-2">{workoutStreak} <span className="text-2xl font-normal">days</span></p>
                    <p className="text-emerald-100">Keep it up to unlock new badges!</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold mb-4">Active Challenges</h2>
                    <div className="space-y-4">
                        {challenges.map(challenge => <ChallengeCard key={challenge.title} {...challenge} />)}
                    </div>
                </section>
            </div>
        </Layout>
    );
};
export default ChallengePage;
