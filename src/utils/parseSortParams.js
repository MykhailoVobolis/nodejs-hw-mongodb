import { sortOrderList } from '../constants/index.js';

export const parseSortParams = ({ sortOrder, sortBy }, fieldList) => {
  // Перевірка чи вказаний при запиті порядок сортування відповідає одному з заданих
  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];
  // Перевірка чи вказана при запиті властивість за якою потрібно сортувати відповідає одній з заданих
  const parsedSortBy = fieldList.includes(sortBy) ? sortBy : fieldList[0];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
