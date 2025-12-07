// frontend/src/services/auth.ts
import api from './api';

const TOKEN_KEY = 'sosrota_token';
const USER_KEY = 'sosrota_user';

interface LoginResponse {
	success: boolean;
	token?: string;
	user?: any;
	message?: string;
}

// [Regras de Negocio - 1] Autenticacao de usuario
async function login(username: string, password: string): Promise<LoginResponse> {
	try {
		const resp = await api.post('/auth/login', { username, password });

		// O backend deve retornar { token, user } ou similar
		const token = resp.data.token;
		const user = resp.data.user || { username };

		if (!token) {
			return { success: false, message: 'Token não encontrado na resposta' };
		}

		localStorage.setItem(TOKEN_KEY, token);

		try {
			if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
		} catch {
			console.warn('Não foi possível salvar usuário no localStorage');
		}

		return {
			success: true,
			token,
			user: {
				username: user.username,
				email: user.email,
				role: user.role
			}
		};

	} catch (err: any) {
		const message = err?.response?.data?.message || err.message || 'Erro ao autenticar';
		return { success: false, message };
	}
}

async function register(username: string, email: string, password: string): Promise<LoginResponse> {
	try {
		const resp = await api.post('/auth/register', { username, email, password });

		const token = resp.data.token;
		const user = resp.data.user || { username, email };

		if (!token) {
			return { success: false, message: 'Token não encontrado na resposta' };
		}

		localStorage.setItem(TOKEN_KEY, token);

		try {
			if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
		} catch {
			console.warn('Não foi possível salvar usuário no localStorage');
		}

		return {
			success: true,
			token,
			user: {
				username: user.username,
				email: user.email,
				role: user.role || 'OPERADOR'
			}
		};
	} catch (err: any) {
		const message = err?.response?.data?.message || err.message || 'Erro ao cadastrar';
		return { success: false, message };
	}
}

function signOut(): void {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
}

function getStoredToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): any | null {
	try {
		const raw = localStorage.getItem(USER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export default {
	login,
	register,
	signOut,
	getStoredToken,
	getStoredUser,
};
