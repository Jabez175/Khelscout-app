import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { MicIcon } from './Icons';

const generatePassphrase = () => {
    const words = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT'];
    const numbers = Math.floor(100 + Math.random() * 900);
    const word = words[Math.floor(Math.random() * words.length)];
    return `${word}-${numbers}`;
};

const AntiReplayPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { test } = location.state || {};
    const [passphrase] = useState(generatePassphrase());

    if (!test) {
        useEffect(() => {
            navigate('/skill-test');
        }, [navigate]);
        return null;
    }
    
    const handleNext = () => {
        navigate('/verify-test', { state: { test } });
    };

    return (
        <Layout title="Anti-Replay Check" showBackButton>
            <div className="flex flex-col h-full items-center justify-center text-center">
                <div className="bg-emerald-400/20 text-emerald-400 p-4 rounded-full mb-6">
                    <MicIcon />
                </div>
                <h2 className="text-2xl font-bold">Speak Your Passphrase</h2>
                <p className="text-gray-400 mt-2 mb-6">At the beginning of your video recording, please clearly state the following code:</p>
                <div className="bg-[#1A2E29] p-6 rounded-2xl w-full">
                    <p className="text-3xl font-mono tracking-widest text-emerald-400">{passphrase}</p>
                </div>
                <p className="text-xs text-gray-500 mt-4">This ensures the video is new and authentic.</p>
                <div className="mt-8 w-full">
                    <button 
                        onClick={handleNext}
                        className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                        I Understand, Continue
                    </button>
                </div>
            </div>
        </Layout>
    );
};
export default AntiReplayPage;
