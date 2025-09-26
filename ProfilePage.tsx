import React from 'react';
import { useAuth } from './AuthContext';
import { UserRole } from './types';
import { ShareIcon, MoreVerticalIcon, ClipboardListIcon, ChevronRightIcon, BarChart2Icon, BadgeIcon, MessageSquareIcon, CalendarIcon, HeartbeatIcon, GiftIcon, TrophyIcon, ShieldCheckIcon } from './Icons';
import Layout from './Layout';
import { Link } from 'react-router-dom';

const ProfileHeader: React.FC<{
    name: string;
    avatarUrl: string;
    subtitle: string;
}> = ({ name, avatarUrl, subtitle }) => (
    <div className="flex flex-col items-center text-center">
        <div className="relative">
            <img src={avatarUrl} alt={name} className="w-28 h-28 rounded-full border-4 border-gray-700 mb-4" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400/50 animate-pulse"></div>
        </div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-gray-400">{subtitle}</p>
        <Link to="/edit-profile" className="w-full text-center mt-6 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20">
            Edit Profile
        </Link>
    </div>
);

const ProfileLinkCard: React.FC<{ to: string, icon: React.ReactNode, title: string, subtitle: string }> = ({ to, icon, title, subtitle }) => (
    <Link to={to} className="w-full flex items-center bg-[#0E1B17] p-4 rounded-xl text-left ring-1 ring-white/10 hover:ring-emerald-400/50 transition-all">
        <div className="text-emerald-400">{icon}</div>
        <div className="flex-grow ml-4">
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
        <ChevronRightIcon />
    </Link>
);

const ScoreItem: React.FC<{ label: string; score?: number; unit?: string }> = ({ label, score, unit }) => (
    <div className="bg-[#050e0c] p-3 rounded-lg text-center ring-1 ring-white/5">
        <p className="text-2xl font-bold font-mono">{score || 'N/A'}<span className="text-sm text-gray-400">{unit ? ` ${unit}`: ''}</span></p>
        <p className="text-xs text-gray-400 truncate">{label}</p>
    </div>
);

const badges = [
    { name: 'SAI Certified', description: 'Completed all national assessment tests.' },
    { name: 'Vertical Virtuoso', description: 'Top 10% vertical jump score.' },
    { name: 'Speed Demon', description: 'Verified time in shuttle run.' },
    { name: 'First Assessment', description: 'Completed your first official test.' },
];

const AthleteProfile: React.FC = () => {
    const { user } = useAuth();
    const scores = user?.saiScores;
    
    return (
        <div className="space-y-8">
            <ProfileHeader name={user?.name || ''} avatarUrl={user?.avatarUrl || ''} subtitle={`${user?.sport} Athlete • Joined ${user?.joinedYear}`} />
            
            <section className="bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-white/10 flex items-center gap-4">
                <div className="text-emerald-400 bg-emerald-400/10 p-3 rounded-lg">
                    <ShieldCheckIcon />
                </div>
                <div>
                    <h3 className="font-bold text-white">Verified Identity</h3>
                    <p className="text-sm text-gray-400">Your face scan is on file for AI-proctored test verification. This can only be set once.</p>
                </div>
            </section>

            <div className="bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-white/10">
                <h2 className="text-xl font-bold mb-4">SAI Test Scores</h2>
                <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                    <ScoreItem label="Height" score={scores?.height?.score} unit={scores?.height?.unit} />
                    <ScoreItem label="Weight" score={scores?.weight?.score} unit={scores?.weight?.unit} />
                    <ScoreItem label="Sit & Reach" score={scores?.sitAndReach?.score} unit={scores?.sitAndReach?.unit} />
                    <ScoreItem label="Vertical Jump" score={scores?.standingVerticalJump?.score} unit={scores?.standingVerticalJump?.unit} />
                    <ScoreItem label="Broad Jump" score={scores?.standingBroadJump?.score} unit={scores?.standingBroadJump?.unit} />
                    <ScoreItem label="Med Ball Throw" score={scores?.medicineBallThrow?.score} unit={scores?.medicineBallThrow?.unit} />
                    <ScoreItem label="30m Sprint" score={scores?.standingStart30m?.score} unit={scores?.standingStart30m?.unit} />
                    <ScoreItem label="4x10 Shuttle" score={scores?.shuttleRun4x10?.score} unit={scores?.shuttleRun4x10?.unit} />
                    <ScoreItem label="Sit Ups" score={scores?.sitUps?.score} unit={scores?.sitUps?.unit} />
                    <ScoreItem label="Endurance Run" score={scores?.enduranceRun?.score} unit={scores?.enduranceRun?.unit} />
                </div>
            </div>

            <section>
                <h2 className="text-xl font-bold mb-4">Badges Earned</h2>
                <div className="grid grid-cols-2 gap-4">
                    {badges.map(badge => (
                        <div key={badge.name} className="bg-[#0E1B17] p-4 rounded-xl text-center ring-1 ring-white/10">
                            <div className="text-yellow-400 bg-yellow-400/10 p-3 rounded-lg mb-2 inline-block drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
                                <BadgeIcon />
                            </div>
                            <p className="font-bold text-white text-sm">{badge.name}</p>
                            <p className="text-xs text-gray-400">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            <div>
                 <h2 className="text-xl font-bold mb-4">My Dashboard</h2>
                 <div className="space-y-3">
                    <ProfileLinkCard 
                        to="/performance"
                        icon={<BarChart2Icon />}
                        title="My Performance"
                        subtitle="View benchmarks and earned badges"
                    />
                    <ProfileLinkCard 
                        to="/my-registrations"
                        icon={<CalendarIcon />}
                        title="My Registrations"
                        subtitle="View your upcoming event registrations"
                    />
                     <ProfileLinkCard 
                        to="/health"
                        icon={<HeartbeatIcon />}
                        title="Health Log"
                        subtitle="Track injuries and recovery"
                    />
                    <ProfileLinkCard 
                        to="/rewards"
                        icon={<GiftIcon />}
                        title="Reward Wallet"
                        subtitle="View points and redeem rewards"
                    />
                    <ProfileLinkCard 
                        to="/progression-board"
                        icon={<TrophyIcon />}
                        title="Progression Board"
                        subtitle="Track your journey from District to National"
                    />
                     <ProfileLinkCard 
                        to="/chat/sai_official_1"
                        icon={<MessageSquareIcon />}
                        title="Contact SAI Official"
                        subtitle="Get help and support from officials"
                    />
                 </div>
            </div>
        </div>
    );
};

const GenericProfile: React.FC = () => {
    const { user } = useAuth();
    return (
         <div className="space-y-8">
            <ProfileHeader name={user?.name || ''} avatarUrl={user?.avatarUrl || ''} subtitle={user?.specialization || user?.role || ''} />
            <section className="bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-white/10">
                <h2 className="text-xl font-bold mb-2">About</h2>
                <p className="text-gray-300 text-sm leading-relaxed">{user?.bio || `Official profile for ${user?.name}.`}</p>
            </section>
        </div>
    );
};


const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    
    if (!user) return null;

    const pageTitle = `Profile`;

    const headerActions = (
        <>
            <button className="p-2"><ShareIcon /></button>
            <button className="p-2"><MoreVerticalIcon /></button>
        </>
    );
    
    const renderProfile = () => {
        switch(user.role) {
            case UserRole.ATHLETE:
                return <AthleteProfile />;
            case UserRole.MENTOR:
            case UserRole.ORGANIZATION:
                return <GenericProfile />;
            default:
                return <GenericProfile />;
        }
    }

    return (
        <Layout title={pageTitle} headerActions={headerActions} showBackButton>
            {renderProfile()}
        </Layout>
    );
};

export default ProfilePage;