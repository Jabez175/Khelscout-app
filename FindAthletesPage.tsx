import React, { useState, useMemo, useEffect } from 'react';
import Layout from './Layout';
import { ATHLETES_DATA, indianDistricts } from './constants';
import { useShortlist } from './SponsorshipContext';
import { User, AthleteStatus } from './types';
import { ArrowUpIcon, ArrowDownIcon, ShieldCheckIcon } from './Icons';

const sports = ['All', ...Array.from(new Set(ATHLETES_DATA.map(a => a.sport)))];
const genders = ['All', 'Male', 'Female'];
type SortKey = 'rank' | 'name' | 'standingVerticalJump' | 'standingBroadJump' | 'shuttleRun4x10' | 'standingStart30m';


const AthleteCardSkeleton: React.FC = () => (
    <div className="bg-[#1A2E29] p-4 rounded-2xl text-center shimmer-bg">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gray-700"></div>
        <div className="h-5 w-3/4 mx-auto rounded bg-gray-700"></div>
        <div className="h-3 w-1/2 mx-auto rounded bg-gray-700 mt-2"></div>
        <div className="my-3 space-y-1">
            <div className="h-3 w-5/6 mx-auto rounded bg-gray-700"></div>
            <div className="h-3 w-5/6 mx-auto rounded bg-gray-700"></div>
        </div>
        <div className="w-full mt-3 h-10 rounded-lg bg-gray-700"></div>
    </div>
);

// Helper to determine if an athlete has all their scores verified
const areAllScoresVerified = (saiScores: User['saiScores']): boolean => {
    if (!saiScores) return false;
    const scoreEntries = Object.values(saiScores).filter(s => s !== undefined);
    if (scoreEntries.length === 0) return false;
    return scoreEntries.every(score => score.verified);
};


const FindAthletesPage: React.FC = () => {
    const { toggleShortlistAthlete, isShortlisted, shortlistedEntries } = useShortlist();
    const [sportFilter, setSportFilter] = useState('All');
    const [districtFilter, setDistrictFilter] = useState('All');
    const [genderFilter, setGenderFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: 'asc' | 'desc' }>({ key: 'rank', order: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1500); // Simulate network delay
        return () => clearTimeout(timer);
    }, [sportFilter, districtFilter, genderFilter, searchQuery, sortConfig, statusFilter]);


    const filteredAthletes = useMemo(() => {
        return ATHLETES_DATA
            .filter(a => sportFilter === 'All' || a.sport === sportFilter)
            .filter(a => districtFilter === 'All' || a.district === districtFilter)
            .filter(a => genderFilter === 'All' || a.gender === genderFilter)
            .filter(a => {
                if (statusFilter === 'All') {
                    return true;
                }
                const entry = shortlistedEntries.find(e => e.athleteId === a.id);
                if (!entry) {
                    return false; // Not shortlisted, so can't match a specific status
                }
                return entry.status === statusFilter;
            })
            .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [sportFilter, districtFilter, genderFilter, searchQuery, statusFilter, shortlistedEntries]);

    const sortedAthletes = useMemo(() => {
        return [...filteredAthletes].sort((a, b) => {
            const key = sortConfig.key;
            const order = sortConfig.order;

            const getVal = (athlete: User) => {
                switch(key) {
                    case 'name':
                        return athlete.name;
                    case 'rank':
                        return athlete.rank ?? 9999;
                    case 'standingVerticalJump':
                    case 'standingBroadJump':
                        // Higher is better, default to 0
                        return athlete.saiScores?.[key]?.score ?? 0;
                    case 'shuttleRun4x10':
                    case 'standingStart30m':
                        // Lower is better, default to a high number
                        return athlete.saiScores?.[key]?.score ?? 9999;
                    default:
                        return 0;
                }
            };

            const aVal = getVal(a);
            const bVal = getVal(b);

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;

            return 0;
        });
    }, [filteredAthletes, sortConfig]);

    const defaultSortOrders: Record<SortKey, 'asc' | 'desc'> = {
        rank: 'asc',
        name: 'asc',
        standingVerticalJump: 'desc',
        standingBroadJump: 'desc',
        shuttleRun4x10: 'asc',
        standingStart30m: 'asc',
    };

    const handleSort = (key: SortKey) => {
        setSortConfig(currentConfig => {
            // If it's the same key, toggle the order.
            if (currentConfig.key === key) {
                return { key, order: currentConfig.order === 'asc' ? 'desc' : 'asc' };
            }
            // If it's a new key, use its default order.
            return { key, order: defaultSortOrders[key] };
        });
    };

    const SortButton: React.FC<{ sortKey: SortKey; label: string }> = ({ sortKey, label }) => {
        const isActive = sortConfig.key === sortKey;
        return (
            <button 
                onClick={() => handleSort(sortKey)} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${isActive ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md' : 'bg-[#1A2E29] text-gray-300 hover:bg-gray-700/50'}`}
            >
                {label}
                {isActive && (sortConfig.order === 'desc' ? <ArrowDownIcon className="w-4 h-4" /> : <ArrowUpIcon className="w-4 h-4" />)}
            </button>
        );
    };


    return (
        <Layout title="SAI Scouting Dashboard" showSettingsButton>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <div className="grid grid-cols-2 gap-2">
                    <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg appearance-none text-sm">
                        {sports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg appearance-none text-sm">
                        <option value="All">All Districts</option>
                        {indianDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg appearance-none text-sm">
                        {genders.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                     <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg appearance-none text-sm">
                        <option value="All">All Statuses</option>
                        {Object.values(AthleteStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div className="bg-[#0E1B17] p-3 rounded-xl ring-1 ring-white/10">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-400">Sort by:</span>
                        <SortButton sortKey="rank" label="Rank" />
                        <SortButton sortKey="standingVerticalJump" label="Vert. Jump" />
                        <SortButton sortKey="standingBroadJump" label="Broad Jump" />
                        <SortButton sortKey="shuttleRun4x10" label="Shuttle Run" />
                        <SortButton sortKey="standingStart30m" label="30m Sprint" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {loading ? (
                        [...Array(6)].map((_, i) => <AthleteCardSkeleton key={i} />)
                    ) : sortedAthletes.length > 0 ? (
                        sortedAthletes.map((athlete: User) => {
                            const shortlisted = isShortlisted(athlete.id);
                            const isVerified = areAllScoresVerified(athlete.saiScores);
                            return (
                                <div key={athlete.id} className="bg-[#1A2E29] p-4 rounded-2xl text-center">
                                    <img src={athlete.avatarUrl} alt={athlete.name} className="w-20 h-20 rounded-full mx-auto mb-3" />
                                    <div className="flex items-center justify-center gap-1.5">
                                        <p className="font-bold truncate">{athlete.name}</p>
                                        {isVerified && <ShieldCheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                                    </div>
                                    <p className="text-xs text-gray-400">{athlete.sport} • {athlete.district}</p>
                                    <div className="text-xs my-2 space-y-1">
                                        <p>Vert. Jump: <span className="font-semibold text-emerald-400">{athlete.saiScores?.standingVerticalJump?.score || 'N/A'} cm</span></p>
                                        <p>Shuttle Run: <span className="font-semibold text-emerald-400">{athlete.saiScores?.shuttleRun4x10?.score || 'N/A'} s</span></p>
                                    </div>
                                    <button
                                        onClick={() => toggleShortlistAthlete(athlete.id)}
                                        className={`w-full mt-3 font-bold py-2 rounded-lg text-sm transition-colors ${shortlisted ? 'bg-gray-700 text-white' : 'bg-emerald-500 text-white'}`}
                                    >
                                        {shortlisted ? 'Shortlisted' : 'Shortlist'}
                                    </button>
                                </div>
                            )
                        })
                    ) : (
                        <p className="col-span-2 text-center text-gray-400 mt-8">No athletes found for the selected filters.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default FindAthletesPage;