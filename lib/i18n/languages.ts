// Plain module (no React): shared by the client context, pure helpers and API routes.
export const LANGUAGES = ['fr', 'ar', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  fr: 'Français',
  ar: 'العربية',
  en: 'English',
};

export const isLanguage = (value: string | null | undefined): value is Language =>
  LANGUAGES.includes(value as Language);

export const dirOf = (language: Language): 'ltr' | 'rtl' => (language === 'ar' ? 'rtl' : 'ltr');
