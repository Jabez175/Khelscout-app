
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ShortlistEntry, AthleteStatus } from './types';

interface ShortlistContextType {
    shortlistedEntries: ShortlistEntry[];
    toggleShortlistAthlete: (athleteId: string) => void;
    updateShortlistEntry: (athleteId: string, updates: Partial<Omit<ShortlistEntry, 'athleteId'>>) => void;
    isShortlisted: (athleteId: string) => boolean;
}

const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined);

export const ShortlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [shortlistedEntries, setShortlistedEntries] = useState<ShortlistEntry[]>(() => {
        const saved = localStorage.getItem('shortlistedAthletes');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('shortlistedAthletes', JSON.stringify(shortlistedEntries));
    }, [shortlistedEntries]);

    const toggleShortlistAthlete = (athleteId: string) => {
        setShortlistedEntries(prev => {
            const exists = prev.some(entry => entry.athleteId === athleteId);
            if (exists) {
                return prev.filter(entry => entry.athleteId !== athleteId); // Remove from shortlist
            } else {
                // Add to shortlist with default status
                return [...prev, { athleteId, status: AthleteStatus.SHORTLISTED, notes: '' }];
            }
        });
    };

    const updateShortlistEntry = (athleteId: string, updates: Partial<Omit<ShortlistEntry, 'athleteId'>>) => {
        setShortlistedEntries(prev => 
            prev.map(entry => 
                entry.athleteId === athleteId ? { ...entry, ...updates } : entry
            )
        );
    };

    const isShortlisted = (athleteId: string) => {
        return shortlistedEntries.some(entry => entry.athleteId === athleteId);
    };

    return (
        <ShortlistContext.Provider value={{ shortlistedEntries, toggleShortlistAthlete, isShortlisted, updateShortlistEntry }}>
            {children}
        </ShortlistContext.Provider>
    );
};

export const useShortlist = () => {
    const context = useContext(ShortlistContext);
    if (context === undefined) {
        throw new Error('useShortlist must be used within a ShortlistProvider');
    }
    return context;
};