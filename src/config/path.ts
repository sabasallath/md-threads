export const href = (): string => {
  return process.env.REACT_APP_BASE_HREF || '/';
};

export const i18nJsonUrl = (): string => {
  return `${href()}locales/{{lng}}/{{ns}}.json`;
};
