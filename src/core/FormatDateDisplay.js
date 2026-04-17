const FormatDateDisplay = (date) => {
  if (!date || !(date instanceof Date)) {
    return "--/--/----";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export default FormatDateDisplay;
