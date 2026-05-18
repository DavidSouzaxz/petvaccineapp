/**
 * Imagens de espécies de animais
 * Mapeia espécies (Cachorro, Gato, etc) para suas imagens padrão
 */

export const SPECIES_IMAGES = {
  Cachorro: require("../../assets/dogProfile.png"),
  Gato: require("../../assets/cat.png"),
  Coelho: require("../../assets/coelho.png"),
  Passaro: require("../../assets/bird.png"),
  Hamster: require("../../assets/hamster.png"),
  Peixe: require("../../assets/fish.png"),
};

/**
 * Opções de espécies para seleção em forms (AddPetScreen, EditPetScreen)
 */
export const SPECIES_OPTIONS = [
  { label: "Cachorro", icon: "dog" },
  { label: "Gato", icon: "cat" },
  { label: "Coelho", icon: "paw" },
  { label: "Passaro", icon: "dove" },
  { label: "Hamster", icon: "paw" },
  { label: "Peixe", icon: "fish" },
];

/**
 * Lista de espécies disponíveis no app
 */
export const AVAILABLE_SPECIES = Object.keys(SPECIES_IMAGES);

/**
 * Obtém a imagem padrão de uma espécie
 * @param {string} species - Nome da espécie
 * @returns {*} - Require da imagem
 */
export const getSpeciesImage = (species) => {
  return SPECIES_IMAGES[species] || SPECIES_IMAGES.Cachorro;
};

/**
 * Obtém a imagem de um pet (URL do upload ou padrão da espécie)
 * @param {string} photoUrl - URL da foto do pet (opcional)
 * @param {string} species - Espécie do pet (padrão: Cachorro)
 * @returns {object} - Objeto com uri ou require
 */
export const getPetImage = (photoUrl, species = "Cachorro") => {
  if (photoUrl) {
    return { uri: photoUrl };
  }
  return getSpeciesImage(species);
};
