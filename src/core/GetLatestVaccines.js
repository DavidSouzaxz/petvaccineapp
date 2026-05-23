/**
 * Agrupa vacinas pelo nome e retorna apenas a dose mais recente de cada uma
 * @param {Array} vaccinesList - Lista bruta de vacinas do backend
 * @returns {Array} Array contendo apenas a dose mais recente de cada vacina
 */
export const getLatestVaccines = (vaccinesList) => {
  if (!vaccinesList || vaccinesList.length === 0) return [];

  const latestMap = {};

  vaccinesList.forEach((vac) => {
    // Só processa vacinas aplicadas
    if (!vac.isApplied) return;

    const currentVacDate = new Date(vac.applicationDate);
    const existingVac = latestMap[vac.name];

    // Se não existir a vacina no mapa OU a vacina atual for mais recente que a salva, substitui
    if (
      !existingVac ||
      currentVacDate > new Date(existingVac.applicationDate)
    ) {
      latestMap[vac.name] = vac;
    }
  });

  // Retorna um array apenas com as últimas doses de cada vacina
  return Object.values(latestMap);
};
