import {
  SPECIES_IMAGES,
  getSpeciesImage as getSpeciesImageFromConstants,
  getPetImage as getPetImageFromConstants,
  AVAILABLE_SPECIES,
} from "../constants/species";

// Re-export para manter compatibilidade com imports existentes
export { AVAILABLE_SPECIES };

export const SPECIES_IMAGES_LOCAL = SPECIES_IMAGES;

export const getSpeciesImage = getSpeciesImageFromConstants;

export const getPetImage = getPetImageFromConstants;
