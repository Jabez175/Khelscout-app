import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { useAuth } from './AuthContext';
import { UserIcon, BellIcon, ShieldIcon, HelpCircleIcon, LogOutIcon, ChevronRightIcon, UploadIcon, RocketIcon, WatchIcon, SunIcon, MoonIcon, LaptopIcon } from './Icons';
import ConnectWearableModal from './ConnectWearableModal';
import FeedbackModal from './FeedbackModal';

const SettingsLink: React.FC<{ icon: React.ReactNode; text: string; onClick?: () => void; hasToggle?: boolean }> = ({ icon, text, onClick, hasToggle }) => {
    return (
        <button onClick={onClick} className="w-full flex items-center bg-white dark:bg-[#0E1B17] p-4 rounded-xl text-left ring-1 ring-gray-200 dark:ring-white/10 hover:ring-emerald-500/50 dark:hover:ring-emerald-400/50 transition-all">
            <div className="text-emerald-500 dark:text-emerald-400">{icon}</div>
            <span className="flex-grow ml-4 font-semibold">{text}</span>
            {hasToggle ? (
                <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
            ) : (
                <ChevronRightIcon />
            )}
        </button>
    );
};


const ThemeSelector: React.FC = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const applyTheme = (t: string) => {
            const root = document.documentElement;
            const isDark = t === 'dark' || (t === 'system' && mediaQuery.matches);
            root.classList.toggle('dark', isDark);
        };

        const handleSystemThemeChange = () => {
            if (localStorage.theme === 'system' || !('theme' in localStorage)) {
                applyTheme('system');
            }
        };

        applyTheme(theme);
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [theme]);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        if (newTheme === 'system') {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', newTheme);
        }
    };

    const options = [
        { name: 'Light', value: 'light', icon: <SunIcon /> },
        { name: 'Dark', value: 'dark', icon: <MoonIcon /> },
        { name: 'System', value: 'system', icon: <LaptopIcon /> },
    ];

    return (
        <div className="bg-gray-100 dark:bg-[#0E1B17] p-2 rounded-xl flex items-center ring-1 ring-gray-200 dark:ring-white/10">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    className={`w-1/3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${theme === option.value ? 'bg-emerald-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                    {option.icon}
                    {option.name}
                </button>
            ))}
        </div>
    );
};


const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Layout title="Settings" showBackButton>
                <div className="space-y-8">
                    <section>
                        <h2 className="text-lg font-bold mb-4 text-gray-500 dark:text-gray-400">Account</h2>
                        <div className="space-y-3">
                            <SettingsLink icon={<UserIcon />} text="Edit Profile" onClick={() => navigate('/edit-profile')} />
                            <SettingsLink icon={<BellIcon />} text="Notifications" hasToggle />
                        </div>
                    </section>

                     <section>
                        <h2 className="text-lg font-bold mb-4 text-gray-500 dark:text-gray-400">Appearance</h2>
                        <ThemeSelector />
                    </section>
                    
                    <section>
                        <h2 className="text-lg font-bold mb-4 text-gray-500 dark:text-gray-400">App Settings</h2>
                        <div className="space-y-3">
                            <SettingsLink icon={<WatchIcon />} text="Connect Wearable" onClick={() => setIsWearableModalOpen(true)} />
                            <SettingsLink icon={<ShieldIcon />} text="Privacy & Data" onClick={() => navigate('/privacy')} />
                            <SettingsLink icon={<UploadIcon />} text="Offline Sync Manager" onClick={() => navigate('/sync-manager')} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 text-gray-500 dark:text-gray-400">Support & Vision</h2>
                        <div className="space-y-3">
                            <SettingsLink icon={<HelpCircleIcon />} text="Help & Support" onClick={() => setIsFeedbackModalOpen(true)} />
                            <SettingsLink icon={<RocketIcon />} text="Future Roadmap" onClick={() => navigate('/future-roadmap')} />
                        </div>
                    </section>
                    
                    <div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 font-bold p-4 rounded-xl ring-1 ring-red-200 dark:ring-red-400/30 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                        >
                            <LogOutIcon />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </Layout>
            <ConnectWearableModal isOpen={isWearableModalOpen} onClose={() => setIsWearableModalOpen(false)} />
            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
        </>
    );
};

export default SettingsPage;