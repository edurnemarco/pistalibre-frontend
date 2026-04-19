export interface Alerta {
  id: string;
  usuario_id: string;
  convocatoria_id: string;
  dias_antes: number;
  notificado_email: boolean;
  created_at: string;
  updated_at: string;
  convocatoria?: any;
}

export interface AlertasState {
  alertas: Alerta[];
  loading: boolean;
  error: string | null;
}

export const initialAlertasState: AlertasState = {
  alertas: [],
  loading: false,
  error: null,
};
