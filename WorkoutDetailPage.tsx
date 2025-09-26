import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';
import { DumbbellIcon, PlayIcon } from './Icons';

// --- Dummy Data & Mock API ---

interface Exercise {
    name: string;
    reps: string;
}

interface WorkoutDetail {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    exercises: Exercise[];
}

const workoutDetailsData: WorkoutDetail[] = [
    { 
        id: '1', 
        title: 'Strength Training for Basketball', 
        imageUrl: 'https://picsum.photos/seed/bballtrain/400/200',
        description: 'A comprehensive workout to build explosive power and core strength, essential for on-court performance.',
        exercises: [
            { name: 'Barbell Squats', reps: '3 sets of 8-10 reps' },
            { name: 'Deadlifts', reps: '3 sets of 5-8 reps' },
            { name: 'Bench Press', reps: '3 sets of 8-10 reps' },
            { name: 'Pull-ups', reps: '3 sets to failure' },
            { name: 'Plank', reps: '3 sets, 60s hold' },
        ]
    },
    { 
        id: '2', 
        title: 'Agility Drills for Soccer', 
        imageUrl: 'https://picsum.photos/seed/soccertrain/400/200',
        description: 'Improve your footwork, change of direction, and reaction time with these high-intensity agility drills.',
        exercises: [
            { name: 'Cone Weaving', reps: '5 sets' },
            { name: 'Agility Ladder Drills', reps: '10 minutes' },
            { name: 'Box Jumps', reps: '3 sets of 10 reps' },
            { name: 'Shuttle Runs', reps: '5 sets' },
        ]
    },
    { 
        id: '3', 
        title: 'Endurance Training for Running', 
        imageUrl: 'https://picsum.photos/seed/runtrain/400/200',
        description: 'Build your cardiovascular base and muscular endurance for longer, faster runs.',
        exercises: [
            { name: 'Long Slow Distance Run', reps: '45-60 minutes' },
            { name: 'Interval Sprints', reps: '8 x 400m' },
            { name: 'Hill Repeats', reps: '6 sets' },
            { name: 'Tempo Run', reps: '20 minutes' },
            { name: 'Walking Lunges', reps: '3 sets of 20 reps' },
            { name: 'Calf Raises', reps: '3 sets of 25 reps' },
        ]
    },
];

const fetchWorkoutById = async (id: string): Promise<WorkoutDetail | undefined> => {
    // TODO: Replace with GET /api/workouts/:id
    console.log(`Fetching workout ${id}`);
    const workout = workoutDetailsData.find(w => w.id === id);
    return new Promise(resolve => setTimeout(() => resolve(workout), 500));
}

const WorkoutDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("No workout ID provided.");
            setLoading(false);
            return;
        }

        const loadWorkout = async () => {
            try {
                setLoading(true);
                const data = await fetchWorkoutById(id);
                if (data) {
                    setWorkout(data);
                } else {
                    setError("Workout not found.");
                }
            } catch (err) {
                setError("Failed to load workout details.");
            } finally {
                setLoading(false);
            }
        };

        loadWorkout();
    }, [id]);

    if (loading) {
        return (
            <Layout title="Loading..." showBackButton>
                <p>Loading workout details...</p>
            </Layout>
        );
    }
    
    if (error || !workout) {
        return (
            <Layout title="Error" showBackButton>
                <p className="text-red-500">{error || 'Workout could not be loaded.'}</p>
            </Layout>
        );
    }

    return (
        <>
             <Layout title={workout.title} showBackButton>
                <div className="-mx-4 -mt-4">
                     <div className="relative h-48">
                        <img src={workout.imageUrl} alt={workout.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A18] to-transparent"></div>
                    </div>
                </div>

                <div className="px-1 pt-4">
                    <p className="text-gray-300 text-sm mb-4">{workout.description}</p>

                    <h2 className="text-xl font-bold mb-4">Exercises</h2>
                    <div className="space-y-3">
                        {workout.exercises.map((exercise, index) => (
                            <div key={index} className="flex items-center bg-[#1A2E29] p-3 rounded-lg">
                                <div className="bg-emerald-400/20 text-emerald-400 p-3 rounded-lg mr-4">
                                    <DumbbellIcon />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-white">{exercise.name}</p>
                                    <p className="text-sm text-gray-400">{exercise.reps}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
             <div className="p-4 bg-[#0D1A18] fixed bottom-20 w-full max-w-md mx-auto left-1/2 -translate-x-1/2">
                <button
                    onClick={() => navigate('/start-workout', { state: { workout } })}
                    className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
                >
                    <PlayIcon /> Begin Workout
                </button>
            </div>
        </>
    );
};

export default WorkoutDetailPage;