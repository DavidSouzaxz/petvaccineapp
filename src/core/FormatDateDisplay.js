const FormatDateDisplay = (dateInput) => {
  // Se for string, tentamos converter para um objeto Date
  let date = dateInput;
  if (typeof date === "string") {
    // replace(" ", "T") ajuda o JavaScript a entender o formato de data/hora
    date = new Date(date.replace(" ", "T"));
  }

  // Verifica se o resultado é uma data válida
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "--/--/----";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const FormatDateForRequisition = (dateInput) => {
  let date = dateInput;
  if (date && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }
  return date;
};

export default FormatDateDisplay;
export { FormatDateForRequisition };
