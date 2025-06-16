export const valideUrlCovert = (name) => {
  const str = name.toString();
  return str.replace(/[ ,&]/g, "-");
};
