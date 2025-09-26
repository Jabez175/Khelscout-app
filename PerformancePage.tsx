
import React from 'react';
import Layout from './Layout';
import { BadgeIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from './Icons';
import { useAuth } from './AuthContext';
import { SAIScores } from './types';

// Mock Data for national averages
const nationalAverages: SAIScores = {
    height: { score: 172, unit: 'cm', verified: true },
    weight: { score: 68, unit: 'kg', verified: true },
    sitAndReach: { score: 18, unit: 'cm', verified: true },
    standingVerticalJump: { score: 42, unit: 'cm', verified: true },
    standingBroadJump: { score: 220, unit: 'cm', verified: true },
    medicineBallThrow: { score: 10, unit: 'm', verified: true },
    standingStart30m: { score: 4.9, unit: 's', verified: true },
    shuttleRun4x10: { score: 10.5, unit: 's', verified: true },
    sitUps: { score: 45, unit: 'reps', verified: true },
    enduranceRun: { score: 600, unit: 's', verified: true },
};

const badges = [
    { name: 'SAI Certified', description: 'Completed all national assessment tests.' },
    { name: 'Vertical Virtuoso', description: 'Achieved a top 10% vertical jump score.' },
    { name: 'Speed Demon', description: 'Completed the shuttle run with a verified time.' },
    { name: 'First Assessment', description: 'Completed your first official SAI test.' },
];

const PerformanceBenchmarkItem: React.FC<{ label: string, userScore?: number, userUnit?: string, avgScore?: number, avgUnit?: string, lowerIsBetter?: boolean }> = 
({ label, userScore, userUnit, avgScore, avgUnit, lowerIsBetter = false }) => {
    
    const userDisplay = userScore ? `${userScore} ${userUnit}` : 'N/A';
    const avgDisplay = avgScore ? `${avgScore} ${avgUnit}` : 'N/A';
    
    let performanceIndicator: React.ReactNode = null;
    let performanceClass = "text-gray-400";
    
    if(userScore && avgScore){
        const isBetter = lowerIsBetter ? userScore < avgScore : userScore > avgScore;
        const isWorse = lowerIsBetter ? userScore > avgScore : userScore < avgScore;

        if (isBetter) {
            performanceClass = "text-emerald-400"; // Better than average
            performanceIndicator = <ArrowUpIcon className="w-4 h-4" />;
        } else if (isWorse) {
            performanceClass = "text-red-400"; // Worse than average
            performanceIndicator = <ArrowDownIcon className="w-4 h-4" />;
        } else {
            performanceClass = "text-yellow-400"; // At average
            performanceIndicator = <MinusIcon className="w-4 h-4" />;
        }
    }

    return (
        <div className="bg-[#0D1A18] p-3 rounded-lg flex justify-between items-center">
            <span className="font-semibold text-white">{label}</span>
            <div className="text-right">
                <div className={`flex items-center justify-end gap-1 font-bold text-lg ${performanceClass}`}>
                    {performanceIndicator}
                    <span>{userDisplay}</span>
                </div>
                <span className="text-xs text-gray-500">Avg: {avgDisplay}</span>
            </div>
        </div>
    );
};

const PerformancePage: React.FC = () => {
    const { user } = useAuth();
    const scores = user?.saiScores;

    return (
        <Layout title="My Performance" showBackButton>
            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4">Performance Benchmark</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Here's how your performance compares to the national average for your age and gender group.
                    </p>
                    <div className="bg-[#1A2E29] p-4 rounded-2xl space-y-2">
                        <PerformanceBenchmarkItem label="Vertical Jump" userScore={scores?.standingVerticalJump?.score} userUnit="cm" avgScore={nationalAverages.standingVerticalJump?.score} avgUnit="cm" />
                        <PerformanceBenchmarkItem label="Broad Jump" userScore={scores?.standingBroadJump?.score} userUnit="cm" avgScore={nationalAverages.standingBroadJump?.score} avgUnit="cm" />
                        <PerformanceBenchmarkItem label="4x10 Shuttle Run" userScore={scores?.shuttleRun4x10?.score} userUnit="s" avgScore={nationalAverages.shuttleRun4x10?.score} avgUnit="s" lowerIsBetter />
                        <PerformanceBenchmarkItem label="30m Sprint" userScore={scores?.standingStart30m?.score} userUnit="s" avgScore={nationalAverages.standingStart30m?.score} avgUnit="s" lowerIsBetter />
                        <PerformanceBenchmarkItem label="Sit Ups" userScore={scores?.sitUps?.score} userUnit="reps" avgScore={nationalAverages.sitUps?.score} avgUnit="reps" />
                        <PerformanceBenchmarkItem label="Med Ball Throw" userScore={scores?.medicineBallThrow?.score} userUnit="m" avgScore={nationalAverages.medicineBallThrow?.score} avgUnit="m" />
                        <PerformanceBenchmarkItem label="Sit & Reach" userScore={scores?.sitAndReach?.score} userUnit="cm" avgScore={nationalAverages.sitAndReach?.score} avgUnit="cm" />
                        <PerformanceBenchmarkItem label="Endurance Run" userScore={scores?.enduranceRun?.score} userUnit="s" avgScore={nationalAverages.enduranceRun?.score} avgUnit="s" lowerIsBetter />
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4">Badges Earned</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {badges.map(badge => (
                            <div key={badge.name} className="bg-[#1A2E29] p-4 rounded-xl text-center">
                                <div className="text-yellow-400 bg-yellow-400/20 p-3 rounded-lg mb-2 inline-block">
                                    <BadgeIcon />
                                </div>
                                <p className="font-bold text-white">{badge.name}</p>
                                <p className="text-xs text-gray-400">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default PerformancePage;
