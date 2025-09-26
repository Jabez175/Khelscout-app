import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TimerIcon, XIcon, HeartbeatIcon, ShieldCheckIcon, CheckCircleIcon, TrendingUpIcon, WarningTriangleIcon } from './Icons';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

// Declare module-scoped variables to hold MediaPipe tasks.
// They will be initialized once the component mounts to prevent a race condition.
let PoseLandmarker: any;
let FilesetResolver: any;
let DrawingUtils: any;

const saveWorkoutSession = async (sessionData: { exercise: string; reps: number; duration: number, location?: string }) => {
    // TODO: Implement API call to POST /api/workouts/history
    console.log("Saving workout session:", sessionData);
    return new Promise(resolve => setTimeout(resolve, 500));
}

const calculateAngle = (a: any, b: any, c: any) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
        angle = 360 - angle;
    }
    return angle;
};

const RealTimeAnalysisPage: React.FC = () => {
    const { exerciseType } = useParams<{ exerciseType: string }>();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState('loading'); // loading, ready, running, finished
    const [reps, setReps] = useState(0);
    const [timer, setTimer] = useState(60); // 60-second countdown
    const [feedback, setFeedback] = useState('Initializing AI Model...');
    const [isSaving, setIsSaving] = useState(false);
    const [stage, setStage] = useState<'up' | 'down'>('up');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isWearableConnected, setIsWearableConnected] = useState(false);
    const [heartRate, setHeartRate] = useState(0);
    const [identityStatus, setIdentityStatus] = useState<'verifying' | 'verified' | 'failed'>('verifying');
    const [analysis, setAnalysis] = useState<any | null>(null);


    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);
    const poseLandmarkerRef = useRef<any>(null);

    useEffect(() => {
        const createPoseLandmarker = async () => {
            // @ts-ignore
            const vision = window.tasks?.vision;
            if (!vision) {
                setFeedback("Loading AI libraries...");
                setTimeout(createPoseLandmarker, 100); // Retry after 100ms
                return;
            }

            try {
                PoseLandmarker = vision.PoseLandmarker;
                FilesetResolver = vision.FilesetResolver;
                DrawingUtils = vision.DrawingUtils;

                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                const landmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numPoses: 1
                });
                poseLandmarkerRef.current = landmarker;
                setStatus('ready');
                setFeedback('Ready to start!');
                await setupWebcam();

                const wearableStatus = localStorage.getItem('wearableConnected');
                if (wearableStatus === 'true') {
                    setIsWearableConnected(true);
                    setHeartRate(Math.floor(70 + Math.random() * 15)); // Initial resting HR
                }
            } catch (error) {
                console.error("Error initializing PoseLandmarker:", error);
                setFeedback("Error loading AI model. Please refresh.");
                setStatus('error');
            }
        };

        const setupWebcam = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.addEventListener('loadeddata', () => {
                            requestRef.current = requestAnimationFrame(predictWebcam);
                        });
                    }
                } catch (error) {
                    console.error("Error accessing webcam:", error);
                    setFeedback("Webcam access denied. Please enable camera permissions.");
                    setStatus('error');
                }
            }
        };
        
        createPoseLandmarker();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (videoRef.current && videoRef.current.srcObject) {
                 (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        let timerInterval: ReturnType<typeof setInterval> | undefined;
        let hrInterval: ReturnType<typeof setInterval> | undefined;
        let identityInterval: ReturnType<typeof setInterval> | undefined;

        if (status === 'running' && timer > 0) {
            timerInterval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            
            if (isWearableConnected) {
                hrInterval = setInterval(() => {
                    setHeartRate(prev => {
                        const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
                        let newHr = prev + fluctuation;
                        if (newHr < 120) newHr = 120;
                        if (newHr > 165) newHr = 165;
                        return newHr;
                    });
                }, 1500);
            }

            // Simulate identity check
            identityInterval = setInterval(() => {
                // This is a mock. In a real app, you'd run a face comparison here.
                const isVerified = Math.random() > 0.1; // 90% chance of being verified
                setIdentityStatus(isVerified ? 'verified' : 'failed');
            }, 5000); // Check every 5 seconds

        } else if (status === 'running' && timer <= 0) {
            stopSession();
        } else if (status === 'finished' && isWearableConnected) {
            setHeartRate(Math.floor(90 + Math.random() * 10)); // Simulate recovery HR
        }
        return () => {
            clearInterval(timerInterval);
            clearInterval(hrInterval);
            clearInterval(identityInterval);
        };
    }, [status, timer, isWearableConnected]);


    const predictWebcam = () => {
        if (!videoRef.current || !canvasRef.current || !poseLandmarkerRef.current || !DrawingUtils || !PoseLandmarker) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const startTimeMs = performance.now();
        const results = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (results.landmarks && results.landmarks.length > 0) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            drawingUtils.drawConnectors(results.landmarks[0], PoseLandmarker.POSE_CONNECTIONS, { color: '#34D399', lineWidth: 4 });
            drawingUtils.drawLandmarks(results.landmarks[0], { color: '#0D1A18', fillColor: '#34D399', lineWidth: 2, radius: 4 });

            if (status === 'running') {
                processLandmarks(results.landmarks[0]);
            }
        }
        
        canvasCtx.restore();
        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    const processLandmarks = (landmarks: any) => {
        if (!PoseLandmarker) return;

        const {
            RIGHT_SHOULDER, RIGHT_HIP, RIGHT_KNEE
        } = PoseLandmarker.POSE_LANDMARKS;

        try {
            if (exerciseType === 'situps') {
                const shoulder = landmarks[RIGHT_SHOULDER];
                const hip = landmarks[RIGHT_HIP];
                const knee = landmarks[RIGHT_KNEE];
                const angle = calculateAngle(shoulder, hip, knee);

                // Assuming 'up' is lying down, 'down' is sitting up.
                if (angle > 120 && stage === 'down') { // Lying back
                    setReps(prev => prev + 1);
                    setStage('up');
                    setFeedback("Back down");
                }
                if (angle < 90 && stage === 'up') { // Crunched up
                    setStage('down');
                    setFeedback("Up!");
                }
            }
        } catch (error) {
            console.error("Error processing landmarks for exercise:", error);
        }
    };
    
    const startSession = () => {
        setReps(0);
        setTimer(60);
        setStage('up');
        setStatus('running');
        setFeedback("Go!");
    }

    const stopSession = async () => {
        setStatus('finished');
        setFeedback('Workout Complete!');
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }

        const mockAnalysis = {
            score: reps,
            unit: 'reps',
            performanceMetrics: [
                { metric: 'Form', value: Math.min(95, 70 + reps) },
                { metric: 'Power', value: Math.min(90, 60 + reps * 1.5) },
                { metric: 'Agility', value: 75 }, // Example static value
                { metric: 'Consistency', value: Math.max(50, 95 - Math.floor(reps/5)) },
            ],
            feedback: {
                strengths: reps > 45 ? ["Excellent stamina and consistent form."] : ["Good, consistent pace throughout the exercise."],
                weaknesses: reps < 30 ? ["Focus on increasing endurance for higher rep counts."] : ["Slight form degradation in the final 10 seconds."],
                suggestions: ["Incorporate planks to further strengthen core stability.", "Try weighted sit-ups in your next training session."]
            },
            verificationStatus: identityStatus === 'verified' ? 'Verified' : 'Flagged for Review',
            reasoning: identityStatus !== 'verified' ? 'Identity could not be consistently verified during the test.' : 'All integrity checks passed.'
        };
        setAnalysis(mockAnalysis);
        
        // Automatically save the session when it ends.
        setIsSaving(true);
        try {
            await saveWorkoutSession({
                exercise: exerciseType || 'unknown',
                reps: reps,
                duration: 60 - timer,
                location: '28.6139° N, 77.2090° E (Mock)'
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Failed to save workout session:", error);
            // isSubmitted remains false, allowing the user to retry with the submit button.
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleSubmitToSAI = async () => {
        setIsSaving(true);
        try {
            await saveWorkoutSession({
                exercise: exerciseType || 'unknown',
                reps: reps,
                duration: 60 - timer,
                location: '28.6139° N, 77.2090° E (Mock)'
            });
            setIsSubmitted(true);
        } catch(error) {
            console.error("Error submitting workout to SAI:", error);
            // Optionally, set an error state to show the user.
        } finally {
            setIsSaving(false);
        }
    };

    const exerciseTitle = exerciseType ? exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1) : 'Workout';
    
    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col z-50">
            <div className="absolute inset-0 flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video>
                <canvas ref={canvasRef} className="absolute w-full h-full transform scale-x-[-1]"></canvas>
            </div>
            
            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <h1 className="text-xl font-bold">{exerciseTitle} Analysis</h1>
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full">
                    <XIcon />
                </button>
            </header>

            {(status === 'running' || status === 'ready' || status === 'loading') && (
                 <footer className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                     <div className="flex justify-around items-center text-center">
                        <div>
                            <p className="text-4xl font-bold">{reps}</p>
                            <p className="text-sm text-gray-400">REPS</p>
                        </div>
                        {status === 'running' ? (
                            <button onClick={stopSession} className="bg-red-600 text-white font-bold py-4 px-8 rounded-full">FINISH</button>
                        ) : (
                            <button onClick={startSession} disabled={status !== 'ready'} className="bg-emerald-500 text-white font-bold py-4 px-8 rounded-full disabled:bg-gray-500">START</button>
                        )}
                        <div className="flex items-center gap-2">
                             <TimerIcon />
                             <p className="text-3xl font-mono">{new Date(timer * 1000).toISOString().substr(14, 5)}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center gap-2">
                        <div className="text-center p-2 bg-black/30 rounded-lg flex-grow">
                            <p className="text-emerald-400 font-semibold">{feedback}</p>
                        </div>
                        {status === 'running' && (
                            <div className={`text-center p-2 bg-black/30 rounded-lg flex items-center gap-1.5 flex-shrink-0 text-xs
                                ${identityStatus === 'verified' ? 'text-emerald-400' : ''}
                                ${identityStatus === 'failed' ? 'text-red-400' : ''}
                                ${identityStatus === 'verifying' ? 'text-yellow-400' : ''}
                            `}>
                                <ShieldCheckIcon />
                                <span className="font-semibold">
                                    {identityStatus === 'verified' && 'Identity Verified'}
                                    {identityStatus === 'failed' && 'Face Mismatch'}
                                    {identityStatus === 'verifying' && 'Verifying...'}
                                </span>
                            </div>
                        )}
                        {isWearableConnected && status === 'running' && (
                            <div className="text-center p-2 bg-black/30 rounded-lg flex items-center gap-1.5 flex-shrink-0">
                                <HeartbeatIcon />
                                <span className="font-mono text-xl text-red-400">{heartRate}</span>
                                <span className="text-xs text-gray-400 self-end pb-0.5">BPM</span>
                            </div>
                        )}
                    </div>
                </footer>
            )}

            {status === 'finished' && analysis && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
                    <div className="bg-[#1A2E29] p-6 rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col">
                        <h2 className="text-2xl font-bold text-emerald-400 text-center">Test Complete!</h2>
                        <div className="flex-grow overflow-y-auto space-y-4 mt-4 pr-2">
                            <div className="bg-[#0D1A18] rounded-2xl p-4 text-center">
                                <p className="text-sm text-gray-400">AI-Estimated Score</p>
                                <p className="text-5xl font-bold text-white">{analysis.score} <span className="text-2xl text-gray-400">{analysis.unit}</span></p>
                            </div>

                            <div className="bg-[#0D1A18] rounded-2xl p-4">
                                <h3 className="font-semibold text-lg mb-2">Performance Metrics</h3>
                                <div className="w-full h-48">
                                <ResponsiveContainer>
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysis.performanceMetrics}>
                                    <PolarGrid stroke="#4B5563" /><PolarAngleAxis dataKey="metric" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                                    <Radar name="Performance" dataKey="value" stroke="#34D399" fill="#34D399" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-[#0D1A18] rounded-2xl p-4">
                                <h3 className="font-semibold text-lg mb-3">AI Feedback</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3"><CheckCircleIcon /><p className="text-sm flex-1">{analysis.feedback.strengths}</p></li>
                                    <li className="flex items-start gap-3"><WarningTriangleIcon /><p className="text-sm flex-1">{analysis.feedback.weaknesses}</p></li>
                                    <li className="flex items-start gap-3"><TrendingUpIcon /><p className="text-sm flex-1">{analysis.feedback.suggestions[0]}</p></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 flex-shrink-0">
                            {isSubmitted ? (
                                <p className="text-center text-emerald-400 bg-emerald-900/50 p-3 rounded-lg">Your results have been submitted to SAI.</p>
                            ) : (
                                <button onClick={handleSubmitToSAI} disabled={isSaving} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl disabled:bg-gray-500">
                                    {isSaving ? "Submitting..." : "Submit to SAI"}
                                </button>
                            )}
                            <button onClick={() => navigate('/home')} className="w-full mt-2 bg-gray-700 text-white font-bold py-3 rounded-xl">
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealTimeAnalysisPage;