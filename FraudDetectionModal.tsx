import React from 'react';
import { XIcon, ShieldCheckIcon, WarningTriangleIcon } from './Icons';

interface FraudDetectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysis: any | null;
}

const FraudDetectionModal: React.FC<FraudDetectionModalProps> = ({ isOpen, onClose, analysis }) => {
    if (!isOpen || !analysis) return null;

    const isVerified = analysis.verificationStatus === 'Verified';
    const scoreColor = isVerified ? 'bg-emerald-500' : 'bg-red-500';
    const scoreText = isVerified ? 'Green' : 'Red';
    const scoreIcon = isVerified ? <ShieldCheckIcon /> : <WarningTriangleIcon />;
    
    return (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1A2E29] w-full max-w-sm rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Integrity Score</h2>
                    <button onClick={onClose} className="p-2 -mr-2"><XIcon /></button>
                </div>
                 <div className="text-center">
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white ${scoreColor}`}>
                        {scoreIcon}
                    </div>
                    <p className={`mt-4 text-2xl font-bold ${isVerified ? 'text-emerald-400' : 'text-red-400'}`}>
                        {scoreText}
                    </p>
                    <p className="text-sm text-gray-300">({analysis.verificationStatus})</p>
                </div>
                <div className="text-center bg-[#0D1A18] p-3 rounded-lg">
                    <h4 className="font-semibold mb-1">AI Reasoning</h4>
                    <p className="text-xs text-gray-400">{isVerified ? "All integrity checks passed." : analysis.reasoning}</p>
                </div>
                <button onClick={onClose} className="w-full mt-4 bg-emerald-500 text-white font-bold py-2.5 rounded-lg">
                    View Full Report
                </button>
            </div>
        </div>
    );
};

export default FraudDetectionModal;
