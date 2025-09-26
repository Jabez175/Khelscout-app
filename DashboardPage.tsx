import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { UserRole, Session } from './types';
import { PlusIcon, SparklesIcon, SendIcon, VideoIcon, MessageSquareIcon, MapIcon, ClockIcon } from './Icons';
import { useNavigate } from 'react-router-dom';
import PerformanceChart from './PerformanceChart';
import AiMentorReportModal from './AiMentorReportModal';
import { SESSIONS_DATA, ATHLETES_DATA } from './constants';

// MOCK API
const fetchMentorAthletes = async () => {
    // TODO: Replace with API call to GET /api/dashboard/mentor-athletes
    const mentorAthletesData = [
        { id: 'athlete1', name: 'Ethan Carter', avatar: 'https://picsum.photos/seed/ethan/100', skillLevel: 'Intermediate', assessmentScore: 88, progress: 12 },
        { id: 'athlete2', name: 'Sophia Chen', avatar: 'https://picsum.photos/seed/sophia/100', skillLevel: 'Advanced', assessmentScore: 92, progress: 5 },
        { id: 'athlete3', name: 'Liam Rodriguez', avatar: 'https://picsum.photos/seed/liam/100', skillLevel: 'Beginner', assessmentScore: 75, progress: -2 },
    ];
    return new Promise(resolve => setTimeout(() => resolve(mentorAthletesData), 1000));
};

const AthletePerformanceCardSkeleton: React.FC = () => (
    <div className="bg-[#0E1B17] rounded-2xl ring-1 ring-white/10 p-4 shimmer-bg">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-700"></div>
            <div className="flex-grow space-y-2">
                <div className="h-5 w-3/4 rounded bg-gray-700"></div>
                <div className="grid grid-cols-3 gap-x-4 text-sm mt-2 text-center">
                    {[...Array(3)].map((_, i) => (
                        <div key={i}>
                            <div className="h-3 w-1/2 mx-auto rounded bg-gray-700 mb-1"></div>
                            <div className="h-4 w-3/4 mx-auto rounded bg-gray-700"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            </div>
        </div>
    </div>
);

const MentorSessionCard: React.FC<{ session: Session }> = ({ session }) => {
    const isOngoing = new Date(session.date).toDateString() === new Date().toDateString();
    const assignedAthletes = ATHLETES_DATA.filter(a => session.assignedAthleteIds.includes(a.id));

    return (
        <div className="bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-white/10">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-white">{session.title}</h3>
                    <p className="text-sm text-gray-400">{session.type}</p>
                </div>
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
            <div className="border-t border-white/10 mt-3 pt-3">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                        <ClockIcon />
                        <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} @ {session.time}</span>
                    </div>
                    <div className="flex -space-x-2">
                        {assignedAthletes.slice(0, 3).map(a => (
                            <img key={a.id} src={a.avatarUrl} alt={a.name} className="w-6 h-6 rounded-full ring-2 ring-[#0E1B17]" title={a.name} />
                        ))}
                        {assignedAthletes.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold ring-2 ring-[#0E1B17]">{`+${assignedAthletes.length - 3}`}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MentorDashboard: React.FC = () => {
    const [athletes, setAthletes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [reportingAthlete, setReportingAthlete] = useState<any | null>(null);
    const navigate = useNavigate();

    const mentorSessions = SESSIONS_DATA.filter(s => s.mentorId === '4').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchMentorAthletes();
            setAthletes(data as any[]);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleAthleteClick = (athleteId: string) => {
        setSelectedAthleteId(prevId => (prevId === athleteId ? null : prevId));
    };

    const handleOpenReport = (athlete: any) => {
        setReportingAthlete(athlete);
        setReportModalOpen(true);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-bold mb-4">Upcoming & Ongoing Sessions</h2>
                    <div className="h-24 w-full bg-[#0E1B17] rounded-2xl shimmer-bg"></div>
                </section>
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full h-12 bg-[#0E1B17] rounded-xl shimmer-bg"></div>
                    <div className="w-full h-12 bg-[#0E1B17] rounded-xl shimmer-bg"></div>
                </div>
                <section>
                    <h2 className="text-xl font-bold mb-4">Your Athletes' Performance</h2>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <AthletePerformanceCardSkeleton key={i} />)}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section>
                <h2 className="text-xl font-bold mb-4">Upcoming & Ongoing Sessions</h2>
                {mentorSessions.length > 0 ? (
                    <div className="space-y-4">
                        {mentorSessions.map(session => <MentorSessionCard key={session.id} session={session} />)}
                    </div>
                ) : (
                    <div className="text-center p-6 bg-[#0E1B17] rounded-2xl ring-1 ring-white/10">
                        <p className="text-gray-400">You have no upcoming sessions scheduled.</p>
                        <button onClick={() => navigate('/create-session')} className="mt-3 text-emerald-400 font-semibold">Schedule a new session</button>
                    </div>
                )}
            </section>
            
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate('/heatmap')} className="w-full flex items-center justify-center gap-2 bg-[#0E1B17] text-white font-bold py-3 rounded-xl ring-1 ring-white/10 hover:bg-gray-800 transition-colors">
                    <MapIcon /> View Talent Map
                </button>
                 <button onClick={() => navigate('/drills')} className="w-full flex items-center justify-center gap-2 bg-[#0E1B17] text-white font-bold py-3 rounded-xl ring-1 ring-white/10 hover:bg-gray-800 transition-colors">
                    <SparklesIcon /> Coaching Hub
                </button>
            </div>
            
            <section>
                <h2 className="text-xl font-bold mb-4">Your Athletes' Performance</h2>
                <div className="space-y-4">
                    {athletes.map(athlete => (
                        <div key={athlete.id} className="bg-[#0E1B17] rounded-2xl ring-1 ring-white/10">
                            <div
                                className="p-4 flex items-center gap-4"
                            >
                                <div onClick={() => handleAthleteClick(athlete.id)} className="flex-grow flex items-center gap-4 cursor-pointer">
                                    <img src={athlete.avatar} alt={athlete.name} className="w-16 h-16 rounded-full border-2 border-gray-700" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg">{athlete.name}</h3>
                                        <div className="grid grid-cols-3 gap-x-4 text-sm mt-2 text-center">
                                            <div>
                                                <p className="text-gray-400">Skill Level</p>
                                                <p className="font-semibold text-white">{athlete.skillLevel}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Assessment</p>
                                                <p className="font-semibold text-white font-mono">{athlete.assessmentScore}%</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Progress</p>
                                                <p className={`font-semibold font-mono ${athlete.progress >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{athlete.progress >= 0 ? '+' : ''}{athlete.progress}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                     <button
                                        onClick={() => navigate(`/chat/${athlete.id}`)}
                                        className="bg-sky-500/20 text-sky-400 p-2.5 rounded-full hover:bg-sky-500/40 transition-colors"
                                        aria-label={`Message ${athlete.name}`}
                                        title="Message"
                                    >
                                        <SendIcon />
                                    </button>
                                    <button
                                        onClick={() => handleOpenReport(athlete)}
                                        className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-full hover:bg-emerald-500/40 transition-colors"
                                        aria-label={`Get AI Report for ${athlete.name}`}
                                        title="Get AI Report"
                                    >
                                        <SparklesIcon />
                                    </button>
                                </div>
                            </div>
                            {selectedAthleteId === athlete.id && (
                                <div className="p-4 border-t border-white/10 transition-all duration-500 ease-in-out">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-bold">Performance & Goals</h4>
                                            <p className="text-sm text-gray-400">Last 6 Months</p>
                                        </div>
                                        <p className={`font-bold font-mono ${athlete.progress >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {athlete.progress >= 0 ? '+' : ''}{athlete.progress}%
                                        </p>
                                    </div>
                                    <PerformanceChart />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
             <AiMentorReportModal 
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
                athleteName={reportingAthlete?.name || ''}
            />
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const headerActions = (
        <>
            <button onClick={() => navigate('/chat-list')} className="p-2">
                <MessageSquareIcon />
            </button>
            <button onClick={() => navigate('/create-session')} className="p-2">
                <PlusIcon />
            </button>
        </>
    );
    
    return (
        <Layout title="Dashboard" showSettingsButton headerActions={headerActions}>
            <MentorDashboard />
        </Layout>
    );
};

export default DashboardPage;