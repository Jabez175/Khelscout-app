import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, LayoutDashboardIcon, UserIcon, TrophyIcon, ClipboardListIcon, MapIcon, CalendarIcon, UsersIcon, HeartbeatIcon, BookOpenIcon, ClipboardCheckIcon } from './Icons';
import { useAuth } from './AuthContext';
import { UserRole } from './types';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; activePaths?: string[] }> = ({ to, icon, label, activePaths = [] }) => {
    const location = useLocation();
    const isActive = location.pathname === to || activePaths.some(p => location.pathname.startsWith(p));
    return (
        <NavLink to={to} className={`flex flex-col items-center justify-center text-xs h-full transition-colors duration-300 ${isActive ? 'text-emerald-500 dark:text-emerald-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
            <div className={`relative ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,245,160,0.7)]' : ''}`}>
                {icon}
            </div>
            <span className="mt-1.5 font-semibold">{label}</span>
        </NavLink>
    );
};

const AthleteNav: React.FC = () => (
    <div className="grid grid-cols-5 h-full items-center">
        <NavItem to="/home" icon={<HomeIcon />} label="Home" />
        <NavItem to="/events" icon={<CalendarIcon />} label="Events" activePaths={['/event/']} />
        <div className="h-full flex items-center justify-center">
            <div className="w-16 h-8 rounded-full bg-gray-100 dark:bg-[#050e0c] -translate-y-1/2"></div>
        </div>
        <NavItem to="/community" icon={<UsersIcon />} label="Community" activePaths={['/rankings']} />
        <NavItem to="/profile" icon={<UserIcon />} label="Profile" activePaths={['/performance', '/my-registrations', '/rewards', '/progression-board', '/health']} />
    </div>
);

const MentorNav: React.FC = () => (
    <div className="grid grid-cols-5 h-full">
        <NavItem to="/dashboard" icon={<LayoutDashboardIcon />} label="Dashboard" />
        <NavItem to="/events" icon={<CalendarIcon />} label="Events" />
        <NavItem to="/drills" icon={<BookOpenIcon />} label="Drills" />
        <NavItem to="/community" icon={<UsersIcon />} label="Community" activePaths={['/rankings']} />
        <NavItem to="/profile" icon={<UserIcon />} label="Profile" />
    </div>
);


const OrganizationNav = () => (
    <div className="grid grid-cols-5 h-full">
        <NavItem to="/find-athletes" icon={<LayoutDashboardIcon />} label="Dashboard" />
        <NavItem to="/shortlisted-athletes" icon={<UserIcon />} label="Shortlist" />
        <NavItem to="/manage-events" icon={<CalendarIcon />} label="Events" activePaths={['/create-event', '/analytics/events']} />
        <NavItem to="/verify" icon={<ClipboardCheckIcon />} label="Verify" />
        <NavItem to="/profile" icon={<UserIcon />} label="Profile" />
    </div>
);


const BottomNav: React.FC = () => {
    const { user } = useAuth();
    
    const renderNav = () => {
        switch (user?.role) {
            case UserRole.ATHLETE:
                return <AthleteNav />;
            case UserRole.MENTOR:
                return <MentorNav />;
            case UserRole.ORGANIZATION:
                return <OrganizationNav />;
            default:
                 return (
                    <div className="grid grid-cols-2 h-full">
                        <NavItem to="/home" icon={<HomeIcon />} label="Home" />
                        <NavItem to="/profile" icon={<UserIcon />} label="Profile" />
                    </div>
                );
        }
    }

    return (
        <div className="w-full max-w-md mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-[#0E1B17]/80 backdrop-blur-md border-t border-gray-200 dark:border-white/10 z-50">
            <div className="h-20">
                {renderNav()}
            </div>
        </div>
    );
};

export default BottomNav;