import { useTranslation } from 'react-i18next';

export function useTranslate(): (k: string) => string {
  const { t, ready } = useTranslation();
  return (k: string) => (ready ? t(k) : k);
}
