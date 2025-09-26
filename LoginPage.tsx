import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from './types';
import { GoogleIcon, DumbbellIcon, SchoolIcon, BriefcaseIcon } from './Icons';

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<UserRole | null>(null);
    const { login } = useAuth();

    const handleLogin = async (role: UserRole) => {
        setIsLoading(role);
        try {
            await login(role);
            // Navigation will be handled by the AppRoutes component
        } catch (error) {
            console.error("Login failed", error);
            // TODO: Show an error message to the user
            setIsLoading(null);
        }
    };

    const focusedRoles = [UserRole.ATHLETE, UserRole.MENTOR, UserRole.ORGANIZATION];
    const roleIcons: Partial<Record<UserRole, React.ReactNode>> = {
        [UserRole.ATHLETE]: <DumbbellIcon />,
        [UserRole.MENTOR]: <SchoolIcon />,
        [UserRole.ORGANIZATION]: <BriefcaseIcon />,
    };

    const RoleButton: React.FC<{ role: UserRole }> = ({ role }) => (
        <button
            onClick={() => handleLogin(role)}
            disabled={!!isLoading}
            className="w-full bg-[#0E1B17] text-white font-semibold p-4 rounded-xl flex items-center ring-1 ring-white/10 hover:ring-white/20 transition-all disabled:opacity-50"
        >
            <div className="text-emerald-400">
                {roleIcons[role]}
            </div>
            <span className="ml-4 flex-grow text-left">{role}</span>
            {isLoading === role ? (
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
            ) : (
                <span className="text-xs text-gray-400">Login →</span>
            )}
        </button>
    );

    return (
        <div className="flex flex-col justify-center min-h-screen bg-transparent px-6 py-8 space-y-16">
            <div className="text-center">
                <h1 className="text-5xl font-extrabold text-white bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Khelscout</h1>
                <p className="text-gray-400 mt-4 text-lg">Democratizing Sports Talent</p>
            </div>

            <div className="w-full max-w-sm mx-auto">
                <div className="space-y-3">
                    {focusedRoles.map(role => (
                        <RoleButton key={role} role={role} />
                    ))}
                </div>
                
                <div className="my-6 flex items-center w-full">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                 <button
                    disabled={!!isLoading}
                    className="w-full bg-[#0E1B17] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center ring-1 ring-white/10 hover:ring-white/20 transition-colors disabled:opacity-50"
                >
                    <GoogleIcon />
                    <span className="ml-2">Continue with Google</span>
                </button>
                
                <p className="text-center text-gray-400 text-sm mt-8">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold text-emerald-400 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;