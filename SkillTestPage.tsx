import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { ActivityIcon, ArrowRightIcon, InfoIcon, XIcon } from './Icons';
import { SkillTest } from './types';

const testInstructions: Record<string, { title: string; steps: string[] }> = {
    'height': { title: 'Height Test Protocol', steps: ['Stand straight against a wall without shoes.', 'Ensure your heels, back, and head are touching the wall.', 'Have someone place a flat object on your head and mark the wall.', 'Measure the distance from the floor to the mark.'] },
    'weight': { title: 'Weight Test Protocol', steps: ['Use a calibrated digital weighing scale.', 'Wear minimal clothing and no shoes.', 'Stand still in the center of the scale.', 'Record the measurement to the nearest 0.1 kg.'] },
    'sit_and_reach': { title: 'Sit and Reach Protocol', steps: ['Sit on the floor with legs straight out.', 'The soles of your feet should be flat against the testing box.', 'Slowly reach forward with both hands as far as possible.', 'Hold the position for 2 seconds. Do not bounce.'] },
    'standing_vertical_jump': { title: 'Vertical Jump Protocol', steps: ['Stand sideways to a wall and mark your maximum reach.', 'Without a run-up, jump as high as you can and touch the wall.', 'The distance between the two marks is your score.', 'Perform 3 attempts and record the best one.'] },
    'standing_broad_jump': { title: 'Broad Jump Protocol', steps: ['Stand behind a line with feet together.', 'Swing your arms and bend your knees to jump as far as possible.', 'Land on both feet. The measurement is taken from the line to the back of your heels.'] },
    'medicine_ball_throw': { title: 'Medicine Ball Throw Protocol', steps: ['Sit on the floor with your back against a wall.', 'Hold the medicine ball with both hands at your chest.', 'Push the ball forward as far as you can.', 'The distance is measured from the wall to where the ball first lands.'] },
    '30m_standing_start': { title: '30m Sprint Protocol', steps: ['Start from a stationary standing position behind the start line.', 'Sprint the 30-meter distance as fast as you can.', 'The time is recorded from your first movement to when your chest crosses the finish line.'] },
    'shuttle_run_4x10': { title: '4x10m Shuttle Run Protocol', steps: ['Set up two markers 10 meters apart.', 'Start at one marker, run to the other, touch the line, and return.', 'Repeat this pattern twice for a total of 4x10m.', 'The test is timed from start to finish.'] },
    'situps': { title: 'Sit Ups (1-Minute) Protocol', steps: ['Lie on your back with knees bent and feet flat.', 'Your hands should be behind your head or across your chest.', 'Raise your upper body until your elbows touch your knees.', 'Perform as many correct sit-ups as possible in 60 seconds.'] },
    'endurance_run': { title: 'Endurance Run Protocol', steps: ['Run the required distance (800m or 1.6km) as fast as possible.', 'Pacing is important. Try to maintain a steady speed.', 'The total time taken to complete the distance is your score.'] },
};

const TestInstructionsModal: React.FC<{ content: { title: string; steps: string[] } | null; isOpen: boolean; onClose: () => void; }> = ({ content, isOpen, onClose }) => {
    if (!isOpen || !content) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#0E1B17]/90 backdrop-blur-xl ring-1 ring-white/10 w-full max-w-sm rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{content.title}</h2>
                    <button onClick={onClose} className="p-2 -mr-2"><XIcon /></button>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                    {content.steps.map((step, index) => <li key={index}>{step}</li>)}
                </ul>
                <button onClick={onClose} className="w-full mt-4 bg-emerald-500 text-white font-bold py-2 rounded-lg">
                    Got it
                </button>
            </div>
        </div>
    );
};

const nationalTests: SkillTest[] = [
    { id: '1', title: 'Height', description: 'Record a video of height measurement for verification.', type: 'upload', exerciseType: 'height' },
    { id: '2', title: 'Weight', description: 'Record a video of weight measurement for verification.', type: 'upload', exerciseType: 'weight' },
    { id: '3', title: 'Sit and Reach', description: 'Test your flexibility. Record for AI analysis.', type: 'upload', exerciseType: 'sit_and_reach' },
    { id: '4', title: 'Standing Vertical Jump', description: 'Test lower body explosive strength. Record for AI analysis.', type: 'upload', exerciseType: 'standing_vertical_jump' },
    { id: '5', title: 'Standing Broad Jump', description: 'Test lower body explosive strength. Record for AI analysis.', type: 'upload', exerciseType: 'standing_broad_jump' },
    { id: '6', title: 'Medicine Ball Throw', description: 'Test upper body strength. Record for AI analysis.', type: 'upload', exerciseType: 'medicine_ball_throw' },
    { id: '7', title: '30mts Standing Start', description: 'Test your speed. Record your sprint for AI analysis.', type: 'upload', exerciseType: '30m_standing_start' },
    { id: '8', title: '4 x 10 Mts Shuttle Run', description: 'Test your agility. Record your run for AI analysis.', type: 'upload', exerciseType: 'shuttle_run_4x10' },
    { id: '9', title: 'Sit Ups', description: 'Test your core strength with live rep counting.', type: 'live', exerciseType: 'situps' },
    { id: '10', title: 'Endurance Run (800m/1.6km)', description: 'Record your run for AI verification of time.', type: 'upload', exerciseType: 'endurance_run' }
];

const TestCard: React.FC<{ test: SkillTest; onInfoClick: (testId: string) => void }> = ({ test, onInfoClick }) => {
    const navigate = useNavigate();
    
    const handleStartTest = () => {
        navigate('/env-check', { state: { test } });
    };

    return (
        <div className="w-full bg-[#0E1B17] p-4 rounded-xl text-left flex items-center justify-between ring-1 ring-white/10 hover:ring-emerald-400/50 transition-all">
            <div className="flex items-center gap-4 flex-grow cursor-pointer" onClick={handleStartTest}>
                <div className="bg-emerald-400/10 text-emerald-400 p-3 rounded-lg">
                    <ActivityIcon />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-white">{test.title}</h3>
                    <p className="text-sm text-gray-400">{test.description}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 pl-2">
                <button onClick={(e) => { e.stopPropagation(); onInfoClick(test.exerciseType!); }} className="p-2 text-gray-400 hover:text-white">
                    <InfoIcon />
                </button>
                <button onClick={handleStartTest} className="text-gray-500">
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    );
};


const SAINationalTestsPage: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{ title: string; steps: string[] } | null>(null);

    const handleInfoClick = (testId: string) => {
        const instructions = testInstructions[testId];
        if (instructions) {
            setModalContent(instructions);
            setModalOpen(true);
        }
    };

    return (
        <Layout title="SAI National Tests" showBackButton>
            <div className="space-y-4">
                <p className="text-gray-400 text-center mb-2">Complete these standardized tests to get benchmarked and discovered by the Sports Authority of India.</p>
                {nationalTests.map(test => (
                    <TestCard key={test.id} test={test} onInfoClick={handleInfoClick} />
                ))}
            </div>
            <TestInstructionsModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                content={modalContent}
            />
        </Layout>
    );
};

export default SAINationalTestsPage;