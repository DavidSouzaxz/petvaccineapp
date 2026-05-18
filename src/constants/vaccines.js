/**
 * Nomes e sugestões de vacinas
 * Utilizadas em AddVaccineScreen e EditVaccineScreen
 */

export const VACCINE_SUGGESTIONS = [
  "Antirrábica",
  "V10",
  "V8",
  "Gripe Canina",
  "Giárdia",
  "Leishmaniose",
  "V4 Felina",
  "Leucemia Felina",
  "Raiva",
  "Outra...",
];

/**
 * Mapa de severidade (para ocorrências)
 * Converte ID de severidade para número de dots
 */
export const SEVERITY_MAP = {
  LIGHT: 1,
  MODERATE: 2,
  SEVERE: 3,
};

/**
 * Descrições educativas para cada tipo de ocorrência
 * Exibidas em OccurrenceDetailsScreen
 */
export const OCCURRENCE_DESCRIPTIONS = {
  VOMITING:
    "Vômitos podem ocorrer por comer rápido, mudança de alimentação, intolerância alimentar, bolas de pelo ou outros fatores. Se persistir, consulte o veterinário.",
  REDUCE_APPETITE:
    "A redução de apetite pode ser causada por estresse, mudanças na alimentação ou problemas de saúde. Observe por mais alguns dias e consulte um veterinário se persistir.",
  HECTIC:
    "A agitação excessiva pode indicar falta de exercício, estresse ou desconforto. Tente aumentar as atividades físicas e observar o comportamento.",
  LOOSE_STOOLS:
    "Fezes amolecidas podem ser causadas por mudança na alimentação, parasitas ou problemas digestivos. Mantenha o pet hidratado e observe.",
  HAIR_FALLING:
    "A queda de pelos pode ocorrer por stress, alergias, parasitas ou mudanças sazonais. Consulte o veterinário se a queda for excessiva.",
  EXCESSIVE_LICKING:
    "O lambimento excessivo pode indicar coceira, alergias ou comportamento compulsivo. Observe a área e consulte um veterinário se necessário.",
};

/**
 * Obtém descrição para um tipo de ocorrência
 * @param {string} type - ID do tipo
 * @returns {string} - Descrição do tipo
 */
export const getOccurrenceDescription = (type) => {
  return (
    OCCURRENCE_DESCRIPTIONS[type] ||
    "Consulte um veterinário para mais informações."
  );
};

/**
 * Obtém número de dots para um nível de severidade
 * @param {string} severity - ID da severidade
 * @returns {number} - Número de dots (1-3)
 */
export const getSeverityDots = (severity) => {
  return SEVERITY_MAP[severity] || 1;
};
