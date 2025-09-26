import React, { useState, useEffect } from 'react';
import { XIcon, SparklesIcon } from './Icons';
import { generateAthleteReport } from './geminiService';

interface AiMentorReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    athleteName: string;
}

interface Report {
    strengths: string;
    weaknesses: string;
    suggestions: string[];
}

const AiMentorReportModal: React.FC<AiMentorReportModalProps> = ({ isOpen, onClose, athleteName }) => {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<Report | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && athleteName) {
            const fetchReport = async () => {
                setLoading(true);
                setReport(null);
                setError(null);
                try {
                    const generatedReport = await generateAthleteReport(athleteName);
                    if (generatedReport) {
                        setReport(generatedReport);
                    } else {
                        throw new Error("Received an empty report.");
                    }
                } catch (e) {
                    console.error(e);
                    setError("Failed to generate AI report. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };
            fetchReport();
        }
    }, [isOpen, athleteName]);


    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-[#1A2E29] w-full max-w-md rounded-2xl p-6 text-white transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                         <SparklesIcon />
                         <h2 className="text-xl font-bold">AI Performance Report</h2>
                    </div>
                    <button onClick={onClose} className="p-2 -mr-2">
                        <XIcon />
                    </button>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">
                    AI-generated analysis for <span className="font-bold text-white">{athleteName}</span>.
                </p>

                {loading && (
                    <div className="text-center py-10">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-emerald-400 mx-auto"></div>
                        <p className="mt-4 text-gray-300">Generating insights with Gemini...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-10">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {report && !loading && (
                    <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto">
                        <div>
                            <h3 className="font-bold text-emerald-400 mb-2">Strengths</h3>
                            <p className="text-gray-300 leading-relaxed">{report.strengths}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-400 mb-2">Areas for Improvement</h3>
                            <p className="text-gray-300 leading-relaxed">{report.weaknesses}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-400 mb-2">Suggested Drills</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                {report.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiMentorReportModal;
