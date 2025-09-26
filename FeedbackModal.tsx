import React, { useState } from 'react';
import { XIcon, CheckCircleIcon } from './Icons';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [feedbackType, setFeedbackType] = useState('General Feedback');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        // Mock API call
        console.log('Submitting feedback:', { type: feedbackType, message });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setIsSubmitted(true);

        // Close modal after a delay
        setTimeout(() => {
            onClose();
            // Reset state for next time
            setIsSubmitted(false);
            setMessage('');
            setFeedbackType('General Feedback');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1A2E29] w-full max-w-sm rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Submit Feedback</h2>
                    <button onClick={onClose} className="p-2 -mr-2"><XIcon /></button>
                </div>

                {isSubmitted ? (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto" />
                        <p className="mt-4 font-semibold text-lg">Thank you!</p>
                        <p className="text-gray-400 text-sm">Your feedback has been submitted.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm text-gray-400">We appreciate your input. Please let us know how we can improve.</p>
                        <div>
                            <label htmlFor="feedback-type" className="text-sm font-medium text-gray-300 mb-2 block">Feedback Type</label>
                            <select
                                id="feedback-type"
                                value={feedbackType}
                                onChange={(e) => setFeedbackType(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0D1A18] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none"
                            >
                                <option>General Feedback</option>
                                <option>Bug Report</option>
                                <option>Feature Request</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="feedback-message" className="text-sm font-medium text-gray-300 mb-2 block">Message</label>
                            <textarea
                                id="feedback-message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                placeholder="Please provide as much detail as possible..."
                                className="w-full px-4 py-3 bg-[#0D1A18] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white resize-none"
                                required
                            ></textarea>
                        </div>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2 bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 disabled:bg-gray-600"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;