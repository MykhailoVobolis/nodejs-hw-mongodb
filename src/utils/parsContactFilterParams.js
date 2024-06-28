import { typeList } from '../constants/contacts-constants.js';

// сервісна функція перевірки чи isFavourite є boolean
const parseBoolean = (value) => {
  // перевірка чи є передане значення строкою
  if (typeof value !== 'string') return;
  // перевірка чи є передане значення true або false
  if (!['true', 'false'].includes(value)) return;

  // перетворення строки value на boolean
  const parsedValue = JSON.parse(value);

  return parsedValue;
};

export const parsContactFilterParams = ({ contactType, isFavourite }) => {
  const parsedType = typeList.includes(contactType) ? contactType : null;
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
