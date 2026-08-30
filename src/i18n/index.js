import { translations } from "./translations.js";

const STORAGE_KEY = "amadeo-portfolio-language";
const supportedLanguages = ["en", "fr"];

export function createI18n() {
  let language = getInitialLanguage();

  function translate(key) {
    return key.split(".").reduce((value, part) => value?.[part], translations[language]) ?? key;
  }

  return {
    t: translate,
    get language() {
      return language;
    },
    setLanguage(nextLanguage) {
      if (!supportedLanguages.includes(nextLanguage)) return;
      language = nextLanguage;
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    },
  };
}

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem(STORAGE_KEY);
  if (supportedLanguages.includes(storedLanguage)) return storedLanguage;

  return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}
