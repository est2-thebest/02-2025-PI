import api from './api';

const TOKEN_KEY = 'sosrota_token';
const USER_KEY = 'sosrota_user';

interface LoginResponse {
	success: boolean;
	token?: string;
	user?: any;
	message?: string;
}

async function login(username: string, password: string): Promise<LoginResponse> {
	try {
		const resp = await api.post('/auth/login', { username, password });

		// backend may return { token, user } or { accessToken, user } or other shape
		const token = resp.data.token || resp.data.accessToken || resp.data.jwt;
		const user = resp.data.user || resp.data.userDto || resp.data;

		if (!token) {
			return { success: false, message: 'Resposta de autenticação inválida' };
		}

		localStorage.setItem(TOKEN_KEY, token);
		try {
			if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
			} catch {
				// ignore non-serializable user
			}

		setAuthToken(token);

		return { success: true, token, user };
		} catch (err: any) {
			const message = err?.response?.data?.message || err.message || 'Erro ao autenticar';
			return { success: false, message };
		}
}

function setAuthToken(token: string | null): void {
	if (token) {
		api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.common['Authorization'];
	}
}

function signOut(): void {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
	setAuthToken(null);
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
	setAuthToken,
	signOut,
	getStoredToken,
	getStoredUser,
};
