/**
 * Agrupa vacinas pelo nome e retorna apenas a dose mais recente de cada uma
 * @param {Array} vaccinesList - Lista bruta de vacinas do backend
 * @returns {Array} Array contendo apenas a dose mais recente de cada vacina
 */
export const getLatestVaccines = (vaccinesList) => {
  if (!vaccinesList || vaccinesList.length === 0) return [];

  const latestMap = {};

  vaccinesList.forEach((vac) => {
    const dateProp = vac.applicationDate || vac.nextApplicationDate;
    if (!dateProp) return;

    const currentVacDate = new Date(dateProp.replace(" ", "T"));
    const existingVac = latestMap[vac.name];

    if (!existingVac) {
      latestMap[vac.name] = vac;
    } else {
      const existingDateProp =
        existingVac.applicationDate || existingVac.nextApplicationDate;
      const existingVacDate = new Date(existingDateProp.replace(" ", "T"));

      if (currentVacDate > existingVacDate) {
        latestMap[vac.name] = vac;
      }
    }
  });

  return Object.values(latestMap);
};
