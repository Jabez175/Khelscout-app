import React, { useMemo } from 'react';
import Layout from './Layout';
import { useAuth } from './AuthContext';
import { UserRole, Session } from './types';
import { useNavigate } from 'react-router-dom';
import { DumbbellIcon, ArrowRightIcon, ActivityIcon, BarChart2Icon, TrophyIcon, ClipboardListIcon, MessageSquareIcon, MapIcon, UsersIcon, ClockIcon } from './Icons';
import PerformanceChart from './PerformanceChart';
import { SESSIONS_DATA } from './constants';

const QuickActionCard: React.FC<{ title: string; to: string; icon: React.ReactNode }> = ({ title, to, icon }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(to)}
            className="bg-white dark:bg-[#0E1B17] p-4 rounded-2xl flex flex-col items-center justify-center text-center ring-1 ring-gray-200 dark:ring-white/10 hover:ring-emerald-500 dark:hover:ring-emerald-400/50 transition-all group"
        >
            <div className="text-emerald-500 dark:text-emerald-400 bg-emerald-400/10 p-3 rounded-lg mb-2 transition-all group-hover:bg-emerald-400/20 group-hover:scale-110">
                {icon}
            </div>
            <p className="font-semibold text-xs text-gray-800 dark:text-white">{title}</p>
        </button>
    );
};

const UpcomingSessionCard: React.FC<{ session: Session }> = ({ session }) => {
    const isOngoing = new Date(session.date).toDateString() === new Date().toDateString();

    return (
        <div className="bg-white dark:bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-gray-200 dark:ring-white/10 flex items-center gap-4">
            <div className="text-emerald-500 dark:text-emerald-400 bg-emerald-400/10 p-3 rounded-lg">
                <ClockIcon />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">{session.title}</h3>
                    {isOngoing && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            LIVE
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{session.type} &bull; {session.time}</p>
            </div>
        </div>
    );
};


const AthleteHomePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const upcomingSessions = useMemo(() => {
        if (!user) return [];
        return SESSIONS_DATA
            .filter(session => session.assignedAthleteIds.includes(user.id))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [user]);

    const dailyChallenge = useMemo(() => {
        switch (user?.sport) {
            case 'Soccer':
                return { title: 'Dribbling Practice', description: 'Complete 15 mins of cone drills.' };
            case 'Running':
                return { title: 'Pace Challenge', description: 'Run 5k at a consistent pace.' };
            case 'Tennis':
                return { title: 'Serve Accuracy', description: 'Practice 50 accurate serves.' };
            case 'Cricket':
                return { title: 'Fielding Drills', description: 'Complete 30 mins of catching practice.' };
            case 'Basketball':
            default:
                return { title: 'Free Throw Practice', description: 'Make 50 free throws.' };
        }
    }, [user?.sport]);
    
    // Mock latest test scores
    const latestScores = {
        verticalJump: 45, // cm
        shuttleRun: 10.2, // seconds
        situps: 48, // reps
    };

    const headerActions = (
        <button onClick={() => navigate('/chat-list')} className="p-2">
            <MessageSquareIcon />
        </button>
    );

    return (
         <Layout title={`Welcome, ${user?.name.split(' ')[0]}`} showSettingsButton headerActions={headerActions}>
            <div className="space-y-8">
                <section className="bg-white dark:bg-[#0E1B17] rounded-2xl p-6 text-center ring-1 ring-gray-200 dark:ring-white/10">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Begin Your Assessment</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Complete the standardized national tests to get benchmarked and discovered by the Sports Authority of India.</p>
                        <button 
                            onClick={() => navigate('/skill-test')}
                            className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity w-full flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            <ActivityIcon /> Start SAI National Tests
                        </button>
                    </div>
                </section>
                
                <div className="grid grid-cols-4 gap-3">
                    <QuickActionCard title="My Performance" to="/performance" icon={<BarChart2Icon />} />
                    <QuickActionCard title="Find a Mentor" to="/find-mentor" icon={<UsersIcon />} />
                    <QuickActionCard title="Leaderboard" to="/rankings" icon={<TrophyIcon />} />
                    <QuickActionCard title="Talent Map" to="/heatmap" icon={<MapIcon />} />
                </div>
                
                <section>
                    <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
                    {upcomingSessions.length > 0 ? (
                         <div className="space-y-3">
                            {upcomingSessions.map(session => <UpcomingSessionCard key={session.id} session={session} />)}
                        </div>
                    ) : (
                         <div className="text-center p-6 bg-white dark:bg-[#0E1B17] rounded-2xl ring-1 ring-gray-200 dark:ring-white/10">
                            <p className="text-gray-500 dark:text-gray-400">No upcoming sessions. Stay ready for your next practice!</p>
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-bold">Performance Trend</h2>
                         <a href="#" className="text-sm text-emerald-500 dark:text-emerald-400 font-semibold">View Details</a>
                    </div>
                    <div className="bg-white dark:bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-gray-200 dark:ring-white/10">
                        <PerformanceChart />
                    </div>
                </section>
                
                <section>
                    <h2 className="text-xl font-bold mb-4">Latest Test Scores</h2>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white dark:bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-gray-200 dark:ring-white/10">
                            <p className="text-2xl font-bold font-mono">{latestScores.verticalJump}<span className="text-sm text-gray-500 dark:text-gray-400"> cm</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Vertical Jump</p>
                        </div>
                        <div className="bg-white dark:bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-gray-200 dark:ring-white/10">
                            <p className="text-2xl font-bold font-mono">{latestScores.shuttleRun}<span className="text-sm text-gray-500 dark:text-gray-400"> s</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Shuttle Run</p>
                        </div>
                         <div className="bg-white dark:bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-gray-200 dark:ring-white/10">
                            <p className="text-2xl font-bold font-mono">{latestScores.situps}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sit-ups</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4">Daily Challenge</h2>
                    <button 
                        onClick={() => navigate('/challenges')}
                        className="w-full bg-white dark:bg-[#0E1B17] p-4 rounded-2xl text-left flex items-center justify-between ring-1 ring-gray-200 dark:ring-white/10 hover:ring-emerald-500/50 dark:hover:ring-emerald-400/50 transition-all"
                    >
                        <div className="flex items-center">
                            <div className="text-emerald-500 dark:text-emerald-400 bg-emerald-400/10 p-3 rounded-lg mr-4">
                                <DumbbellIcon />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{dailyChallenge.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{dailyChallenge.description}</p>
                            </div>
                        </div>
                        <ArrowRightIcon />
                    </button>
                </section>
            </div>
        </Layout>
    );
};


const HomePage: React.FC = () => {
    const { user } = useAuth();
    switch(user?.role) {
        case UserRole.ATHLETE:
            return <AthleteHomePage />;
        default:
            // In a real app, you would have dedicated homepages for other roles.
            // For now, they will be redirected by AppRoutes.
            return <p>Redirecting...</p>;
    }
};

export default HomePage;