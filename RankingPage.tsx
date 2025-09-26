import React, { useState, useMemo, useEffect } from 'react';
import Layout from './Layout';
import { TrophyIcon, StarIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';
import { indianDistricts } from './constants';
import { useAuth } from './AuthContext';
import { ATHLETES_DATA, MENTORS_DATA } from './constants';
import { User, Team } from './types';

type AthleteSortKey = 'rank' | 'sai_score';
type MentorSortKey = 'rating' | 'experienceYears' | 'athletesTrained';
type ActiveTab = 'athletes' | 'teams' | 'mentors';

const sports = ['All', ...Array.from(new Set(ATHLETES_DATA.map(a => a.sport)))];
const mentorSports = ['All', ...Array.from(new Set(MENTORS_DATA.map(m => m.sport)))];

// MOCK TEAM DATA
const TEAMS_DATA: Team[] = [
    { id: 't1', name: 'Mumbai Mavericks', district: 'Mumbai', sport: 'Basketball', totalPoints: 4500, topAthletes: [ATHLETES_DATA[0], ATHLETES_DATA[3]] },
    { id: 't2', name: 'Delhi Dynamos', district: 'Delhi', sport: 'Running', totalPoints: 4200, topAthletes: [ATHLETES_DATA[1]] },
    { id: 't3', name: 'Bangalore Blazers', district: 'Bangalore', sport: 'Soccer', totalPoints: 3950, topAthletes: [ATHLETES_DATA[2]] },
];


const calculateSaiScore = (athlete: User) => {
    const scores = athlete.saiScores;
    if (!scores) return 0;
    const jumpScore = (scores.standingVerticalJump?.score || 0) * 1.5;
    const broadJumpScore = (scores.standingBroadJump?.score || 0) / 2;
    const throwScore = (scores.medicineBallThrow?.score || 0) * 10;
    const situpsScore = (scores.sitUps?.score || 0) * 2;
    const sitAndReachScore = (scores.sitAndReach?.score || 0) * 2;
    const shuttleRunScore = Math.max(0, 15 - (scores.shuttleRun4x10?.score || 15)) * 10;
    const sprintScore = Math.max(0, 7 - (scores.standingStart30m?.score || 7)) * 20;
    const enduranceScore = Math.max(0, 1200 - (scores.enduranceRun?.score || 1200)) / 10;
    return Math.round(jumpScore + broadJumpScore + throwScore + situpsScore + shuttleRunScore + sprintScore + sitAndReachScore + enduranceScore);
}

const MentorCardSkeleton: React.FC = () => (
    <div className="bg-[#1A2E29] p-4 rounded-xl space-y-3 shimmer-bg">
       <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-gray-700"></div>
           <div className="flex-grow space-y-2">
               <div className="h-5 w-3/4 rounded bg-gray-700"></div>
               <div className="h-3 w-1/2 rounded bg-gray-700"></div>
           </div>
       </div>
       <div className="flex justify-between items-center border-t border-b border-white/10 py-3">
           <div className="h-4 w-1/4 rounded bg-gray-700"></div>
           <div className="h-4 w-1/4 rounded bg-gray-700"></div>
           <div className="h-4 w-1/4 rounded bg-gray-700"></div>
       </div>
       <div className="w-full h-10 rounded-lg bg-gray-700"></div>
   </div>
);


const MentorLeaderboard: React.FC = () => {
    const [sportFilter, setSportFilter] = useState('All');
    const [districtFilter, setDistrictFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: MentorSortKey; order: 'asc' | 'desc' }>({
        key: 'rating',
        order: 'desc',
    });
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, [sportFilter, districtFilter]);

    const filteredMentors = useMemo(() => {
        return MENTORS_DATA
            .filter(m => sportFilter === 'All' || m.sport === sportFilter)
            .filter(m => districtFilter === 'All' || m.district === districtFilter);
    }, [sportFilter, districtFilter]);

    const sortedMentors = useMemo(() => {
        return [...filteredMentors].sort((a, b) => {
            const aVal = a[sortConfig.key] || 0;
            const bVal = b[sortConfig.key] || 0;
            if (aVal < bVal) {
                return sortConfig.order === 'asc' ? -1 : 1;
            }
            if (aVal > bVal) {
                return sortConfig.order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredMentors, sortConfig]);
    
    const handleRequestTraining = (mentorName: string) => {
        alert(`Training request sent to ${mentorName}!`);
    };
    
    const handleSort = (key: MentorSortKey) => {
        let order: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.order === 'desc') {
            order = 'asc';
        }
        setSortConfig({ key, order });
    };

    const SortButton: React.FC<{ sortKey: MentorSortKey; label: string }> = ({ sortKey, label }) => {
        const isActive = sortConfig.key === sortKey;
        return (
            <button onClick={() => handleSort(sortKey)} className={`px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'bg-[#1A2E29] text-gray-300'}`}>
                {label}
                {isActive && (
                    sortConfig.order === 'desc' 
                        ? <ArrowDownIcon className="w-3 h-3" /> 
                        : <ArrowUpIcon className="w-3 h-3" />
                )}
            </button>
        );
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg appearance-none text-sm">
                    {mentorSports.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg appearance-none text-sm">
                    <option value="All">All Districts</option>
                    {indianDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
                <SortButton sortKey="rating" label="Rating" />
                <SortButton sortKey="experienceYears" label="Experience" />
                <SortButton sortKey="athletesTrained" label="Athletes Trained" />
            </div>
            <div className="space-y-3">
                 {loading ? (
                    [...Array(4)].map((_, i) => <MentorCardSkeleton key={i} />)
                ) : (
                    sortedMentors.map(mentor => (
                        <div key={mentor.id} className="bg-[#1A2E29] p-4 rounded-xl space-y-3">
                            <div className="flex items-center gap-4">
                                 <img src={mentor.avatarUrl} alt={mentor.name} className="w-12 h-12 rounded-full"/>
                                 <div className="flex-grow">
                                    <p className="font-semibold text-white">{mentor.name}</p>
                                    <p className="text-xs text-emerald-400">{mentor.specialization}</p>
                                 </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-300 border-t border-b border-white/10 py-2">
                                <span className="flex items-center gap-1 font-semibold"><StarIcon filled className="text-yellow-400" /> {mentor.rating?.toFixed(1)}</span>
                                <span>Experience: <span className="font-semibold text-white">{mentor.experienceYears} yrs</span></span>
                                 <span>Trained: <span className="font-semibold text-white">{mentor.athletesTrained}</span></span>
                            </div>
                            <button 
                                onClick={() => handleRequestTraining(mentor.name)}
                                className="w-full bg-emerald-500 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                            >
                                Request Training
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


const TeamLeaderboard: React.FC = () => {
    const sortedTeams = [...TEAMS_DATA].sort((a, b) => b.totalPoints - a.totalPoints);
     const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-400';
        if (rank === 2) return 'text-gray-300';
        if (rank === 3) return 'text-yellow-600';
        return 'text-gray-500';
    }
    return (
        <div className="space-y-3">
            {sortedTeams.map((team, index) => (
                <div key={team.id} className="bg-[#0E1B17] p-3 rounded-xl ring-1 ring-white/10">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10">
                            <TrophyIcon className={getRankColor(index + 1)} />
                            <span className={`font-bold text-lg ml-1 ${getRankColor(index + 1)}`}>{index + 1}</span>
                        </div>
                        <div className="flex-grow mx-4">
                            <p className="font-semibold text-white">{team.name}</p>
                            <p className="text-xs text-gray-400">{team.sport} • {team.district}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-white">{team.totalPoints}</p>
                            <p className="text-xs text-gray-400">Total Points</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AthleteRankSkeleton: React.FC = () => (
    <div className="flex items-center bg-[#0E1B17] p-3 rounded-xl ring-1 ring-white/10 shimmer-bg">
        <div className="flex items-center justify-center w-10">
            <div className="w-6 h-6 rounded bg-gray-700"></div>
        </div>
        <div className="w-12 h-12 rounded-full mx-4 bg-gray-700"></div>
        <div className="flex-grow space-y-2">
            <div className="h-5 w-3/4 rounded bg-gray-700"></div>
            <div className="h-3 w-1/2 rounded bg-gray-700"></div>
        </div>
        <div className="text-right space-y-2">
            <div className="h-5 w-12 ml-auto rounded bg-gray-700"></div>
            <div className="h-3 w-16 ml-auto rounded bg-gray-700"></div>
        </div>
    </div>
);


const RankingPage: React.FC = () => {
    const { user } = useAuth();
    const [sortBy, setSortBy] = useState<AthleteSortKey>('sai_score');
    const [activeFilter, setActiveFilter] = useState('All');
    const [districtFilter, setDistrictFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<ActiveTab>('athletes');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.sport) {
            setActiveFilter(user.sport);
        }
    }, [user?.sport]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, [activeTab, activeFilter, districtFilter, searchQuery]);

    const filteredAndSortedAthletes = useMemo(() => {
        const filteredBySport = activeFilter === 'All'
            ? ATHLETES_DATA
            : ATHLETES_DATA.filter(athlete => athlete.sport === activeFilter);
        
        const filteredByDistrict = districtFilter === 'All'
            ? filteredBySport
            : filteredBySport.filter(athlete => athlete.district === districtFilter);

        const filteredByName = filteredByDistrict.filter(athlete =>
            athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        return [...filteredByName].sort((a, b) => {
            if (sortBy === 'rank') {
                return (a.rank ?? 999) - (b.rank ?? 999);
            }
            return calculateSaiScore(b) - calculateSaiScore(a);
        });
    }, [sortBy, activeFilter, searchQuery, districtFilter]);

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-400';
        if (rank === 2) return 'text-gray-300';
        if (rank === 3) return 'text-yellow-600';
        return 'text-gray-500';
    }

    return (
        <Layout title="Leaderboard" showBackButton>
             <div className="bg-[#1A2E29] rounded-lg p-1 flex mb-6">
                <button onClick={() => setActiveTab('athletes')} className={`w-1/3 py-2.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'athletes' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'text-gray-300'}`}>
                    Top Athletes
                </button>
                <button onClick={() => setActiveTab('teams')} className={`w-1/3 py-2.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'teams' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'text-gray-300'}`}>
                    Top Teams
                </button>
                 <button onClick={() => setActiveTab('mentors')} className={`w-1/3 py-2.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'mentors' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'text-gray-300'}`}>
                    Top Mentors
                </button>
            </div>
            
            {activeTab === 'athletes' ? (
                <>
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <input type="text" placeholder="Search for an athlete..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                        <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg appearance-none text-sm">
                            <option value="All">All Districts</option>
                            {indianDistricts.map(district => (<option key={district} value={district}>{district}</option>))}
                        </select>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4">
                        {sports.map(sport => (
                            <button key={sport} onClick={() => setActiveFilter(sport)} className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${activeFilter === sport ? 'bg-emerald-500' : 'bg-[#0D1A18]'}`}>
                                {sport}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            [...Array(5)].map((_, i) => <AthleteRankSkeleton key={i} />)
                        ) : (
                            filteredAndSortedAthletes.map((athlete, index) => (
                                <div key={athlete.id} className="flex items-center bg-[#0E1B17] p-3 rounded-xl ring-1 ring-white/10">
                                    <div className="flex items-center justify-center w-10">
                                        <TrophyIcon className={getRankColor(index + 1)} />
                                        <span className={`font-bold text-lg ml-1 ${getRankColor(index + 1)}`}>{index + 1}</span>
                                    </div>
                                    <img src={athlete.avatarUrl} alt={athlete.name} className="w-12 h-12 rounded-full mx-4 border-2 border-gray-700"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-white">{athlete.name}</p>
                                        <p className="text-xs text-emerald-400">{athlete.sport}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-white">{calculateSaiScore(athlete).toFixed(0)}</p>
                                        <p className="text-xs text-gray-400">SAI Score</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : activeTab === 'teams' ? (
                <TeamLeaderboard />
            ) : (
                <MentorLeaderboard />
            )}
        </Layout>
    );
};

export default RankingPage;