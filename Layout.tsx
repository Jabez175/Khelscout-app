

import React, { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { ArrowLeftIcon, SettingsIcon, BrainCircuitIcon, BellIcon } from './Icons';
import AiHubModal from './AiHubModal';
import { useAuth } from './AuthContext';
import { UserRole } from './types';

interface LayoutProps {
    children: ReactNode;
    title: string;
    showBackButton?: boolean;
    showSettingsButton?: boolean;
    leftAction?: React.ReactNode;
    headerActions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBackButton, showSettingsButton, leftAction, headerActions }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [isAiHubOpen, setIsAiHubOpen] = useState(false);
    
    const isAiHubActive = isAiHubOpen || ['/training', '/skill-test', '/record-workout', '/live-analysis', '/workout', '/diet-planner', '/career-advisor'].some(p => location.pathname.startsWith(p));

    const renderLeftAction = () => {
        if (leftAction) {
            return leftAction;
        }
        if (showBackButton) {
            return (
                <button onClick={() => navigate(-1)} className="p-2">
                   <ArrowLeftIcon />
                </button>
            );
        }
        return <div className="w-10"></div>;
    };

    return (
        <div className="flex flex-col h-full w-full bg-transparent">
            <header className="flex items-center justify-between p-4 sticky top-0 bg-white/80 dark:bg-[#050e0c]/80 backdrop-blur-sm z-40 border-b border-gray-200 dark:border-white/10">
                {renderLeftAction()}
                <h1 className="text-xl font-bold">{title}</h1>
                <div className="flex items-center gap-2">
                    {headerActions}
                    {user && (
                         <button onClick={() => navigate('/notifications')} className="p-2">
                            <BellIcon />
                        </button>
                    )}
                    {showSettingsButton ? (
                        <button onClick={() => navigate('/settings')} className="p-2">
                            <SettingsIcon />
                        </button>
                    ) : (!headerActions && !user) ? <div className="w-10"></div> : null}
                </div>
            </header>
            <main className="flex-grow overflow-y-auto pb-24 px-4">
                {children}
            </main>

            {user?.role === UserRole.ATHLETE && (
                <button
                    onClick={() => setIsAiHubOpen(true)}
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-[60] group
                        ${isAiHubActive 
                            ? 'bg-gradient-to-br from-emerald-400 to-cyan-400 ring-2 ring-black/80 dark:ring-white/80 scale-110 shadow-emerald-400/40' 
                            : 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-emerald-500/20'
                        }
                        hover:scale-110 hover:shadow-emerald-400/40
                    `}
                    aria-label="Open AI Hub"
                >
                    <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <BrainCircuitIcon />
                </button>
            )}

            <BottomNav />
            <AiHubModal isOpen={isAiHubOpen} onClose={() => setIsAiHubOpen(false)} />
        </div>
    );
};

export default Layout;