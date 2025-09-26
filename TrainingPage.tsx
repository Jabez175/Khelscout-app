import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Workout } from './types';
import { PlayIcon } from './Icons';
import Layout from './Layout';
import { useAuth } from './AuthContext';

const fetchWorkouts = async (): Promise<Workout[]> => {
    // TODO: Replace with actual API call to GET /api/workouts/suggested
    const workoutsData: Workout[] = [
        { id: '1', title: 'Strength Training for Basketball', sport: 'Basketball', description: 'Improve your shooting accuracy and court agility with this workout.', exercises: 5, imageUrl: 'https://picsum.photos/seed/bballtrain/400/200' },
        { id: '2', title: 'Agility Drills for Soccer', sport: 'Soccer', description: 'Enhance your speed and agility on the field with these drills.', exercises: 4, imageUrl: 'https://picsum.photos/seed/soccertrain/400/200' },
        { id: '3', title: 'Endurance Training for Running', sport: 'Running', description: 'Build your stamina and improve long-distance running.', exercises: 6, imageUrl: 'https://picsum.photos/seed/runtrain/400/200' },
        { id: '4', title: 'Cricket Fielding Drills', sport: 'Cricket', description: 'Improve your reflexes and catching skills.', exercises: 7, imageUrl: 'https://picsum.photos/seed/crickettrain/400/200' },
        { id: '5', title: 'Tennis Serve Practice', sport: 'Tennis', description: 'Develop a more powerful and accurate serve.', exercises: 3, imageUrl: 'https://picsum.photos/seed/tennistrain/400/200' },
    ];
    return new Promise(resolve => setTimeout(() => resolve(workoutsData), 1000));
};

const WorkoutCard: React.FC<{ workout: Workout }> = ({ workout }) => {
    return (
        <div className="relative bg-[#1A2E29] rounded-2xl overflow-hidden shadow-lg p-4">
            <img src={workout.imageUrl} alt={workout.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex-grow">
                    <span className="text-xs bg-gray-900/50 text-gray-300 px-2 py-1 rounded-full">{workout.exercises} exercises</span>
                    <h3 className="font-bold text-xl mt-2 text-white">{workout.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{workout.description}</p>
                </div>
                <Link
                    to={`/workout/${workout.id}`}
                    className="w-full mt-4 bg-emerald-500 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
                >
                    <PlayIcon /> Start Workout
                </Link>
            </div>
        </div>
    );
};

const TrainingPage: React.FC = () => {
    const { user } = useAuth();
    const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWorkouts = async () => {
            try {
                setLoading(true);
                const data = await fetchWorkouts();
                setAllWorkouts(data);
            } catch (err) {
                setError('Failed to load workouts.');
            } finally {
                setLoading(false);
            }
        };
        loadWorkouts();
    }, []);

    const filteredWorkouts = useMemo(() => {
        if (!user?.sport) return allWorkouts;
        return allWorkouts.filter(w => w.sport === user.sport);
    }, [allWorkouts, user?.sport]);

     return (
        <Layout title="AI Training">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Suggested for {user?.sport}</h2>
                {loading && <p>Loading workouts...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && filteredWorkouts.map(workout => (
                    <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </div>
        </Layout>
    );
}

export default TrainingPage;