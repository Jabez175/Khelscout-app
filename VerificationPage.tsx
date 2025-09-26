import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { CheckCircleIcon, LocationIcon, UserIcon, ShieldIcon } from './Icons';
import { SkillTest } from './types';

const VerificationStep: React.FC<{ text: string; done: boolean }> = ({ text, done }) => (
    <div className="flex items-center gap-3 text-lg">
        {done ? (
            <CheckCircleIcon className="text-emerald-400" />
        ) : (
            <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-gray-500"></div>
        )}
        <span className={done ? 'text-white' : 'text-gray-500'}>{text}</span>
    </div>
);

const VerificationPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { test } = location.state as { test: SkillTest };

    const [deviceCheckDone, setDeviceCheckDone] = useState(false);
    const [faceScanDone, setFaceScanDone] = useState(false);
    const [gpsDone, setGpsDone] = useState(false);
    const [envCheckDone, setEnvCheckDone] = useState(false);
    const [allDone, setAllDone] = useState(false);
    
    useEffect(() => {
        const timer1 = setTimeout(() => setDeviceCheckDone(true), 1500);
        const timer2 = setTimeout(() => setFaceScanDone(true), 2500);
        const timer3 = setTimeout(() => setGpsDone(true), 3500);
        const timer4 = setTimeout(() => setEnvCheckDone(true), 4500);
        const timer5 = setTimeout(() => setAllDone(true), 5000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
        };
    }, []);

    const handleStartTest = () => {
        navigate('/start-test-prompt', { state: { test } });
    };
    
    return (
        <Layout title="Pre-Test Verification" showBackButton>
            <div className="flex flex-col h-full items-center justify-center text-center">
                <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-dashed border-gray-700 rounded-full animate-pulse"></div>
                    <div className="w-56 h-56 bg-[#1A2E29] rounded-full flex items-center justify-center">
                        <UserIcon />
                    </div>
                </div>

                <h2 className="text-2xl font-bold mt-8">Verifying Identity & Environment</h2>
                <p className="text-gray-400 mt-2 mb-8">Please hold still. This ensures test integrity.</p>

                <div className="bg-[#1A2E29] p-6 rounded-2xl w-full space-y-4">
                    <VerificationStep text="Device Integrity Scan" done={deviceCheckDone} />
                    <VerificationStep text="Face Scan vs. Profile" done={faceScanDone} />
                    <VerificationStep text="Capturing Secure GPS Location" done={gpsDone} />
                    <VerificationStep text="Checking for Standard Conditions" done={envCheckDone} />
                </div>
                
                <div className="mt-8 w-full">
                    <button 
                        onClick={handleStartTest}
                        disabled={!allDone}
                        className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {allDone ? `Proceed to ${test.title} Test` : 'Verifying...'}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default VerificationPage;