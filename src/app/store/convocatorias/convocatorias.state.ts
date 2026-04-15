export interface Institucion {
  id: string;
  nombre: string;
  ciudad: string | null;
  region: string | null;
  web: string | null;
}

export interface Beneficios {
  dotacion_detalle: string | null;
  estudio: string | null;
  alojamiento: string | null;
  manutencion: string | null;
}

export interface Convocatoria {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'convocatoria' | 'residencia' | 'beca' | 'concurso';
  disciplinas: string[];
  fecha_inicio: string | null;
  fecha_limite: string;
  dotacion: number | null;
  beneficios: Beneficios | null;
  duracion: string | null;
  requisitos: string | null;
  ciudad: string;
  region: string;
  pais: string;
  url_original: string | null;
  estado: 'pendiente' | 'publicada' | 'rechazada';
  origen: string;
  institucion_id: string | null;
  institucion: Institucion | null;
  fuente_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FiltrosConvocatorias {
  disciplinas: string[];
  tipos: string[];
  ciudad: string;
  region: string;
  estado: string;
  mes: string;
  anio: string;
}

export interface ConvocatoriasState {
  convocatorias: Convocatoria[];
  loading: boolean;
  error: string | null;
  filtros: FiltrosConvocatorias;
}

export const initialFiltros: FiltrosConvocatorias = {
  disciplinas: [],
  tipos: [],
  ciudad: '',
  region: '',
  estado: '',
  mes: '',
  anio: '',
};

export const initialConvocatoriasState: ConvocatoriasState = {
  convocatorias: [],
  loading: false,
  error: null,
  filtros: initialFiltros,
};
