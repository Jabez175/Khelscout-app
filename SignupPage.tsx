import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, GoogleIcon, SmartphoneIcon, XIcon, UserIcon, BriefcaseIcon, ShieldIcon, CheckCircleIcon, ScanFaceIcon } from './Icons';
import { UserRole } from './types';
import { useAuth } from './AuthContext';
import GuardianConsentModal from './GuardianConsentModal';

const sports = ['Basketball', 'Soccer', 'Running', 'Tennis', 'Cricket'];

const OtpVerificationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    mobile: string;
    role: UserRole;
    name: string;
    sport: string;
}> = ({ isOpen, onClose, mobile, role, name, sport }) => {
    const navigate = useNavigate();
    const [mobileOtp, setMobileOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (mobileOtp.length < 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }
        setIsLoading(true);

        // --- MOCK VERIFICATION ---
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Verifying OTP (mock)', { mobileOtp });
        // --- END MOCK ---
        
        // If the user is a mentor, navigate them to the verification page
        if (role === UserRole.MENTOR) {
             navigate('/mentor-verification', { state: { name, role, sport } });
             return;
        }

        // For other roles, navigate to the success page
        navigate('/signup-success', { state: { role, sport } });
    };
    
    const maskMobile = (mobile: string) => {
        if (mobile.length < 4) return mobile;
        return `******${mobile.slice(-4)}`;
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div
                className="bg-[#0E1B17]/80 backdrop-blur-xl ring-1 ring-white/10 w-full max-w-sm rounded-2xl p-6 text-white transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end">
                    <button onClick={onClose} className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-white">
                        <XIcon />
                    </button>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Verify Account</h2>
                    <p className="text-gray-400 mt-2 text-sm px-4">
                        Enter the code sent to {maskMobile(mobile)}.
                    </p>
                </div>
                <form onSubmit={handleVerify} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="mobile-otp" className="block text-sm font-medium text-gray-400 mb-1">Mobile OTP</label>
                        <input id="mobile-otp" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="Enter 6-digit code" value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value)} className="w-full px-4 py-3 bg-[#050e0c] ring-1 ring-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white tracking-[0.3em] text-center" required maxLength={6} />
                    </div>
                    {error && <p className="text-red-500 text-sm pt-1 text-center">{error}</p>}
                    <div className="text-center pt-2">
                        <button type="button" className="text-sm text-emerald-400 hover:underline font-semibold">
                            Didn't receive the code? Resend
                        </button>
                    </div>
                    <div className="pt-2">
                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Verifying...' : 'Verify Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
    const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
    const [userType, setUserType] = useState<UserRole>(UserRole.ATHLETE);
    const [sport, setSport] = useState(sports[0]);
    const [organizationName, setOrganizationName] = useState('');
    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const [isConsentModalOpen, setConsentModalOpen] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isFaceScanned, setIsFaceScanned] = useState(false);
    const [isScanning, setIsScanning] = useState(false);


    useEffect(() => {
        const setupWebcam = async () => {
            if (step === 2 && videoRef.current && !videoRef.current.srcObject) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error("Error accessing webcam:", error);
                    alert("Webcam access is required for face scan. Please enable permissions.");
                    setStep(1); // Go back if permissions are denied
                }
            }
        };

        setupWebcam();

        return () => {
            if (step !== 2 && videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [step]);


    const handleAadhaarVerification = async () => {
        if (aadhaar.length !== 12) {
            alert("Please enter a valid 12-digit Aadhaar number.");
            return;
        }
        setIsVerifyingAadhaar(true);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsVerifyingAadhaar(false);
        setIsAadhaarVerified(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAadhaarVerified) {
            alert("Please verify your Aadhaar number first.");
            return;
        }
        setStep(2);
    };

    const handleFaceScan = async () => {
        setIsScanning(true);
        // Simulate scanning process
        await new Promise(res => setTimeout(res, 2000));
        setIsFaceScanned(true);
        setIsScanning(false);
    };

    const handleFinalSubmit = () => {
        if (userType === UserRole.ATHLETE && dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                setConsentModalOpen(true);
                return;
            }
        }
        
        console.log('Simulating OTP request for', { name, mobile, userType, sport, organizationName });
        setOtpModalOpen(true);
    };

    const handleConsentConfirmed = () => {
        setConsentModalOpen(false);
        setOtpModalOpen(true);
    };

    const focusedRoles = [UserRole.ATHLETE, UserRole.MENTOR, UserRole.ORGANIZATION];
    
    const getNamePlaceholder = () => {
        switch(userType) {
            case UserRole.ORGANIZATION: return "Contact Person Name";
            default: return "Full Name";
        }
    };

    const inputStyle = "w-full pl-12 pr-4 py-3 bg-[#0E1B17] ring-1 ring-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white";
    const selectStyle = "w-full px-4 py-3 bg-[#0E1B17] ring-1 ring-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none";


    return (
        <>
            <div className="flex flex-col min-h-screen bg-transparent">
                <header className="flex items-center justify-between p-4">
                    <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="p-2">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-xl font-bold text-white">
                        {step === 1 ? 'Create Account' : 'Face Scan'}
                    </h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </header>

                {step === 1 && (
                    <form onSubmit={handleFormSubmit} className="flex-grow flex flex-col px-6 pb-6">
                        <div className="flex-grow">
                            <p className="text-gray-400 mb-8 text-center mt-4">Join the national talent assessment program.</p>

                            <div className="space-y-4">
                                <select value={userType} onChange={(e) => setUserType(e.target.value as UserRole)} className={selectStyle} required >
                                    {focusedRoles.map(role => (<option key={role} value={role}>{role}</option>))}
                                </select>

                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><ShieldIcon /></div>
                                    <input type="text" placeholder="Aadhaar Number" className="w-full pl-12 pr-28 py-3 bg-[#0E1B17] ring-1 ring-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" required value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} maxLength={12} disabled={isAadhaarVerified} />
                                    <button type="button" onClick={handleAadhaarVerification} disabled={isAadhaarVerified || isVerifyingAadhaar || aadhaar.length !== 12} className="absolute inset-y-0 right-0 flex items-center px-3 m-1 rounded-lg bg-emerald-500 text-sm font-semibold disabled:bg-gray-600">
                                        {isVerifyingAadhaar ? '...' : (isAadhaarVerified ? 'Verified' : 'Verify')}
                                    </button>
                                </div>

                                {userType === UserRole.ORGANIZATION && (
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><BriefcaseIcon /></div>
                                        <input type="text" placeholder="Organization Name" className={inputStyle} required value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><UserIcon /></div>
                                    <input type="text" placeholder={getNamePlaceholder()} className={inputStyle} required value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><SmartphoneIcon /></div>
                                    <input type="tel" placeholder="Mobile Number" className={inputStyle} required value={mobile} onChange={(e) => setMobile(e.target.value)} />
                                </div>

                                {userType === UserRole.ATHLETE && (
                                    <div>
                                        <label className="text-xs text-gray-400 ml-1 mb-1 block">Date of Birth</label>
                                        <input type="date" className="w-full px-4 py-3 bg-[#0E1B17] ring-1 ring-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white" required value={dob} onChange={(e) => setDob(e.target.value)} />
                                    </div>
                                )}
                                
                                {(userType === UserRole.ATHLETE || userType === UserRole.MENTOR) && (
                                    <select value={sport} onChange={(e) => setSport(e.target.value)} className={selectStyle} required >
                                        {sports.map(s => (<option key={s} value={s}>{s}</option>))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <button type="submit" disabled={!isAadhaarVerified} className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                                Continue
                            </button>
                            <p className="text-center text-gray-400 mt-4 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-emerald-400 hover:underline">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    </form>
                )}

                {step === 2 && (
                     <div className="flex-grow flex flex-col px-6 pb-6 items-center text-center">
                        <p className="text-gray-400 mb-6 max-w-xs mt-4">This scan verifies your identity for secure, AI-proctored tests.</p>
                        
                        <div className="relative w-64 h-80 rounded-2xl overflow-hidden bg-black mb-4 flex items-center justify-center">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                             <div className="absolute inset-0 border-[40px] border-black/50 rounded-[60px]"></div>
                        </div>

                        {isFaceScanned ? (
                            <div className="flex flex-col items-center text-emerald-400">
                                <CheckCircleIcon className="w-12 h-12"/>
                                <p className="font-bold mt-2">Scan Complete!</p>
                            </div>
                        ) : (
                            <button onClick={handleFaceScan} disabled={isScanning} className="w-full max-w-sm bg-[#1A2E29] text-white font-bold py-3 rounded-xl ring-1 ring-white/10 flex items-center justify-center gap-2">
                                {isScanning ? (
                                    <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                ) : (
                                    <><ScanFaceIcon /> Scan Face</>
                                )}
                            </button>
                        )}
                       
                        <div className="mt-auto w-full pt-4">
                            <button onClick={handleFinalSubmit} disabled={!isFaceScanned} className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                                Finish Signup
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <GuardianConsentModal 
                isOpen={isConsentModalOpen}
                onClose={() => setConsentModalOpen(false)}
                onConfirm={handleConsentConfirmed}
            />
            <OtpVerificationModal
                isOpen={isOtpModalOpen}
                onClose={() => setOtpModalOpen(false)}
                mobile={mobile}
                role={userType}
                name={name}
                sport={sport}
            />
        </>
    );
};

export default SignupPage;