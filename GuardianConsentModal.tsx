import React, { useState } from 'react';
import { XIcon } from './Icons';

interface GuardianConsentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const GuardianConsentModal: React.FC<GuardianConsentModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [otp, setOtp] = useState('');
    const [signature, setSignature] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Mock validation
        if (otp === '123456' && signature.trim() !== '') {
            onConfirm();
        } else {
            setError("Invalid OTP or signature. (Hint: OTP is 123456)");
        }
    };
    
    return (
         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A2E29] w-full max-w-sm rounded-2xl p-6 text-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold">Guardian Consent</h2>
                     <button onClick={onClose} className="p-2 -mr-2 text-gray-400"><XIcon /></button>
                </div>
                <p className="text-gray-400 text-sm mb-6">As the athlete is under 18, guardian consent is required. Please complete the fields below to continue.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Guardian's Mobile OTP</label>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code sent to guardian" className="w-full px-4 py-3 bg-[#0D1A18] border border-gray-700 rounded-xl" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Guardian's Digital Signature</label>
                        <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Type full name to sign" className="w-full px-4 py-3 bg-[#0D1A18] border border-gray-700 rounded-xl" required />
                    </div>
                     {error && <p className="text-red-500 text-sm pt-1 text-center">{error}</p>}
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl">Confirm Consent</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GuardianConsentModal;