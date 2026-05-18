/**
 * Status de vacinação dos pets
 * Utilizados em HomeScreen, DetailsScreen e outros componentes
 */

export const PET_STATUS = [
  {
    label: "Em dia",
    color: "#2E7D32",
    backgroundColor: "#E9F7EE",
    icon: "checkmark-circle",
  },
  {
    label: "Atenção",
    color: "#C88719",
    backgroundColor: "#FFF4E0",
    icon: "alert-circle",
  },
  {
    label: "Atrasado",
    color: "#C62828",
    backgroundColor: "#FCE9E9",
    icon: "close-circle",
  },
];

/**
 * Mapa de status detalhado por rótulo
 * Facilita buscar status específico por nome
 */
export const STATUS_MAP = {
  "Em dia": PET_STATUS[0],
  Atenção: PET_STATUS[1],
  Atrasado: PET_STATUS[2],
  Atencao: PET_STATUS[1], // Alternativa sem acento
};
