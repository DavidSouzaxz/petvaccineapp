/**
 * Arquivo de índice para constantes
 * Permite importação limpa e centralizada de todas as constantes
 *
 * Uso:
 * import { PET_MESSAGES, VACCINE_SUGGESTIONS, OCCURRENCE_DESCRIPTIONS } from '@constants'
 */

export { PET_MESSAGES } from "./petMessages";
export { PET_STATUS, STATUS_MAP } from "./petStatus";
export { VACCINE_STATUS, VACCINE_STATUS_MAP } from "./vaccineStatus";
export {
  SPECIES_IMAGES,
  SPECIES_OPTIONS,
  AVAILABLE_SPECIES,
  getSpeciesImage,
  getPetImage,
} from "./species";
export { ASSETS, getAsset } from "./assets";
export {
  OCCURRENCE_TYPES,
  OCCURRENCE_FILTERS,
  OCCURRENCE_TYPE_COLORS,
  getOccurrenceColor,
  getOccurrenceLabel,
} from "./occurrences";
export { FEELING_EMOJIS, FEELING_LIST, getFeeling } from "./feelings";
export {
  VACCINE_SUGGESTIONS,
  SEVERITY_MAP,
  OCCURRENCE_DESCRIPTIONS,
  getOccurrenceDescription,
  getSeverityDots,
} from "./vaccines";
