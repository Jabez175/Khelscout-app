import { User, UserRole, Session, Drill } from './types';

export const indianDistricts = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
    'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad',
    'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
    'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
    'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad', 'Mysore'
];

export const ATHLETES_DATA: User[] = [
    { id: '1', name: 'Ethan Carter', sport: 'Basketball', age: 22, avatarUrl: 'https://picsum.photos/seed/ethan/100', role: UserRole.ATHLETE, district: 'Mumbai', gender: 'Male', points: 1234, rank: 1, achievements: [{ eventName: 'Youth Basketball Tournament', result: 'MVP', year: 2024 }], saiScores: { height: { score: 188, unit: 'cm', verified: true }, weight: { score: 82, unit: 'kg', verified: true }, sitAndReach: { score: 15, unit: 'cm', verified: true }, standingVerticalJump: { score: 62, unit: 'cm', verified: true }, standingBroadJump: { score: 270, unit: 'cm', verified: true }, medicineBallThrow: { score: 14, unit: 'm', verified: true }, standingStart30m: { score: 4.1, unit: 's', verified: true }, shuttleRun4x10: { score: 9.5, unit: 's', verified: true }, sitUps: { score: 58, unit: 'reps', verified: true }, enduranceRun: { score: 530, unit: 's', verified: true } } },
    { id: '2', name: 'Sophia Chen', sport: 'Running', age: 20, avatarUrl: 'https://picsum.photos/seed/sophia/100', role: UserRole.ATHLETE, district: 'Delhi', gender: 'Female', points: 1122, rank: 2, achievements: [{ eventName: 'Delhi Marathon', result: '1st Place', year: 2023 }], saiScores: { height: { score: 165, unit: 'cm', verified: true }, weight: { score: 54, unit: 'kg', verified: true }, sitAndReach: { score: 25, unit: 'cm', verified: true }, standingVerticalJump: { score: 45, unit: 'cm', verified: true }, standingBroadJump: { score: 210, unit: 'cm', verified: true }, medicineBallThrow: { score: 8, unit: 'm', verified: true }, standingStart30m: { score: 4.8, unit: 's', verified: true }, shuttleRun4x10: { score: 10.1, unit: 's', verified: true }, sitUps: { score: 50, unit: 'reps', verified: true }, enduranceRun: { score: 480, unit: 's', verified: true } } },
    { id: '3', name: 'Liam Rodriguez', sport: 'Soccer', age: 24, avatarUrl: 'https://picsum.photos/seed/liam/100', role: UserRole.ATHLETE, district: 'Bangalore', gender: 'Male', points: 1011, rank: 3, achievements: [{ eventName: 'Regional Soccer Championship', result: 'Top Scorer', year: 2024 }], saiScores: { height: { score: 178, unit: 'cm', verified: true }, weight: { score: 75, unit: 'kg', verified: true }, sitAndReach: { score: 18, unit: 'cm', verified: true }, standingVerticalJump: { score: 58, unit: 'cm', verified: true }, standingBroadJump: { score: 260, unit: 'cm', verified: true }, medicineBallThrow: { score: 13, unit: 'm', verified: true }, standingStart30m: { score: 4.3, unit: 's', verified: true }, shuttleRun4x10: { score: 9.7, unit: 's', verified: true }, sitUps: { score: 55, unit: 'reps', verified: true }, enduranceRun: { score: 550, unit: 's', verified: true } } },
    { id: '4', name: 'Olivia Kim', sport: 'Basketball', age: 19, avatarUrl: 'https://picsum.photos/seed/olivia/100', role: UserRole.ATHLETE, district: 'Mumbai', gender: 'Female', points: 987, rank: 4, achievements: [], saiScores: { height: { score: 175, unit: 'cm', verified: true }, weight: { score: 64, unit: 'kg', verified: true }, sitAndReach: { score: 22, unit: 'cm', verified: true }, standingVerticalJump: { score: 50, unit: 'cm', verified: false }, medicineBallThrow: { score: 9, unit: 'm', verified: true }, standingStart30m: { score: 4.7, unit: 's', verified: true }, shuttleRun4x10: { score: 10.4, unit: 's', verified: true }, sitUps: { score: 48, unit: 'reps', verified: true }, enduranceRun: { score: 590, unit: 's', verified: true } } },
    { id: '5', name: 'Aarav Sharma', sport: 'Cricket', age: 21, avatarUrl: 'https://picsum.photos/seed/aarav/100', role: UserRole.ATHLETE, district: 'Jaipur', gender: 'Male', points: 1150, rank: 5, achievements: [{ eventName: 'Rajasthan Premier League', result: 'Best Fielder', year: 2023 }], saiScores: { height: { score: 180, unit: 'cm', verified: true }, weight: { score: 76, unit: 'kg', verified: true }, sitAndReach: { score: 12, unit: 'cm', verified: true }, standingVerticalJump: { score: 52, unit: 'cm', verified: true }, standingBroadJump: { score: 240, unit: 'cm', verified: true }, medicineBallThrow: { score: 15, unit: 'm', verified: true }, standingStart30m: { score: 4.4, unit: 's', verified: true }, shuttleRun4x10: { score: 9.9, unit: 's', verified: true }, sitUps: { score: 51, unit: 'reps', verified: true }, enduranceRun: { score: 560, unit: 's', verified: true } } },
    { id: '6', name: 'Mei Lin', sport: 'Tennis', age: 23, avatarUrl: 'https://picsum.photos/seed/mei/100', role: UserRole.ATHLETE, district: 'Kolkata', gender: 'Female', points: 950, rank: 6, achievements: [{ eventName: 'Junior Tennis Open', result: 'Runner Up', year: 2024 }], saiScores: { height: { score: 168, unit: 'cm', verified: true }, weight: { score: 58, unit: 'kg', verified: true }, sitAndReach: { score: 28, unit: 'cm', verified: true }, standingVerticalJump: { score: 48, unit: 'cm', verified: true }, standingBroadJump: { score: 215, unit: 'cm', verified: true }, medicineBallThrow: { score: 10, unit: 'm', verified: true }, standingStart30m: { score: 4.9, unit: 's', verified: true }, shuttleRun4x10: { score: 10.2, unit: 's', verified: true }, sitUps: { score: 47, unit: 'reps', verified: true }, enduranceRun: { score: 610, unit: 's', verified: true } } },
];

export const MENTORS_DATA: User[] = [
    { id: '4', name: 'Coach Alex', role: UserRole.MENTOR, avatarUrl: 'https://picsum.photos/seed/alex/100', sport: 'Basketball', district: 'Mumbai', specialization: 'Shooting & Dribbling', rating: 4.8, experienceYears: 10, athletesTrained: 25 },
    { id: 'm2', name: 'Coach Priya', role: UserRole.MENTOR, avatarUrl: 'https://picsum.photos/seed/priya/100', sport: 'Basketball', district: 'Pune', specialization: 'Defensive Strategy', rating: 4.6, experienceYears: 6, athletesTrained: 15 },
    { id: 'm3', name: 'Coach Vikram', role: UserRole.MENTOR, avatarUrl: 'https://picsum.photos/seed/vikram/100', sport: 'Cricket', district: 'Chennai', specialization: 'Fast Bowling', rating: 4.9, experienceYears: 15, athletesTrained: 60 },
    { id: 'm4', name: 'Coach Sarah', role: UserRole.MENTOR, avatarUrl: 'https://picsum.photos/seed/sarah/100', sport: 'Soccer', district: 'Delhi', specialization: 'Goalkeeping & Defense', rating: 4.9, experienceYears: 8, athletesTrained: 40 },
    { id: 'm5', name: 'Coach David', role: UserRole.MENTOR, avatarUrl: 'https://picsum.photos/seed/david/100', sport: 'Running', district: 'Bangalore', specialization: 'Sprinting & Endurance', rating: 4.7, experienceYears: 12, athletesTrained: 50 },
];

const getFutureDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const SESSIONS_DATA: Session[] = [
    { id: 'session1', title: 'Live: Agility Drills', type: 'Agility', date: new Date().toISOString().split('T')[0], time: '11:00 AM', assignedAthleteIds: ['1', '3'], mentorId: '4' },
    { id: 'session2', title: 'Strength Training', type: 'Strength', date: getFutureDate(2), time: '09:00 AM', assignedAthleteIds: ['1', '2'], mentorId: '4' },
    { id: 'session3', title: 'Endurance Run Prep', type: 'Endurance', date: getFutureDate(5), time: '05:00 PM', assignedAthleteIds: ['2', '3'], mentorId: '4' },
    { id: 'session4', title: 'Basketball Shooting Practice', type: 'Skill Specific', date: getFutureDate(3), time: '03:00 PM', assignedAthleteIds: ['1'], mentorId: '4' },
];

export const DRILLS_DATA: { [key: string]: Drill[] } = {
    Basketball: [
        { id: 'b1', name: 'Shooting Form Drills', category: 'Shooting', description: 'Practice form shooting from various spots close to the basket to build muscle memory.' },
        { id: 'b2', name: 'Mikan Drill', category: 'Finishing', description: 'A classic drill for improving touch and finishing around the rim with both hands.' },
        { id: 'b3', name: 'Defensive Slides', category: 'Defense', description: 'Practice staying low and moving laterally to improve on-ball defense.' },
        { id: 'b4', name: 'Cone Weaving', category: 'Dribbling', description: 'Dribble through a series of cones using various crossover and between-the-legs moves.' },
        { id: 'b5', name: 'Passing on the Move', category: 'Passing', description: 'Work with a partner to practice making accurate chest and bounce passes while running.' },
    ],
    Soccer: [
        { id: 's1', name: 'Foundation Touches', category: 'Ball Control', description: 'Rapidly tap the ball back and forth between the inside of your feet to improve touch.' },
        { id: 's2', name: 'Rondos (Keep Away)', category: 'Passing', description: 'A small group drill focusing on quick, accurate passing and decision-making under pressure.' },
        { id: 's3', name: 'Shooting from Distance', category: 'Shooting', description: 'Practice striking the ball cleanly from outside the 18-yard box.' },
        { id: 's4', name: '1v1 Defending', category: 'Defense', description: 'Focus on body positioning, patience, and timing when facing an attacker one-on-one.' },
    ],
    Running: [
        { id: 'r1', name: 'Hill Repeats', category: 'Strength', description: 'Run up a moderate incline for 30-60 seconds, then jog back down. Repeat for multiple sets.' },
        { id: 'r2', name: 'Interval Sprints', category: 'Speed', description: 'Alternate between high-intensity sprints (e.g., 400m) and recovery jogs.' },
        { id: 'r3', name: 'Tempo Run', category: 'Endurance', description: 'Run for a sustained period (20-30 mins) at a comfortably hard pace.' },
    ],
    Tennis: [
        { id: 't1', name: 'Serve and Volley', category: 'Net Play', description: 'Practice hitting a strong serve and immediately approaching the net for a volley.' },
        { id: 't2', name: 'Cross-Court Rallies', category: 'Consistency', description: 'Focus on hitting consistent deep shots to the opponent\'s cross-court corner.' },
    ],
     Cricket: [
        { id: 'c1', name: 'Net Practice (Batting)', category: 'Batting', description: 'Face a variety of bowlers in the nets to improve timing and shot selection.' },
        { id: 'c2', name: 'Target Bowling', category: 'Bowling', description: 'Set up cones on the pitch and practice bowling with accuracy to hit specific line and length.' },
    ],
};