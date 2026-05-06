const FormatDateDisplay = (dateInput) => {
  let date = dateInput;
  if (typeof date === "string") {
    date = new Date(date);
  }

  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "--/--/----";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const FormatDateTimeDisplay = (dateInput) => {
  let date = dateInput;
  if (typeof date === "string") {
    date = new Date(date);
  }

  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "--/--/---- • --:--";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
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
