import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface EventContextType {
    registeredEventIds: string[];
    registerForEvent: (eventId: string) => void;
    isRegistered: (eventId: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(() => {
        const saved = localStorage.getItem('registeredEvents');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEventIds));
    }, [registeredEventIds]);

    const registerForEvent = (eventId: string) => {
        setRegisteredEventIds(prev => [...new Set([...prev, eventId])]);
    };

    const isRegistered = (eventId: string) => {
        return registeredEventIds.includes(eventId);
    };

    return (
        <EventContext.Provider value={{ registeredEventIds, registerForEvent, isRegistered }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};