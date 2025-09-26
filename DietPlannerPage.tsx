import React, { useState } from 'react';
import Layout from './Layout';
import { useAuth } from './AuthContext';
import { generateDietPlan } from './geminiService';
import type { MealPlan } from './types';
import { SparklesIcon } from './Icons';

type DietGoal = 'Weight Loss' | 'Weight Gain' | 'Maintenance';
type DietPref = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';

const MealCard: React.FC<{ title: string; meal: any }> = ({ title, meal }) => (
    <div className="bg-[#0D1A18] p-4 rounded-xl">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-lg text-emerald-400">{title}</h4>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{meal.calories} kcal</span>
        </div>
        <h5 className="font-semibold text-white mb-1">{meal.name}</h5>
        <p className="text-sm text-gray-400">{meal.description}</p>
    </div>
);

const DietPlannerPage: React.FC = () => {
    const { user } = useAuth();
    const [goal, setGoal] = useState<DietGoal>('Maintenance');
    const [diet, setDiet] = useState<DietPref>('Vegetarian');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [plan, setPlan] = useState<MealPlan | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPlan(null);
        try {
            const result = await generateDietPlan({ goal, diet, sport: user?.sport || 'General Athlete' });
            setPlan(result);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="AI Diet Planner" showBackButton>
            <div className="space-y-6">
                <div className="bg-[#1A2E29] p-4 rounded-2xl">
                    <h2 className="text-xl font-bold mb-1">Personalize Your Plan</h2>
                    <p className="text-sm text-gray-400 mb-4">Your plan will be tailored for a <span className="font-bold text-white">{user?.sport}</span> athlete. Select your goals to generate a one-day meal plan.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">Your Goal</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['Weight Loss', 'Maintenance', 'Weight Gain'] as DietGoal[]).map(g => (
                                    <button key={g} type="button" onClick={() => setGoal(g)} className={`px-2 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${goal === g ? 'bg-emerald-500 text-white' : 'bg-[#0D1A18]'}`}>
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">Dietary Preference</label>
                             <div className="grid grid-cols-3 gap-2">
                                {(['Vegetarian', 'Non-Vegetarian', 'Vegan'] as DietPref[]).map(d => (
                                    <button key={d} type="button" onClick={() => setDiet(d)} className={`px-2 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${diet === d ? 'bg-emerald-500 text-white' : 'bg-[#0D1A18]'}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50">
                            {loading ? 'Generating...' : 'Generate Plan'}
                        </button>
                    </form>
                </div>
                
                {loading && (
                    <div className="text-center p-8 bg-[#1A2E29] rounded-2xl">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-emerald-400 mx-auto"></div>
                        <p className="mt-4 text-gray-300">Generating your personalized diet plan...</p>
                    </div>
                )}
                
                {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-xl">{error}</p>}
                
                {plan && (
                    <div className="space-y-4">
                        <div className="bg-[#1A2E29] p-4 rounded-2xl text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <SparklesIcon />
                                <h3 className="text-xl font-bold">Your AI-Generated Plan</h3>
                            </div>
                            <p className="text-gray-300">Total Estimated Calories: <span className="font-bold text-emerald-400">{plan.totalCalories} kcal</span></p>
                        </div>
                        <MealCard title="Breakfast" meal={plan.breakfast} />
                        <MealCard title="Lunch" meal={plan.lunch} />
                        <MealCard title="Dinner" meal={plan.dinner} />
                        <MealCard title="Snacks" meal={plan.snacks} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DietPlannerPage;