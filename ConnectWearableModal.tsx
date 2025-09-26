import React, { useState, useEffect } from 'react';
import { XIcon, CheckCircleIcon } from './Icons';

interface ConnectWearableModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const mockDevices = [
    { id: '1', name: 'Khelscout Band' },
    { id: '2', name: 'Fitbit Charge 5' },
    { id: '3', name: 'Garmin Forerunner' },
];

const ConnectWearableModal: React.FC<ConnectWearableModalProps> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'found' | 'connecting' | 'connected'>('idle');
    const [connectedDevice, setConnectedDevice] = useState<string | null>(localStorage.getItem('wearableDeviceName'));

    useEffect(() => {
        if (isOpen) {
            const deviceName = localStorage.getItem('wearableDeviceName');
            if (deviceName) {
                setConnectedDevice(deviceName);
                setStatus('connected');
            } else {
                setStatus('idle');
                setConnectedDevice(null);
            }
        }
    }, [isOpen]);

    const handleScan = () => {
        setStatus('scanning');
        setTimeout(() => {
            setStatus('found');
        }, 2000);
    };
    
    const handleConnect = (deviceName: string) => {
        setStatus('connecting');
        setTimeout(() => {
            localStorage.setItem('wearableConnected', 'true');
            localStorage.setItem('wearableDeviceName', deviceName);
            setConnectedDevice(deviceName);
            setStatus('connected');
        }, 1500);
    };
    
    const handleDisconnect = () => {
        localStorage.removeItem('wearableConnected');
        localStorage.removeItem('wearableDeviceName');
        setConnectedDevice(null);
        setStatus('idle');
    }

    if (!isOpen) return null;

    const renderContent = () => {
        switch(status) {
            case 'scanning':
                return (
                    <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-emerald-400 mx-auto"></div>
                        <p className="mt-4 text-gray-300">Scanning for nearby devices...</p>
                    </div>
                );
            case 'found':
                return (
                    <div className="space-y-3">
                        <h3 className="font-semibold">Devices Found</h3>
                        {mockDevices.map(device => (
                            <button key={device.id} onClick={() => handleConnect(device.name)} className="w-full bg-[#0D1A18] p-3 rounded-lg text-left hover:bg-gray-800">
                                {device.name}
                            </button>
                        ))}
                    </div>
                );
            case 'connecting':
                 return (
                    <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-emerald-400 mx-auto"></div>
                        <p className="mt-4 text-gray-300">Connecting...</p>
                    </div>
                );
            case 'connected':
                return (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto" />
                        <p className="mt-4 font-semibold text-lg">Successfully Connected</p>
                        <p className="text-gray-400 text-sm">Your <span className="font-bold text-white">{connectedDevice}</span> is now paired.</p>
                        <button onClick={handleDisconnect} className="mt-6 text-sm text-red-400 underline">Disconnect</button>
                    </div>
                );
            case 'idle':
            default:
                return (
                     <div className="text-center py-8">
                        <h3 className="font-semibold text-lg mb-2">Pair a New Device</h3>
                        <p className="text-gray-400 text-sm mb-6">Connect a smart wearable to track heart rate during assessments.</p>
                        <button onClick={handleScan} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl">
                            Scan for Devices
                        </button>
                    </div>
                );
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1A2E29] w-full max-w-sm rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Connect Wearable</h2>
                    <button onClick={onClose} className="p-2 -mr-2"><XIcon /></button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};
export default ConnectWearableModal;