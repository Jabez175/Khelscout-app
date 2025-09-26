import React, { useState, useEffect, useMemo } from 'react';
import Layout from './Layout';
import type { Event } from './types';
import { indianDistricts } from './constants';
import { useAuth } from './AuthContext';
import { useEvents } from './EventContext';
import { MapIcon, CalendarIcon, UserIcon, XIcon, SearchIcon, ChevronDownIcon, CheckCircleIcon } from './Icons';
import { useNavigate } from 'react-router-dom';

const fetchEvents = async (): Promise<Event[]> => {
    // TODO: Replace with actual API call to GET /api/events
    const allEvents: Event[] = [
        { id: '1', title: 'Youth Basketball Tournament', sport: 'Basketball', date: 'June 15, 2024', time: '9:00 AM - 5:00 PM', imageUrl: 'https://picsum.photos/seed/bball/400/200', district: 'Mumbai', location: 'Andheri Sports Complex, Mumbai', organizedBy: 'Mumbai Basketball Association', isGovernment: false, description: 'An open tournament for under-18 basketball players. Showcase your skills and compete with the best.', contact: 'contact@mba.org' },
        { id: '2', title: 'Junior Tennis Open', sport: 'Tennis', date: 'August 5, 2024', time: '8:00 AM - 6:00 PM', imageUrl: 'https://picsum.photos/seed/tennis/400/200', district: 'Delhi', location: 'R.K. Khanna Tennis Complex, Delhi', organizedBy: 'All India Tennis Association', isGovernment: true, description: 'A national level junior tennis tournament. AITA ranking points are available.', contact: 'juniors@aita.com' },
        { id: '3', title: 'Regional Soccer Championship', sport: 'Soccer', date: 'July 20, 2024', time: '10:00 AM - 4:00 PM', imageUrl: 'https://picsum.photos/seed/soccer/400/200', district: 'Bangalore', location: 'Bangalore Football Stadium', organizedBy: 'Karnataka State Football Association', isGovernment: true, description: 'The premier regional soccer championship for clubs in Karnataka. Winners will advance to the national league.', contact: 'info@ksfa.com' },
    ];
    return new Promise(resolve => setTimeout(() => resolve(allEvents), 1000));
};

const sports = ['All', 'Basketball', 'Soccer', 'Tennis'];

const RegistrationModal: React.FC<{ event: Event | null; isOpen: boolean; onClose: () => void; onConfirm: (eventId: string) => void }> = ({ event, isOpen, onClose, onConfirm }) => {
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset success state when modal is closed/reopened
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => setIsSuccess(false), 300); // Delay to allow animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen || !event) return null;

    const handleConfirm = () => {
        onConfirm(event.id);
        setIsSuccess(true);
    };

    const handleViewRegistrations = () => {
        onClose();
        navigate('/my-registrations');
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-end" onClick={onClose}>
            <div className="bg-[#0E1B17]/80 backdrop-blur-xl ring-1 ring-white/10 w-full max-w-md mx-auto rounded-t-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                {isSuccess ? (
                    <div className="text-center animate-fade-in">
                        <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold">Registration Successful!</h2>
                        <p className="text-sm text-gray-300 mt-2">You are now registered for <span className="font-semibold text-white">{event.title}</span>.</p>
                        <div className="flex gap-4 mt-6">
                            <button onClick={onClose} className="w-1/2 bg-[#050e0c] text-white font-bold py-3 rounded-lg ring-1 ring-white/10 hover:bg-gray-800 transition-colors">
                                Done
                            </button>
                             <button onClick={handleViewRegistrations} className="w-1/2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                View Registrations
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Confirm Registration</h2>
                            <button onClick={onClose} className="p-2 -mr-2"><XIcon /></button>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                            <h3 className="font-bold text-lg text-emerald-400">{event.title}</h3>
                            <p className="text-sm text-gray-300 mt-2">{event.description}</p>
                            <div className="mt-4 space-y-2 text-sm">
                                <p className="flex items-center gap-2 text-gray-300"><CalendarIcon /> {event.date} at {event.time}</p>
                                <p className="flex items-center gap-2 text-gray-300"><MapIcon /> {event.location}, {event.district}</p>
                                <p className="flex items-center gap-2 text-gray-300"><UserIcon /> Organized by: {event.organizedBy} {event.isGovernment && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">Govt.</span>}</p>
                            </div>
                        </div>
                        <button onClick={handleConfirm} className="w-full mt-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                            Confirm Registration
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};


const EventCard: React.FC<{ event: Event; onRegisterClick: (event: Event) => void }> = ({ event, onRegisterClick }) => {
    const { isRegistered } = useEvents();
    const registered = isRegistered(event.id);
    const navigate = useNavigate();

    return (
        <div className="bg-[#0E1B17] rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10">
            <img src={event.imageUrl} alt={event.title} className="w-full h-32 object-cover" />
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{event.sport}</span>
                    <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-1 rounded-full">{event.district}</span>
                </div>
                <h3 className="font-bold text-lg mt-2">{event.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{event.date} • {event.time}</p>
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="w-1/2 bg-[#050e0c] text-white font-bold py-2.5 rounded-lg ring-1 ring-white/10 hover:bg-gray-800 transition-colors"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => !registered && onRegisterClick(event)}
                        disabled={registered}
                        className="w-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                    >
                        {registered ? 'Registered' : 'Register Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventCardSkeleton: React.FC = () => (
    <div className="bg-[#0E1B17] rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10 shimmer-bg">
        <div className="w-full h-32 bg-gray-700"></div>
        <div className="p-4">
            <div className="flex justify-between items-center">
                <div className="h-5 w-1/4 rounded-full bg-gray-700"></div>
                <div className="h-5 w-1/4 rounded-full bg-gray-700"></div>
            </div>
            <div className="h-6 w-3/4 rounded bg-gray-700 mt-3"></div>
            <div className="h-4 w-1/2 rounded bg-gray-700 mt-2"></div>
            <div className="flex gap-2 mt-4">
                <div className="w-1/2 h-10 rounded-lg bg-gray-700"></div>
                <div className="w-1/2 h-10 rounded-lg bg-gray-700"></div>
            </div>
        </div>
    </div>
);

const EventsPage: React.FC = () => {
    const { user } = useAuth();
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [districtFilter, setDistrictFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { registerForEvent } = useEvents();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleRegisterClick = (event: Event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };


    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const eventsData = await fetchEvents();
                setAllEvents(eventsData);
            } catch (err) {
                setError('Failed to load events.');
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    useEffect(() => {
        if (user?.sport) {
            setActiveFilter(user.sport);
        }
    }, [user?.sport]);

    const filteredEvents = useMemo(() => {
        return allEvents
            .filter(event => activeFilter === 'All' || event.sport === activeFilter)
            .filter(event => districtFilter === 'All' || event.district === districtFilter)
            .filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [allEvents, activeFilter, searchQuery, districtFilter]);

    return (
        <Layout title="Events" showBackButton>
            <div className="bg-[#1A2E29] p-4 rounded-2xl mb-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Filter & Search</h3>
                <div>
                    <label htmlFor="search-events" className="sr-only">Search Events</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <SearchIcon />
                        </span>
                        <input
                            id="search-events"
                            type="text"
                            placeholder="Search events by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#0E1B17] ring-1 ring-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="district-filter" className="block text-sm font-medium text-gray-400 mb-1">District</label>
                    <div className="relative">
                        <select
                            id="district-filter"
                            value={districtFilter}
                            onChange={(e) => setDistrictFilter(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-[#0E1B17] ring-1 ring-white/10 rounded-xl appearance-none text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="All">All Districts</option>
                            {indianDistricts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Sport</label>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {sports.map(sport => (
                            <button
                                key={sport}
                                onClick={() => setActiveFilter(sport)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter === sport ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'bg-[#0E1B17] ring-1 ring-white/10'}`}
                            >
                                {sport}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading && (
                 <div className="space-y-6">
                    {[...Array(3)].map((_, i) => <EventCardSkeleton key={i} />)}
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && !error && (
                 <div className="space-y-6">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => <EventCard key={event.id} event={event} onRegisterClick={handleRegisterClick} />)
                    ) : (
                        <div className="text-center py-10">
                            <h3 className="font-semibold text-lg mb-2">No Events Found</h3>
                            <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            )}
            <RegistrationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={selectedEvent}
                onConfirm={registerForEvent}
            />
        </Layout>
    );
};

export default EventsPage;