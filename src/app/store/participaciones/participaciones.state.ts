export interface Participacion {
  id: string;
  usuario_id: string;
  convocatoria_id: string;
  resultado: string;
  nombre_proyecto: string;
  descripcion_proyecto: string;
  imagen_url: string;
  imagenes: string[];
  institucion_nombre: string;
  lugar: string;
  año: number;
  enlaces: string[];
  created_at: string;
  updated_at: string;
  convocatoria?: any;
  convocatoria_nombre: string;
}

export interface ParticipacionesState {
  participaciones: Participacion[];
  loading: boolean;
  error: string | null;
}

export const initialParticipacionesState: ParticipacionesState = {
  participaciones: [],
  loading: false,
  error: null,
};
