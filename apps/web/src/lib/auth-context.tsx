'use client';
import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import apiClient from './api-client';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async() => {
        try{
            const {data} = await apiClient.get('/auth/me');
            setUser(data);
        } catch{
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {fetchUser(); }, []);

    const login = async(email: string, password: string) => {
        const {data} = await apiClient.post('/auth/login', {email, password});
        setUser(data.user);
    };

    const register = async(email: string, password: string, name?: string) => {
        const {data} = await apiClient.post('/auth/register', {email, password, name});
        setUser(data.user);
    };

    const logout = async() => {
        await apiClient.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
