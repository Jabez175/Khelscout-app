import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from './types';

const SignupSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { role, sport } = (location.state as { role: UserRole, sport: string }) || {};

    const handleContinue = async () => {
        if (role) {
            await login(role, sport);
            // App.tsx will handle redirecting to the correct dashboard after login
        } else {
            // Fallback if state is lost
            navigate('/login');
        }
    };

    return (
        <div className="flex flex-col h-screen items-center justify-center text-center bg-[#0D1A18] p-6 animate-fade-in">
            <h1 className="text-6xl mb-4">🏆</h1>
            <h2 className="text-3xl font-bold text-white">Game On!</h2>
            <p className="text-xl text-gray-300 mt-2 mb-8">Your account is ready.</p>
            
            <button
                onClick={handleContinue}
                className="w-full max-w-sm bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity text-lg"
            >
                Let's Go!
            </button>
        </div>
    );
};

export default SignupSuccessPage;
