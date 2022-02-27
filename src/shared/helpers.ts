import axios from 'axios';
import validator from 'validator';

export const isNonEmptyString = (s) => s && typeof s === 'string';

export const validateEmail = (str: string) => {
  return validator.isEmail(str);
};

export const validateIsProfileURL = (url: string) => {
  return (
    url === '' ||
    validator.isURL(url, {
      protocols: ['https'],
    })
  );
};

export const validateImageContentType = async (url: string) => {
  try {
    if (validator.isURL(url)) {
      const res = await axios.head(url, { timeout: 4000 });
      const type = res.headers['content-type'];
      if (type !== 'image/png' && type !== 'image/jpeg') {
        throw new Error('invalid image link');
      } else {
        return true;
      }
    }
  } catch (e) {
    return false;
  }
};

export abstract class dtoPutBase {
  constructor() {}

  // makes validators easier to write
  omits(str) {
    return !this.hasOwnProperty(str);
  }

  abstract isValid(): boolean;
}
