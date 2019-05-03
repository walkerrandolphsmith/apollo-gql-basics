import get from 'lodash.get';
import isFunction from 'lodash.isfunction';
import en from './en';

const map = {
  en,
};

export const buildLocalizer = (langMap = map) => (langCode, isProduction = true) => {
  const chooseLanguage = (lang = 'en') => langMap[lang] || en;

  const language = chooseLanguage(langCode);

  return (path, values) => {
    const expression = get(language, path);
    // No runtime errors, but we also might not catch the issue
    if (!expression) {
      return !isProduction
        ? `${langCode} --- ${path} --- this path is not localized`
        : '';
    }
    return isFunction(expression) ? expression(values) : expression;
  };
};
