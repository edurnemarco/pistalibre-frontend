export interface Favorito {
  id: string;
  usuario_id: string;
  convocatoria_id: string;
  created_at: string;
  updated_at: string;
  convocatoria?: any;
}

export interface FavoritosState {
  favoritos: Favorito[];
  loading: boolean;
  error: string | null;
}

export const initialFavoritosState: FavoritosState = {
  favoritos: [],
  loading: false,
  error: null,
};
