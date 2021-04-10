export const href = (): string => {
  return ((window as unknown) as Record<string, string>).BASE_HREF;
};

export const i18nJsonUrl = (): string => {
  return `${href()}locales/{{lng}}/{{ns}}.json`;
};
