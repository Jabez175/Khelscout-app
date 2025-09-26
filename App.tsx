import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/AuthContext';
import HomePage from '@/HomePage';
import LoginPage from '@/LoginPage';
import ProfilePage from '@/ProfilePage';
import RecordWorkoutPage from '@/RecordWorkoutPage';
import SignupPage from '@/SignupPage';
import RankingPage from '@/RankingPage';
import SkillTestPage from '@/SkillTestPage';
import { UserRole } from '@/types';
import type { User } from '@/types';
import EditProfilePage from '@/EditProfilePage';
import FindAthletesPage from '@/FindAthletesPage';
import RealTimeAnalysisPage from '@/RealTimeAnalysisPage';
import SettingsPage from '@/SettingsPage';
import { ShortlistProvider } from '@/SponsorshipContext';
import ShortlistedAthletesPage from '@/SponsoredAthletesPage';
import NotificationsPage from '@/NotificationsPage';
import PerformancePage from '@/PerformancePage';
import HeatmapPage from '@/HeatmapPage';
import ChatPage from '@/ChatPage';
import EventDetailPage from '@/EventDetailPage';
import DietPlannerPage from '@/DietPlannerPage';
import { EventProvider } from '@/EventContext';
import EventsPage from '@/EventsPage';
import MyRegistrationsPage from '@/MyRegistrationsPage';
import ManageEventsPage from '@/ManageEventsPage';
import CreateEventPage from '@/CreateEventPage';
import EventAnalyticsPage from '@/EventAnalyticsPage';
import DashboardPage from '@/DashboardPage';
import CommunityPage from '@/CommunityPage';
import VerificationPage from '@/VerificationPage';
import Layout from '@/Layout';
import AntiReplayPage from '@/AntiReplayPage';
import EnvCheckPage from '@/EnvCheckPage';
import HealthPage from '@/HealthPage';
import DrillLibraryPage from '@/DrillLibraryPage';
import VerificationQueue from '@/VerificationQueue';
import CareerAdvisorPage from '@/CareerAdvisorPage';
import ChallengePage from '@/ChallengePage';
import RewardWalletPage from '@/RewardWalletPage';
import ProgressionBoard from '@/ProgressionBoard';
import PrivacyPage from '@/PrivacyPage';
import SyncManagerPage from '@/SyncManagerPage';
import MentorLiveSession from '@/MentorLiveSession';
import AdminHeatmapPage from '@/AdminHeatmapPage';
import FutureRoadmapPage from '@/FutureRoadmapPage';
import FindMentorPage from './FindMentorPage';
import ChatListPage from './ChatListPage';
import CreatePostPage from './CreatePostPage';
import CreateSessionPage from './CreateSessionPage';
import MentorVerificationPage from './MentorVerificationPage';
import TrainingPage from './TrainingPage';
import WorkoutDetailPage from './WorkoutDetailPage';
import StartWorkoutPromptPage from './StartWorkoutPromptPage';
import MentorOnboardingPage from './MentorOnboardingPage';
import TestStartPromptPage from './TestStartPromptPage';
import SignupSuccessPage from './SignupSuccessPage';


const App: React.FC = () => {
    return (
        <AuthProvider>
            <ShortlistProvider>
                <EventProvider>
                    <div className="bg-gray-50 dark:bg-[#0D1A18] text-gray-900 dark:text-white min-h-screen font-sans">
                        <div className="max-w-md mx-auto h-screen flex flex-col">
                            <HashRouter>
                                <AppRoutes />
                            </HashRouter>
                        </div>
                    </div>
                </EventProvider>
            </ShortlistProvider>
        </AuthProvider>
    );
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    const getDefaultRedirectPath = (user: User | null): string => {
        if (!user) {
            return '/login';
        }
        switch (user.role) {
            case UserRole.ORGANIZATION:
                return '/manage-events';
            case UserRole.MENTOR:
                return '/dashboard';
            case UserRole.ATHLETE:
            default:
                return '/home';
        }
    };

    return (
        <Routes>
            {!user ? (
                <>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/signup-success" element={<SignupSuccessPage />} />
                    <Route path="/mentor-verification" element={<MentorVerificationPage />} />
                    <Route path="/mentor-onboarding" element={<MentorOnboardingPage />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </>
            ) : (
                <>
                    {/* Common Routes */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/sync-manager" element={<SyncManagerPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/event/:id" element={<EventDetailPage />} />
                    <Route path="/chat/:userId" element={<ChatPage />} />
                    <Route path="/chat-list" element={<ChatListPage />} />
                    <Route path="/future-roadmap" element={<FutureRoadmapPage />} />
                    <Route path="/heatmap" element={<HeatmapPage />} />
                    
                    {/* Athlete Routes */}
                    {user.role === UserRole.ATHLETE && (
                        <>
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/community" element={<CommunityPage />} />
                            <Route path="/find-mentor" element={<FindMentorPage />} />
                            <Route path="/my-registrations" element={<MyRegistrationsPage />} />
                            <Route path="/skill-test" element={<SkillTestPage />} />
                            <Route path="/env-check" element={<EnvCheckPage />} />
                            <Route path="/anti-replay" element={<AntiReplayPage />} />
                            <Route path="/verify-test" element={<VerificationPage />} />
                            <Route path="/start-test-prompt" element={<TestStartPromptPage />} />
                            <Route path="/record-workout" element={<RecordWorkoutPage />} />
                            <Route path="/live-analysis/:exerciseType" element={<RealTimeAnalysisPage />} />
                            <Route path="/performance" element={<PerformancePage />} />
                            <Route path="/diet-planner" element={<DietPlannerPage />} />
                            <Route path="/career-advisor" element={<CareerAdvisorPage />} />
                            <Route path="/rankings" element={<RankingPage />} />
                            <Route path="/challenges" element={<ChallengePage />} />
                            <Route path="/rewards" element={<RewardWalletPage />} />
                            <Route path="/progression-board" element={<ProgressionBoard />} />
                             <Route path="/health" element={<HealthPage />} />
                            <Route path="/training" element={<TrainingPage />} />
                            <Route path="/workout/:id" element={<WorkoutDetailPage />} />
                            <Route path="/start-workout" element={<StartWorkoutPromptPage />} />
                        </>
                    )}
                    
                    {/* Mentor Routes */}
                    {user.role === UserRole.MENTOR && (
                        <>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/community" element={<CommunityPage />} />
                            <Route path="/drills" element={<DrillLibraryPage />} />
                            <Route path="/rankings" element={<RankingPage />} />
                            <Route path="/live-session/:athleteId" element={<MentorLiveSession />} />
                            <Route path="/create-session" element={<CreateSessionPage />} />
                            <Route path="/create" element={<CreatePostPage />} />
                        </>
                    )}

                    {/* Organization Routes */}
                    {user.role === UserRole.ORGANIZATION && (
                         <>
                            <Route path="/find-athletes" element={<FindAthletesPage />} />
                            <Route path="/shortlisted-athletes" element={<ShortlistedAthletesPage />} />
                            <Route path="/manage-events" element={<ManageEventsPage />} />
                            <Route path="/create-event" element={<CreateEventPage />} />
                            {/* FIX: The App.tsx file was truncated, this completes the component and file. */}
                            <Route path="/analytics/events" element={<EventAnalyticsPage />} />
                            <Route path="/verify" element={<VerificationQueue />} />
                            <Route path="/anomaly-heatmap" element={<AdminHeatmapPage />} />
                        </>
                    )}
                    <Route path="*" element={<Navigate to={getDefaultRedirectPath(user)} />} />
                </>
            )}
        </Routes>
    );
};

export default App;
