import React, { useState } from 'react';
import { XIcon } from './Icons';

interface VideoSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Quality = 'Low' | 'Medium' | 'High';

const VideoSettingsModal: React.FC<VideoSettingsModalProps> = ({ isOpen, onClose }) => {
    const [quality, setQuality] = useState<Quality>('Medium');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1A2E29] w-full max-w-sm rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Video Settings</h2>
                    <button onClick={onClose} className="p-2 -mr-2"><XIcon /></button>
                </div>
                <p className="text-sm text-gray-400">Choose a video quality to balance upload speed and clarity. Lower quality is recommended for slow connections.</p>
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Upload Quality</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['Low', 'Medium', 'High'] as Quality[]).map(q => (
                            <button key={q} type="button" onClick={() => setQuality(q)} className={`px-2 py-2 rounded-lg text-xs font-semibold ${quality === q ? 'bg-emerald-500 text-white' : 'bg-[#0D1A18]'}`}>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
                 <button onClick={onClose} className="w-full mt-4 bg-emerald-500 text-white font-bold py-2.5 rounded-lg">
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default VideoSettingsModal;
