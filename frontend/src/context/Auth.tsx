import React, { useEffect, useState } from 'react';
import authService from '../services/auth';
import AuthContext, { AuthContextType } from './AuthContext';

// Initialize user synchronously from storage to avoid calling setState in effect
const initialUser = authService.getStoredUser();

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<any | null>(initialUser || null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const token = authService.getStoredToken();
		if (token) {
			authService.setAuthToken(token);
			// user already initialized from storage
		}
		// small delay not necessary; loading false ensures consumers render
	}, []);

	async function signIn(username: string, password: string): Promise<any> {
			setLoading(true);
			const result = await authService.login(username, password);
		if (result.success) {
			setUser(result.user || null);
		}
			setLoading(false);
		return result;
	}

	function signOut(): void {
		authService.signOut();
		setUser(null);
	}

	const value: AuthContextType = {
		signed: !!user,
		user,
		loading,
		signIn,
		signOut
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
