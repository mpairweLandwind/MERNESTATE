import i18n from 'i18next';
import { initReactI18next } from '../node_modules/react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector/cjs';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // disabled in production
    debug: false,
    // can have multiple namespaces, in case you want to divide a huge
		// translation into smaller pieces and load them on demand
		ns: ["common", "home", "profile","footer"],

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      // translation file path
			loadPath: "/assets/i18n/{{ns}}/{{lng}}.json",
    },
  });

export default i18n;
