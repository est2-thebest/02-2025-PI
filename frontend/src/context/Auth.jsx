import React, { useEffect, useState } from 'react';
import authService from '../services/auth';
import AuthContext from './AuthContext';

// Initialize user synchronously from storage to avoid calling setState in effect
const initialUser = authService.getStoredUser();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(initialUser || null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const token = authService.getStoredToken();
		if (token) {
			authService.setAuthToken(token);
			// user already initialized from storage
		}
		// small delay not necessary; loading false ensures consumers render
	}, []);

	async function signIn(username, password) {
			setLoading(true);
			const result = await authService.login(username, password);
		if (result.success) {
			setUser(result.user || null);
		}
			setLoading(false);
		return result;
	}

	function signOut() {
		authService.signOut();
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
