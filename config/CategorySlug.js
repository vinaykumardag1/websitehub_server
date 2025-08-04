export const generateSlug = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};
