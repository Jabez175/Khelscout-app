import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import type { Event } from './types';
import { useEvents } from './EventContext';
import { MapIcon, CalendarIcon, UserIcon } from './Icons';
import { useNavigate } from 'react-router-dom';

// In a real app, you'd probably fetch events from a central store or API
// For now, we'll re-declare the fetch function here.
const fetchEvents = async (): Promise<Event[]> => {
    // This is duplicated from EventsPage, in a real app centralize this
    const allEvents: Event[] = [
        { id: '1', title: 'Youth Basketball Tournament', sport: 'Basketball', date: 'June 15, 2024', time: '9:00 AM - 5:00 PM', imageUrl: 'https://picsum.photos/seed/bball/400/200', district: 'Mumbai', location: 'Andheri Sports Complex, Mumbai', organizedBy: 'Mumbai Basketball Association', isGovernment: false, description: 'An open tournament for under-18 basketball players. Showcase your skills and compete with the best.', contact: 'contact@mba.org' },
        { id: '2', title: 'Junior Tennis Open', sport: 'Tennis', date: 'August 5, 2024', time: '8:00 AM - 6:00 PM', imageUrl: 'https://picsum.photos/seed/tennis/400/200', district: 'Delhi', location: 'R.K. Khanna Tennis Complex, Delhi', organizedBy: 'All India Tennis Association', isGovernment: true, description: 'A national level junior tennis tournament. AITA ranking points are available.', contact: 'juniors@aita.com' },
        { id: '3', title: 'Regional Soccer Championship', sport: 'Soccer', date: 'July 20, 2024', time: '10:00 AM - 4:00 PM', imageUrl: 'https://picsum.photos/seed/soccer/400/200', district: 'Bangalore', location: 'Bangalore Football Stadium', organizedBy: 'Karnataka State Football Association', isGovernment: true, description: 'The premier regional soccer championship for clubs in Karnataka. Winners will advance to the national league.', contact: 'info@ksfa.com' },
    ];
    return new Promise(resolve => setTimeout(() => resolve(allEvents), 500));
};


const RegistrationCard: React.FC<{ event: Event }> = ({ event }) => (
    <div className="bg-[#1A2E29] rounded-2xl overflow-hidden shadow-lg p-4 space-y-3">
        <div>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{event.sport}</span>
            <h3 className="font-bold text-xl mt-2 text-emerald-400">{event.title}</h3>
        </div>
        <div className="border-t border-gray-700 pt-3 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-gray-300"><CalendarIcon /> {event.date} at {event.time}</p>
            <p className="flex items-center gap-2 text-gray-300"><MapIcon /> {event.location}, {event.district}</p>
            <p className="flex items-center gap-2 text-gray-300"><UserIcon /> Organized by: {event.organizedBy} {event.isGovernment && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">Govt.</span>}</p>
        </div>
         <button className="w-full mt-2 bg-gray-700 text-white font-bold py-2.5 rounded-lg text-sm">
            View Details
        </button>
    </div>
);


const MyRegistrationsPage: React.FC = () => {
    const { registeredEventIds } = useEvents();
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadEvents = async () => {
            const eventsData = await fetchEvents();
            setAllEvents(eventsData);
            setLoading(false);
        };
        loadEvents();
    }, []);
    
    const myEvents = allEvents.filter(event => registeredEventIds.includes(event.id));

    return (
        <Layout title="My Registrations" showBackButton>
            {loading && <p>Loading registrations...</p>}
            {!loading && (
                myEvents.length > 0 ? (
                    <div className="space-y-6">
                        {myEvents.map(event => <RegistrationCard key={event.id} event={event} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 flex flex-col items-center">
                        <div className="text-emerald-400 bg-emerald-400/20 p-4 rounded-full inline-block mb-4">
                            <CalendarIcon />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No Registrations Yet</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">You haven't registered for any events. Explore upcoming competitions and sign up!</p>
                        <button
                            onClick={() => navigate('/events')}
                            className="bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                            Find Events
                        </button>
                    </div>
                )
            )}
        </Layout>
    );
};

export default MyRegistrationsPage;