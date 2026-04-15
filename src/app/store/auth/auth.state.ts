export interface User {
  id: string;
  nombre: string;
  email: string;
  tipo: 'artista' | 'institucion' | 'admin';
  ciudad: string | null;
  region: string | null;
  pais: string;
  bio: string | null;
  avatar_url: string | null;
  web: string | null;
  redes: string | null;
  activo: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};
