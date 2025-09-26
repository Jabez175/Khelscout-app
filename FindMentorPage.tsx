import React, { useState, useMemo, useEffect } from 'react';
import Layout from './Layout';
import { StarIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';
import { MENTORS_DATA, indianDistricts } from './constants';
import { User } from './types';

type MentorSortKey = 'rating' | 'experienceYears' | 'athletesTrained';
const mentorSports = ['All', ...Array.from(new Set(MENTORS_DATA.map(m => m.sport)))];

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

const FindMentorPage: React.FC = () => {
    const [sportFilter, setSportFilter] = useState('All');
    const [districtFilter, setDistrictFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: MentorSortKey; order: 'asc' | 'desc' }>({ key: 'rating', order: 'desc' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1500); // Simulate network delay
        return () => clearTimeout(timer);
    }, [sportFilter, districtFilter, sortConfig]);

    const filteredMentors = useMemo(() => {
        return MENTORS_DATA
            .filter(m => sportFilter === 'All' || m.sport === sportFilter)
            .filter(m => districtFilter === 'All' || m.district === districtFilter);
    }, [sportFilter, districtFilter]);

    const sortedMentors = useMemo(() => {
        return [...filteredMentors].sort((a, b) => {
            const aVal = a[sortConfig.key] || 0;
            const bVal = b[sortConfig.key] || 0;
            if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredMentors, sortConfig]);

    const handleRequestTraining = (mentorName: string) => {
        alert(`Training request sent to ${mentorName}!`);
    };

    const handleSort = (key: MentorSortKey) => {
        setSortConfig(currentConfig => {
            if (currentConfig.key === key) {
                return { key, order: currentConfig.order === 'asc' ? 'desc' : 'asc' };
            }
            // All mentor stats are "higher is better", so default to descending
            return { key, order: 'desc' };
        });
    };

    const SortButton: React.FC<{ sortKey: MentorSortKey; label: string }> = ({ sortKey, label }) => {
        const isActive = sortConfig.key === sortKey;
        return (
            <button onClick={() => handleSort(sortKey)} className={`px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'bg-[#1A2E29] text-gray-300'}`}>
                {label}
                {isActive && (sortConfig.order === 'desc' ? <ArrowDownIcon className="w-3 h-3" /> : <ArrowUpIcon className="w-3 h-3" />)}
            </button>
        );
    };

    return (
        <Layout title="Find a Mentor" showBackButton>
            <div className="space-y-4">
                <p className="text-center text-gray-400 text-sm">Browse the leaderboard to find and request training from top-rated mentors.</p>
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
                                    <img src={mentor.avatarUrl} alt={mentor.name} className="w-12 h-12 rounded-full" />
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
        </Layout>
    );
};

export default FindMentorPage;