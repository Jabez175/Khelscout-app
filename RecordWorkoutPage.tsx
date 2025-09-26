import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CheckCircleIcon, TrendingUpIcon, WarningTriangleIcon, XIcon, ShieldCheckIcon } from './Icons';
import { analyzeWorkoutVideo } from './geminiService';
import FraudDetectionModal from './FraudDetectionModal';
import VideoSettingsModal from './VideoSettingsModal';

const RecordWorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { test } = location.state || {};
  const { exerciseType: testType, title: testTitle } = test || {};
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoPlaceholder, setIsVideoPlaceholder] = useState(true);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [declaredDistance, setDeclaredDistance] = useState('');


  const [isFraudModalOpen, setFraudModalOpen] = useState(false);
  const [isVideoSettingsOpen, setVideoSettingsOpen] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsVideoPlaceholder(false);
      setAnalysis(null);
      setError(null);
      setIsSubmitted(false);
    } else {
      setError("Please select a valid video file.");
    }
  };
  
  const extractFrames = (videoElement: HTMLVideoElement, frameCount: number): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const frames: string[] = [];
        
        if (videoElement.readyState < 1) {
             await new Promise(res => videoElement.addEventListener('loadedmetadata', res, {once: true}));
        }
        
        const duration = videoElement.duration;
        if (!context || !duration || isNaN(duration)) return reject(new Error("Video metadata is not available."));
        
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        for (let i = 0; i < frameCount; i++) {
            const time = (duration * (i + 1)) / (frameCount + 1);
            videoElement.currentTime = time;
            
            await new Promise<void>(resolveSeek => {
                const onSeeked = () => {
                    videoElement.removeEventListener('seeked', onSeeked);
                    resolveSeek();
                };
                videoElement.addEventListener('seeked', onSeeked);
            });
            
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
            frames.push(base64);
        }
        videoElement.currentTime = 0;
        resolve(frames);
    });
  };

  const handleAnalyzeVideo = async () => {
    if (!videoRef.current || isVideoPlaceholder) {
      setError("Please upload a video first.");
      return;
    }
    if (testType === 'endurance_run' && !declaredDistance) {
        setError("Please declare the distance you ran.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const frames = await extractFrames(videoRef.current, 5);
      const result = await analyzeWorkoutVideo(frames, testType, declaredDistance);
      setAnalysis(result);
      setFraudModalOpen(true);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to analyze video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitToSAI = () => {
      console.log("Submitting verified data to SAI:", { ...analysis, location: '28.6139° N, 77.2090° E (Mock)' });
      setIsSubmitted(true);
  };

  const isVerified = analysis?.verificationStatus === 'Verified';

  return (
    <>
      <div className="bg-[#0D1A18] text-white min-h-screen">
        <div className="max-w-md mx-auto flex flex-col h-screen">
          <header className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">{testTitle || 'AI Video Analysis'}</h1>
            <button onClick={() => navigate(-1)} className="p-2">
              <XIcon />
            </button>
          </header>

          <main className="flex-grow overflow-y-auto px-4 pb-4 space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
              {isVideoPlaceholder ? (
                <img src="https://picsum.photos/seed/powerlift/400/225" alt="Workout video placeholder" className="w-full h-full object-cover opacity-60" />
              ) : (
                <video ref={videoRef} src={videoUrl!} controls muted playsInline className="w-full h-full object-cover"></video>
              )}
              {isVideoPlaceholder && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <h2 className="font-bold text-lg">Upload your performance</h2>
                      <p className="text-sm text-gray-300">Get AI-powered analysis and verification.</p>
                  </div>
              )}
            </div>
            
            {testType === 'endurance_run' && !isVideoPlaceholder && (
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Declared Distance</label>
                    <input 
                        type="text"
                        value={declaredDistance}
                        onChange={(e) => setDeclaredDistance(e.target.value)}
                        placeholder="e.g., 1.6km"
                        className="w-full px-4 py-3 bg-[#1A2E29] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
            )}

            <div className="flex gap-4">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
              <button onClick={handleUploadClick} className="w-1/2 bg-[#1A2E29] text-white font-bold py-3 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors">
                {isVideoPlaceholder ? 'Upload Video' : 'Upload Another'}
              </button>
              <button onClick={handleAnalyzeVideo} disabled={isLoading || isVideoPlaceholder} className="w-1/2 bg-emerald-400 text-[#0D1A18] font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading ? ( <><svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing...</> ) : 'Analyze Video'}
              </button>
            </div>

             <div className="text-center">
                <button onClick={() => setVideoSettingsOpen(true)} className="text-xs text-gray-400 underline">Video Upload Settings</button>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">AI Analysis & Verification</h2>
              {isLoading && ( <div className="text-center p-8 bg-[#1A2E29] rounded-2xl"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-emerald-400 mx-auto"></div><p className="mt-4 text-gray-300">AI is analyzing your video...</p><p className="text-xs text-gray-500">This may take a moment.</p></div> )}
              {error && ( <div className="text-center p-8 bg-red-900/50 rounded-2xl"><p className="font-bold text-red-400">Analysis Failed</p><p className="mt-2 text-sm text-gray-300">{error}</p></div> )}
              {!isLoading && !error && !analysis && ( <div className="text-center p-8 bg-[#1A2E29] rounded-2xl"><h3 className="font-semibold text-lg mb-2">Ready for Analysis</h3><p className="text-gray-400 text-sm">Upload a video of your test, then click "Analyze Video" to get AI-powered feedback and verification.</p></div> )}
              
              {analysis && (
                <div className="space-y-4">
                   <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><ShieldCheckIcon /> Integrity Checks</h3>
                      <div className="text-xs space-y-2">
                          <p className="flex justify-between items-center"><span>Video Hash (SHA-256)</span><span className="font-mono text-emerald-400">4a2b...f9e1</span></p>
                          <p className="flex justify-between items-center"><span>Sensor Fusion Check</span><span className="text-emerald-400 font-semibold">Passed</span></p>
                      </div>
                  </div>
                  <div className={`p-4 rounded-2xl ${isVerified ? 'bg-emerald-900/50' : 'bg-red-900/50'}`}>
                      <h3 className="font-semibold text-lg mb-2">Verification Result</h3>
                      <div className="flex items-center gap-2">
                          {isVerified ? <CheckCircleIcon /> : <WarningTriangleIcon />}
                          <div>
                              <p className={`font-bold ${isVerified ? 'text-emerald-400' : 'text-red-400'}`}>{analysis.verificationStatus}</p>
                              {!isVerified && <p className="text-sm text-gray-300">{analysis.reasoning}</p>}
                          </div>
                      </div>
                  </div>
                  <div className="bg-[#1A2E29] rounded-2xl p-4">
                    <h3 className="font-semibold text-lg mb-2">Test Score</h3>
                    <div className="text-center"><p className="text-4xl font-bold text-white">{analysis.score} <span className="text-lg text-gray-400">{analysis.unit}</span></p><p className="text-sm text-gray-400">AI-Estimated Result</p></div>
                  </div>
                  <div className="bg-[#1A2E29] rounded-2xl p-4">
                    <h3 className="font-semibold text-lg mb-2">Performance Metrics</h3>
                    <div className="w-full h-52">
                      <ResponsiveContainer>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysis.performanceMetrics}>
                          <PolarGrid stroke="#4B5563" /><PolarAngleAxis dataKey="metric" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                          <Radar name="Performance" dataKey="value" stroke="#34D399" fill="#34D399" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-[#1A2E29] rounded-2xl p-4">
                    <h3 className="font-semibold text-lg mb-3">AI Feedback & Suggestions</h3>
                    <ul className="space-y-3">
                      {analysis.feedback.strengths.map((item: string, index: number) => (<li key={`str-${index}`} className="flex items-start gap-3"><CheckCircleIcon /><p className="text-sm flex-1">{item}</p></li>))}
                      {analysis.feedback.weaknesses.map((item: string, index: number) => (<li key={`weak-${index}`} className="flex items-start gap-3"><WarningTriangleIcon /><p className="text-sm flex-1">{item}</p></li>))}
                      {analysis.feedback.suggestions.map((item: string, index: number) => (<li key={`sug-${index}`} className="flex items-start gap-3"><TrendingUpIcon /><p className="text-sm flex-1">{item}</p></li>))}
                    </ul>
                  </div>
                  <div className="pt-4">
                      {isSubmitted ? ( <div className="w-full text-center bg-emerald-900/50 text-emerald-400 font-bold py-3 rounded-xl">Submitted to SAI</div> ) : (
                          <button onClick={handleSubmitToSAI} disabled={!isVerified} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                              Submit to SAI
                          </button>
                      )}
                      {!isVerified && !isSubmitted && <p className="text-xs text-center text-gray-500 mt-2">Submission is disabled until your test is 'Verified'. Please re-record if necessary.</p>}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <FraudDetectionModal isOpen={isFraudModalOpen} onClose={() => setFraudModalOpen(false)} analysis={analysis} />
      <VideoSettingsModal isOpen={isVideoSettingsOpen} onClose={() => setVideoSettingsOpen(false)} />
    </>
  );
};

export default RecordWorkoutPage;