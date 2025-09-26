import React, { useState } from 'react';
import Layout from './Layout';
import { generateCareerAdvice } from './geminiService';
import { SparklesIcon, BriefcaseIcon, SchoolIcon } from './Icons';

interface Advice {
    suggestedSports: string[];
    potentialPathways: string[];
    scholarships: string[];
}

const CareerAdvisorPage: React.FC = () => {
    const [strengths, setStrengths] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [advice, setAdvice] = useState<Advice | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setAdvice(null);
        try {
            const result = await generateCareerAdvice(strengths);
            setAdvice(result);
        } catch (err: any) {
            setError(err.message || "Failed to get career advice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="AI Career Advisor" showBackButton>
            <div className="space-y-6">
                <div className="bg-[#1A2E29] p-4 rounded-2xl">
                    <h2 className="text-xl font-bold mb-1">Discover Your Path</h2>
                    <p className="text-sm text-gray-400 mb-4">Enter your key strengths (e.g., "explosive power, quick reflexes") to get AI-powered career guidance.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={strengths}
                            onChange={(e) => setStrengths(e.target.value)}
                            placeholder="e.g., explosive power, quick reflexes, high endurance"
                            rows={3}
                            className="w-full px-4 py-3 bg-[#0D1A18] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white resize-none"
                        ></textarea>
                        <button type="submit" disabled={loading || !strengths} className="w-full flex items-center justify-center gap-2 bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50">
                            {loading ? 'Analyzing...' : 'Get Advice'}
                        </button>
                    </form>
                </div>

                {loading && (
                    <div className="text-center p-8 bg-[#1A2E29] rounded-2xl">
                         <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-emerald-400 mx-auto"></div>
                         <p className="mt-4 text-gray-300">Generating your career advice...</p>
                    </div>
                )}
                 {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-xl">{error}</p>}
                
                {advice && (
                    <div className="space-y-4">
                        <div className="bg-[#1A2E29] p-4 rounded-2xl">
                             <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><SparklesIcon /> Suggested Sports</h3>
                            <div className="flex flex-wrap gap-2">
                                {advice.suggestedSports.map(sport => <span key={sport} className="text-sm bg-gray-700 px-3 py-1 rounded-full">{sport}</span>)}
                            </div>
                        </div>
                        <div className="bg-[#1A2E29] p-4 rounded-2xl">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><BriefcaseIcon /> Potential Pathways</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">{advice.potentialPathways.map(p => <li key={p}>{p}</li>)}</ul>
                        </div>
                         <div className="bg-[#1A2E29] p-4 rounded-2xl">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><SchoolIcon /> Scholarships & Schemes</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">{advice.scholarships.map(s => <li key={s}>{s}</li>)}</ul>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
export default CareerAdvisorPage;
