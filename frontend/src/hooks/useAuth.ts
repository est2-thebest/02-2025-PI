import { useContext } from 'react';
import AuthContext, { AuthContextType } from '../context/AuthContext';

/**
 * Hook para acesso ao contexto de autenticação.
 * Controle de Sessão.
 */
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

export default useAuth;
