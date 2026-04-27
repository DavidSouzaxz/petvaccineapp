

export const validateDate = (dateStr) => {

  if (!dateStr || dateStr.length < 10) return "Data incompleta.";

  const [day, month, year] = dateStr.split('/').map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return "Data em formato inválido.";

  if (year < 2006) return "O ano deve ser igual ou maior que 2006.";
  if (year > 2100) return "Ano inválido.";
  if (month < 1 || month > 12) return "Mês inválido (01-12).";
  if (day < 1 || day > 31) return "Dia inválido (01-31).";

  return null;
};

export const validateTime = (timeStr) => {

  if (!timeStr || timeStr.length < 5) return "Hora incompleta.";

  const [hour, minute] = timeStr.split(':').map(Number);

  if (isNaN(hour) || isNaN(minute)) return "Hora em formato inválido.";

  if (hour < 0 || hour > 23) return "Hora inválida (00-23).";
  if (minute < 0 || minute > 59) return "Minuto inválido (00-59).";

  return null;
};