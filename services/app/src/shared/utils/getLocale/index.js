const getLocale = navigator => {
  const language =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

  const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

  return {
    language,
    languageWithoutRegionCode,
    fallback: 'en',
  };
};
