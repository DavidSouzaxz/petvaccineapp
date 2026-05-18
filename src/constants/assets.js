/**
 * Constantes de imagens/assets utilizadas no app
 * Centralizando todos os require de imagens para fácil manutenção
 */

export const ASSETS = {
  // HomeScreen
  dogProfile: require("../../assets/dogProfile.png"),
  clinicReminder: require("../../assets/clinic.png"),
  petCard: require("../../assets/petcard.png"),

  // Adicione aqui outras imagens conforme necessário
};

/**
 * Função utilitária para obter uma imagem por chave
 * @param {string} key - Chave da imagem
 * @returns {*} - Require da imagem
 */
export const getAsset = (key) => {
  return ASSETS[key] || null;
};
