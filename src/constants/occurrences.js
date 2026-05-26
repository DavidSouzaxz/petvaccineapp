/**
 * Constantes de ocorrências (sintomas/eventos de pets)
 * Utilizadas em OcurrenceRegistrationScreen, OcurrenceEditScreen e OccurrencesScreen
 */

/**
 * Tipos de ocorrências que podem ser registradas
 */
export const OCCURRENCE_TYPES = [
  { id: "VOMITING", label: "Vômito" },
  { id: "REDUCE_APPETITE", label: "Apetite Reduzido" },
  { id: "HECTIC", label: "Muito Agitado" },
  { id: "HAIR_FALLING", label: "Pelo Caindo" },
  { id: "LOOSE_STOOLS", label: "Fezes Amolecidas" },
  { id: "EXCESSIVE_LICKING", label: "Lambedura Excessiva" },
];

/**
 * Filtros disponíveis na listagem de ocorrências
 */
export const OCCURRENCE_FILTERS = [
  { id: "all", label: "Todas", icon: "th-large" },
  { id: "VOMITING", label: "Vômito", icon: "water" },
  { id: "REDUCE_APPETITE", label: "Apetite Reduzido", icon: "drumstick-bite" },
  { id: "HECTIC", label: "Muito Agitado", icon: "bolt" },
  { id: "HAIR_FALLING", label: "Pelo Caindo", icon: "leaf" },
  { id: "LOOSE_STOOLS", label: "Fezes Amolecidas", icon: "poop" },
  {
    id: "EXCESSIVE_LICKING",
    label: "Lambedura Excessiva",
    icon: "paw",
  },
];

/**
 * Cores e ícones para cada tipo de ocorrência
 * Utilizados para visual diferenciado na listagem
 */
export const OCCURRENCE_TYPE_COLORS = {
  HAIR_FALLING: { accent: "#7922ac", badge: "#f5e3ff", icon: "leaf" },
  VOMITING: { accent: "#3A7BD5", badge: "#E7F0FB", icon: "water" },
  REDUCE_APPETITE: {
    accent: "#3A7BD5",
    badge: "#E7F0FB",
    icon: "apple",
  },
  HECTIC: { accent: "#3A7BD5", badge: "#E7F0FB", icon: "bolt" },
  LOOSE_STOOLS: { accent: "#d15e31", badge: "#fce6dd", icon: "poop" },
  EXCESSIVE_LICKING: { accent: "#D0A44B", badge: "#FFF6DD", icon: "paw" },
};

/**
 * Obtém a cor e ícone para um tipo de ocorrência
 * @param {string} type - ID do tipo de ocorrência
 * @returns {object} - Objeto com accent, badge e icon
 */
export const getOccurrenceColor = (type) => {
  return OCCURRENCE_TYPE_COLORS[type] || OCCURRENCE_TYPE_COLORS.VOMITING;
};

/**
 * Obtém o rótulo de um tipo de ocorrência
 * @param {string} id - ID do tipo
 * @returns {string} - Rótulo do tipo
 */
export const getOccurrenceLabel = (id) => {
  const found = OCCURRENCE_TYPES.find((item) => item.id === id);
  return found ? found.label : "Desconhecido";
};
