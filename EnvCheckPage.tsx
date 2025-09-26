import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { CheckCircleIcon, SmartphoneIcon } from './Icons';

const EnvCheckPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { test } = location.state || {};
    const videoRef = useRef<HTMLVideoElement>(null);

    const [lightingOk, setLightingOk] = useState(false);
    const [framingOk, setFramingOk] = useState(false);
    const [faceScanOk, setFaceScanOk] = useState(false);
    const [allOk, setAllOk] = useState(false);

    useEffect(() => {
        const setupWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };
        setupWebcam();
        
        const t1 = setTimeout(() => setLightingOk(true), 1500);
        const t2 = setTimeout(() => setFaceScanOk(true), 3000);
        const t3 = setTimeout(() => setFramingOk(true), 4500);
        const t4 = setTimeout(() => setAllOk(true), 5000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
             if (videoRef.current && videoRef.current.srcObject) {
                 (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleNext = () => {
        navigate('/anti-replay', { state: { test } });
    };

    return (
        <Layout title="Environment Check" showBackButton>
            <div className="flex flex-col h-full items-center text-center">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mt-4">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                    <div className="absolute inset-0 border-4 border-dashed border-emerald-500/50 rounded-2xl"></div>
                </div>
                <h2 className="text-2xl font-bold mt-6">Identity & Environment Check</h2>
                <p className="text-gray-400 mt-2 mb-6">Position your face in the center, ensure good lighting, and that your full body is in frame.</p>
                
                 <div className="bg-[#1A2E29] p-4 rounded-2xl w-full space-y-3">
                    <p className={`flex items-center gap-2 ${lightingOk ? 'text-white' : 'text-gray-500'}`}><CheckCircleIcon className={lightingOk ? 'text-emerald-400' : 'text-gray-600'} /> Good Lighting</p>
                    <p className={`flex items-center gap-2 ${faceScanOk ? 'text-white' : 'text-gray-500'}`}><CheckCircleIcon className={faceScanOk ? 'text-emerald-400' : 'text-gray-600'} /> Face Scan Complete</p>
                    <p className={`flex items-center gap-2 ${framingOk ? 'text-white' : 'text-gray-500'}`}><CheckCircleIcon className={framingOk ? 'text-emerald-400' : 'text-gray-600'} /> Full Body in Frame</p>
                </div>

                 <div className="mt-8 w-full">
                    <button onClick={handleNext} disabled={!allOk} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl disabled:bg-gray-600">
                        {allOk ? 'Continue' : 'Checking...'}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default EnvCheckPage;