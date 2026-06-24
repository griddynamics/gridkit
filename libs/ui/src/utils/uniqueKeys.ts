export const generateUniqueId = (id: string | number = 'uid', prefix = 'prefix'): string => {
  return `${prefix}-${id}`;
};
