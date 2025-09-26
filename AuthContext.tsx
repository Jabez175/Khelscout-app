import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type User, UserRole } from './types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (role: UserRole, sport?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a mock API call. Replace with your actual API endpoint.
const fetchUserByRole = async (role: UserRole, token: string, sport?: string): Promise<User> => {
    console.log("Fetching user for role with token:", role, token);
    // In a real app, you would fetch the user profile from your backend
    // using the provided auth token.
    const dummyUsers: Partial<Record<UserRole, Omit<User, 'sport'>>> = {
        [UserRole.ATHLETE]: { 
            id: '1', 
            name: 'Ethan Carter', 
            role: UserRole.ATHLETE, 
            avatarUrl: 'https://picsum.photos/seed/ethan/200', 
            joinedYear: 2021, 
            specialization: 'Professional Athlete',
            saiScores: { 
                height: { score: 188, unit: 'cm', verified: true }, 
                weight: { score: 82, unit: 'kg', verified: true }, 
                sitAndReach: { score: 15, unit: 'cm', verified: true }, 
                standingVerticalJump: { score: 62, unit: 'cm', verified: true }, 
                standingBroadJump: { score: 270, unit: 'cm', verified: true }, 
                medicineBallThrow: { score: 14, unit: 'm', verified: true }, 
                standingStart30m: { score: 4.1, unit: 's', verified: true }, 
                shuttleRun4x10: { score: 9.5, unit: 's', verified: true }, 
                sitUps: { score: 58, unit: 'reps', verified: true }, 
                enduranceRun: { score: 530, unit: 's', verified: true } 
            }
        },
        [UserRole.MENTOR]: { id: '4', name: 'Coach Alex', role: UserRole.MENTOR, avatarUrl: 'https://picsum.photos/seed/alex/200', specialization: 'Basketball Coach' },
        [UserRole.ORGANIZATION]: { id: '5', name: 'Global Sports Org', role: UserRole.ORGANIZATION, avatarUrl: 'https://picsum.photos/seed/orgo/200', specialization: 'Talent Identification' },
    };
    
    const baseUser = dummyUsers[role];
    if (!baseUser) {
        throw new Error(`Invalid role specified: ${role}`);
    }
    
    const user: User = {
        ...baseUser,
        sport: sport || (role === UserRole.ATHLETE ? 'Basketball' : undefined)
    };

    return new Promise(resolve => setTimeout(() => resolve(user), 500));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    // TODO: Replace with an actual API call to /api/auth/me or /api/profile
                    // to get user data based on the stored token.
                    const userRole = localStorage.getItem('userRole') as UserRole | null;
                    if (!userRole || !Object.values(UserRole).includes(userRole)) {
                        logout();
                        return;
                    }

                    const userSport = localStorage.getItem('userSport') || undefined;
                    const userData = await fetchUserByRole(userRole, token, userSport);
                    setUser(userData);
                } catch (error) {
                    console.error("Token validation failed", error);
                    logout();
                }
            }
            setLoading(false);
        };
        validateToken();
    }, [token]);

    const login = async (role: UserRole, sport?: string) => {
        // TODO: Replace with a real API call to POST /api/auth/login
        // which would return a token and user data.
        const mockToken = `fake-token-for-${role}`;
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userRole', role); // Mock role storage
        if (sport) {
            localStorage.setItem('userSport', sport);
        } else {
             localStorage.removeItem('userSport');
        }
        setToken(mockToken);
        // The useEffect will handle fetching the user data.
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userSport');
    };

    if (loading) {
        return <div className="bg-[#0D1A18] h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};