// frontend/src/context/Auth.tsx
import React, { useState } from 'react';
import authService from '../services/auth';
import AuthContext, { AuthContextType } from './AuthContext';

// Inicializar usuário do localStorage
const initialUser = authService.getStoredUser();

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<any | null>(initialUser || null);
	const [loading, setLoading] = useState<boolean>(false);

	// Função logar
	async function signIn(username: string, password: string): Promise<any> {
			setLoading(true);

			try {
				const result = await authService.login(username, password);
				
				if (result.success) {
					setUser(result.user);
				}

				return result;
			} finally {
				setLoading(false);
			}
	}

	// Função cadastrar
	async function signUp(username: string, email: string, password: string): Promise<any> {
		setLoading(true);

		try {
			const result = await authService.register(username, email, password);
			
			if (result.success) {
				setUser(result.user);
			}

			return result;
		} finally {
			setLoading(false);
		}
	}

	// Função sair/deslogar
	function signOut(): void {
		authService.signOut();
		setUser(null);
	}

	const value: AuthContextType = {
		signed: !!user,
		user,
		loading,
		signIn,
		signUp,
		signOut
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
