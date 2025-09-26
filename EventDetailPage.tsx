import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { Event } from './types';
import { CalendarIcon, MapIcon, UserIcon, ClipboardListIcon } from './Icons';

// Mock API call - in a real app, this would fetch from a central store or API
const fetchAllEvents = async (): Promise<Event[]> => {
    const allEvents: Event[] = [
        { id: '1', title: 'Youth Basketball Tournament', sport: 'Basketball', date: 'June 15, 2024', time: '9:00 AM - 5:00 PM', imageUrl: 'https://picsum.photos/seed/bball/400/200', district: 'Mumbai', location: 'Andheri Sports Complex, Mumbai', organizedBy: 'Mumbai Basketball Association', isGovernment: false, description: 'An open tournament for under-18 basketball players. Showcase your skills and compete with the best.', contact: 'contact@mba.org' },
        { id: '2', title: 'Junior Tennis Open', sport: 'Tennis', date: 'August 5, 2024', time: '8:00 AM - 6:00 PM', imageUrl: 'https://picsum.photos/seed/tennis/400/200', district: 'Delhi', location: 'R.K. Khanna Tennis Complex, Delhi', organizedBy: 'All India Tennis Association', isGovernment: true, description: 'A national level junior tennis tournament. AITA ranking points are available.', contact: 'juniors@aita.com' },
        { id: '3', title: 'Regional Soccer Championship', sport: 'Soccer', date: 'July 20, 2024', time: '10:00 AM - 4:00 PM', imageUrl: 'https://picsum.photos/seed/soccer/400/200', district: 'Bangalore', location: 'Bangalore Football Stadium', organizedBy: 'Karnataka State Football Association', isGovernment: true, description: 'The premier regional soccer championship for clubs in Karnataka. Winners will advance to the national league.', contact: 'info@ksfa.com' },
    ];
    return new Promise(resolve => setTimeout(() => resolve(allEvents), 300));
};

const fetchEventById = async (id: string): Promise<Event | undefined> => {
    const events = await fetchAllEvents();
    return events.find(event => event.id === id);
};

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Event ID not provided.");
            setLoading(false);
            return;
        }

        const loadEvent = async () => {
            try {
                const eventData = await fetchEventById(id);
                if (eventData) {
                    setEvent(eventData);
                } else {
                    setError("Event not found.");
                }
            } catch (err) {
                setError("Failed to load event details.");
            } finally {
                setLoading(false);
            }
        };
        loadEvent();
    }, [id]);

    if (loading) {
        return <Layout title="Loading..." showBackButton><p>Loading event details...</p></Layout>;
    }

    if (error || !event) {
        return <Layout title="Error" showBackButton><p className="text-red-500">{error || 'Could not load event.'}</p></Layout>;
    }

    return (
        <>
            <Layout title={event.title} showBackButton>
                <div className="-mx-4 -mt-4">
                    <div className="relative h-48">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A18] to-transparent"></div>
                    </div>
                </div>
                
                <div className="px-1 pt-4 space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded-full">{event.sport}</span>
                        {event.isGovernment && <span className="text-sm bg-blue-900 text-blue-300 px-3 py-1 rounded-full">Government Affiliated</span>}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><ClipboardListIcon /> Details</h2>
                        <p className="text-gray-300 leading-relaxed">{event.description}</p>
                    </div>

                    <div className="bg-[#1A2E29] p-4 rounded-2xl space-y-3">
                        <div className="flex items-start gap-3">
                            <CalendarIcon />
                            <div>
                                <h3 className="font-semibold">Date & Time</h3>
                                <p className="text-gray-400">{event.date} at {event.time}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <MapIcon />
                            <div>
                                <h3 className="font-semibold">Location</h3>
                                <p className="text-gray-400">{event.location}, {event.district}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <UserIcon />
                            <div>
                                <h3 className="font-semibold">Organized By</h3>
                                <p className="text-gray-400">{event.organizedBy}</p>
                            </div>
                        </div>
                    </div>
                     {event.contact && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">Contact</h2>
                            <a href={`mailto:${event.contact}`} className="text-emerald-400 hover:underline">{event.contact}</a>
                        </div>
                    )}
                </div>
            </Layout>
            <div className="p-4 bg-[#0D1A18] fixed bottom-20 w-full max-w-md mx-auto left-1/2 -translate-x-1/2">
                <button
                    className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
                >
                    Register for Event
                </button>
            </div>
        </>
    );
};

export default EventDetailPage;