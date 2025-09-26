export enum UserRole {
    ATHLETE = 'Athlete',
    MENTOR = 'Mentor',
    ORGANIZATION = 'Organization',
}

export interface Achievement {
    eventName: string;
    result: string;
    year: number;
}

export interface SAIScores {
    height?: { score: number; unit: 'cm'; verified: boolean };
    weight?: { score: number; unit: 'kg'; verified: boolean };
    sitAndReach?: { score: number; unit: 'cm'; verified: boolean };
    standingVerticalJump?: { score: number; unit: 'cm'; verified: boolean };
    standingBroadJump?: { score: number; unit: 'cm'; verified: boolean };
    medicineBallThrow?: { score: number; unit: 'm'; verified: boolean };
    standingStart30m?: { score: number; unit: 's'; verified: boolean };
    shuttleRun4x10?: { score: number; unit: 's'; verified: boolean };
    sitUps?: { score: number; unit: 'reps'; verified: boolean };
    enduranceRun?: { score: number; unit: 's'; verified: boolean };
}

export enum AthleteStatus {
    SHORTLISTED = 'Shortlisted',
    UNDER_REVIEW = 'Under Review',
    INVITED_TO_CAMP = 'Invited to Camp',
    SPONSORED = 'Sponsored',
    REJECTED = 'Rejected',
}

export interface ShortlistEntry {
    athleteId: string;
    status: AthleteStatus;
    notes?: string;
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
    specialization?: string;
    joinedYear?: number;
    bio?: string;
    sport?: string;
    age?: number;
    gender?: 'Male' | 'Female';
    district?: string;
    points?: number;
    rank?: number;
    achievements?: Achievement[];
    saiScores?: SAIScores;
    rating?: number;
    experienceYears?: number;
    athletesTrained?: number;
}

export interface SkillTest {
  id: string;
  title: string;
  description: string;
  type: 'live' | 'upload';
  exerciseType?: string;
}

export interface Workout {
  id: string;
  title: string;
  sport: string;
  description: string;
  exercises: number;
  imageUrl: string;
}

export interface Event {
    id: string;
    title: string;
    sport: string;
    date: string;
    time: string;
    imageUrl: string;
    district: string;
    location: string;
    organizedBy: string;
    isGovernment: boolean;
    description: string;
    contact?: string;
}

interface Meal {
    name: string;
    description: string;
    calories: number;
}

export interface MealPlan {
    totalCalories: number;
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal;
}

export enum NotificationType {
    EVENT = 'Event Reminder',
    MESSAGE = 'New Message',
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    linkTo?: string;
}

export interface InjuryLog {
    id: string;
    date: string;
    injury: string;
    severity: 'Low' | 'Medium' | 'High';
    status: 'Recovering' | 'Recovered' | 'Ongoing';
    notes: string;
}

export interface Drill {
    id: string;
    name: string;
    category: string;
    description: string;
}

export interface Team {
    id: string;
    name: string;
    district: string;
    sport: string;
    totalPoints: number;
    topAthletes: User[];
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    cost: number;
    type: 'Merchandise' | 'Discount' | 'Resource';
}

export interface Session {
  id: string;
  title: string;
  type: 'Strength' | 'Agility' | 'Endurance' | 'Skill Specific';
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM AM/PM"
  assignedAthleteIds: string[];
  mentorId: string;
}