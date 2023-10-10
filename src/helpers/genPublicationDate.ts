const getDate = (date: Date): string => {
  const gDate = date.getDate();
  return String(gDate);
};

const getMonth = (date: Date): string => {
  const gMonth = date.getMonth() + 1;
  return String(gMonth);
};

const getYear = (date: Date): string => {
  const gYear = date.getFullYear();
  return String(gYear);
};

export const genPublicationDate = (date: Date): string => {
  const givenDate = new Date(date);

  const dDate = getDate(givenDate);
  const dMonth = getMonth(givenDate);
  const dYear = getYear(givenDate);

  const finalDateString = `${dYear}-${dMonth}-${dDate}`;

  return finalDateString;
};
