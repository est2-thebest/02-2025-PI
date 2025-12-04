// frontend/src/context/AuthContext.ts
import { createContext } from 'react';

export interface AuthContextType {
  signed: boolean;
  user: any | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<any>;
  signUp: (username: string, email: string, password: string) => Promise<any>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
