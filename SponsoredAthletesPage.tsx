

import React, { useState } from 'react';
import Layout from './Layout';
import { useShortlist } from './SponsorshipContext';
import { ATHLETES_DATA } from './constants';
import { ChevronRightIcon, CheckCircleIcon, SendIcon, SaveIcon } from './Icons';
import { AthleteStatus, ShortlistEntry } from './types';
import { useNavigate } from 'react-router-dom';

const ScoreRow: React.FC<{ label: string; data?: { score: number; unit: string; verified: boolean } }> = ({ label, data }) => (
    <div className="flex justify-between items-center bg-[#0D1A18] p-3 rounded-lg">
        <p>{label}</p>
        <div className="flex items-center gap-2">
            {data?.verified && <CheckCircleIcon />}
            <p className="font-bold text-lg">{data?.score || 'N/A'} <span className="text-xs text-gray-400">{data?.unit}</span></p>
        </div>
    </div>
);


const ShortlistedAthletesPage: React.FC = () => {
    const { shortlistedEntries, updateShortlistEntry } = useShortlist();
    const shortlistedAthletes = ATHLETES_DATA.filter(athlete => 
        shortlistedEntries.some(entry => entry.athleteId === athlete.id)
    );
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    const toggleExpand = (id: string) => {
        setExpandedId(prevId => {
            if (prevId === id) {
                return null;
            } else {
                // Pre-fill notes when expanding
                const entry = shortlistedEntries.find(e => e.athleteId === id);
                setNotes(prevNotes => ({ ...prevNotes, [id]: entry?.notes || '' }));
                return id;
            }
        });
    };

    const handleStatusChange = (athleteId: string, status: AthleteStatus) => {
        updateShortlistEntry(athleteId, { status });
    };

    const handleNotesChange = (athleteId: string, text: string) => {
        setNotes(prev => ({ ...prev, [athleteId]: text }));
    };
    
    const handleSaveNotes = (athleteId: string) => {
        updateShortlistEntry(athleteId, { notes: notes[athleteId] });
        // In a real app, show a toast notification for confirmation
    };

    const getEntryForAthlete = (athleteId: string): ShortlistEntry | undefined => {
        return shortlistedEntries.find(e => e.athleteId === athleteId);
    };

    return (
        <Layout title="Shortlisted Athletes" showSettingsButton>
            {shortlistedAthletes.length > 0 ? (
                <div className="space-y-4">
                    {shortlistedAthletes.map(athlete => {
                        const entry = getEntryForAthlete(athlete.id);
                        return (
                            <div key={athlete.id} className="bg-[#1A2E29] rounded-2xl overflow-hidden">
                                <div className="flex items-center p-4 cursor-pointer" onClick={() => toggleExpand(athlete.id)}>
                                    <img src={athlete.avatarUrl} alt={athlete.name} className="w-16 h-16 rounded-full border-2 border-gray-700" />
                                    <div className="ml-4 flex-grow">
                                        <h3 className="font-bold text-lg">{athlete.name}</h3>
                                        <p className="text-sm text-gray-400">{athlete.sport} • <span className="font-semibold text-emerald-400">{entry?.status || 'Shortlisted'}</span></p>
                                    </div>
                                    <ChevronRightIcon className={`transition-transform ${expandedId === athlete.id ? 'rotate-90' : ''}`} />
                                </div>
                                {expandedId === athlete.id && (
                                    <div className="px-4 pb-4 border-t border-gray-700 space-y-4">
                                        <div className="mt-4">
                                            <h4 className="text-md font-bold mb-2">Official Assessment</h4>
                                            <div className="space-y-2">
                                                <select
                                                    value={entry?.status || AthleteStatus.SHORTLISTED}
                                                    onChange={(e) => handleStatusChange(athlete.id, e.target.value as AthleteStatus)}
                                                    className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg appearance-none text-sm"
                                                >
                                                    {Object.values(AthleteStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <textarea 
                                                    placeholder="Add private notes for evaluation..." 
                                                    rows={3} 
                                                    className="w-full text-sm px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    value={notes[athlete.id] || ''}
                                                    onChange={(e) => handleNotesChange(athlete.id, e.target.value)}
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleSaveNotes(athlete.id)} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                                                        <SaveIcon /> Save
                                                    </button>
                                                    <button onClick={() => navigate(`/chat/${athlete.id}`)} className="flex-1 bg-sky-600 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                                                        <SendIcon /> Contact
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-md font-bold mb-2">Verified SAI Test Scores</h4>
                                            <div className="space-y-2 text-sm">
                                                <ScoreRow label="Vertical Jump" data={athlete.saiScores?.standingVerticalJump} />
                                                <ScoreRow label="4x10 Shuttle Run" data={athlete.saiScores?.shuttleRun4x10} />
                                                <ScoreRow label="Sit Ups (1 min)" data={athlete.saiScores?.sitUps} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="font-semibold text-lg mb-2">No Shortlisted Athletes</h3>
                    <p className="text-gray-400 text-sm">Use the 'Scouting Dashboard' to discover and shortlist talent.</p>
                </div>
            )}
        </Layout>
    );
};

export default ShortlistedAthletesPage;