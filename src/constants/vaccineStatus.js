/**
 * Status de vacinação detalhado (para DetailsScreen e componentes de vacina)
 * Baseado na aplicação e datas de vacinas individuais
 */

export const VACCINE_STATUS = {
  APPLIED: {
    label: "Aplicada",
    color: "#2E7D32",
    backgroundColor: "#E9F7EE",
    icon: "checkmark-circle",
  },
  PENDING: {
    label: "Atencao",
    color: "#C88719",
    backgroundColor: "#FFF4E0",
    icon: "time",
  },
  OVERDUE: {
    label: "Atrasada",
    color: "#C62828",
    backgroundColor: "#FCE9E9",
    icon: "alert-circle",
  },
};

/**
 * Mapa de status por label para busca rápida
 */
export const VACCINE_STATUS_MAP = {
  Aplicada: VACCINE_STATUS.APPLIED,
  Atencao: VACCINE_STATUS.PENDING,
  Atrasada: VACCINE_STATUS.OVERDUE,
  "Em dia": VACCINE_STATUS.APPLIED,
};
