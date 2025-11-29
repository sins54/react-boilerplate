import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

/**
 * Supported languages configuration
 */
export const supportedLanguages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
] as const;

export const supportedLanguageCodes = supportedLanguages.map((l) => l.code);

/**
 * Available namespaces for translations
 */
export const namespaces = ["common", "auth", "validation", "dashboard", "demo"] as const;

export type SupportedLanguage = (typeof supportedLanguageCodes)[number];
export type Namespace = (typeof namespaces)[number];

/**
 * Initialize i18next with:
 * - HTTP backend to load translations from public/locales/{lang}/{ns}.json
 * - Language detection (localStorage -> navigator -> fallback)
 * - React-i18next integration
 */
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Default and fallback language
    fallbackLng: "en",

    // Supported languages
    supportedLngs: supportedLanguageCodes,

    // Default namespace
    defaultNS: "common",

    // Available namespaces
    ns: [...namespaces],

    // Language detection options
    detection: {
      // Order of detection methods
      order: ["localStorage", "navigator", "htmlTag"],
      // Key to store language in localStorage
      lookupLocalStorage: "i18nextLng",
      // Cache user language
      caches: ["localStorage"],
    },

    // Backend configuration for loading translation files
    backend: {
      // Path to load translations from
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    // Interpolation settings
    interpolation: {
      // React already escapes by default
      escapeValue: false,
    },

    // React-i18next specific options
    react: {
      // Use Suspense for loading
      useSuspense: true,
    },
  });

export default i18n;
