/**
 * Status de sensação/sentimento do pet em ocorrências
 * Utilizados em OccurrenceDetailsScreen para registro de bem-estar
 */

export const FEELING_EMOJIS = {
  NORMAL: { emoji: "😊", label: "Normal", color: "#44c564" },
  APATHETIC: { emoji: "😐", label: "Apático", color: "#999999" },
  ANXIOUS: { emoji: "😟", label: "Inquieto", color: "#9A9A9A" },
  ANGRY: { emoji: "😠", label: "Enjôado", color: "#F4A361" },
  VERY_BAD: { emoji: "😢", label: "Muito mal", color: "#999999" },
};

/**
 * Lista de sentimentos disponíveis
 */
export const FEELING_LIST = Object.values(FEELING_EMOJIS);

/**
 * Obtém emoji e cor para um sentimento
 * @param {string} feeling - ID do sentimento
 * @returns {object} - Objeto com emoji, label e color
 */
export const getFeeling = (feeling) => {
  return FEELING_EMOJIS[feeling] || FEELING_EMOJIS.NORMAL;
};
