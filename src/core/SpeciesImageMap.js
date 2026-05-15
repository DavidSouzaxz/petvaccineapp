export const SPECIES_IMAGES = {
  Cachorro: require("../../assets/dogProfile.png"),
  Gato: require("../../assets/cat.png"),
  Coelho: require("../../assets/coelho.png"),
  Passaro: require("../../assets/bird.png"),
  Hamster: require("../../assets/hamster.png"),
  Peixe: require("../../assets/fish.png"),
};

export const getSpeciesImage = (species) => {
  return SPECIES_IMAGES[species] || SPECIES_IMAGES.Cachorro;
};

export const getPetImage = (photoUrl, species = "Cachorro") => {
  if (photoUrl) {
    return { uri: photoUrl };
  }
  return getSpeciesImage(species);
};
