// MNEME Multilingual Language Registry
// Extensible list of supported interface/narration languages. Do not assume every speech provider supports every language.

export const SUPPORTED_LANGUAGES = [
  { code: 'en', bcp47: 'en-US', name: 'English', nativeName: 'English', speechLocale: 'en-US', dir: 'ltr' },
  { code: 'hi', bcp47: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN', dir: 'ltr' },
  { code: 'bn', bcp47: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN', dir: 'ltr' },
  { code: 'ta', bcp47: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN', dir: 'ltr' },
  { code: 'te', bcp47: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN', dir: 'ltr' },
  { code: 'mr', bcp47: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN', dir: 'ltr' },
  { code: 'gu', bcp47: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN', dir: 'ltr' },
  { code: 'kn', bcp47: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN', dir: 'ltr' },
  { code: 'ml', bcp47: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN', dir: 'ltr' },
  { code: 'pa', bcp47: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechLocale: 'pa-IN', dir: 'ltr' },
  { code: 'or', bcp47: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechLocale: 'or-IN', dir: 'ltr' },
  { code: 'as', bcp47: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া', speechLocale: 'as-IN', dir: 'ltr' },
  { code: 'ur', bcp47: 'ur-IN', name: 'Urdu', nativeName: 'اردو', speechLocale: 'ur-PK', dir: 'rtl' },
  { code: 'bho', bcp47: 'bho-IN', name: 'Bhojpuri', nativeName: 'भोजपुरी', speechLocale: 'hi-IN', dir: 'ltr' }
];

export function getLanguageByCode(code) {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}

export function isRtlLanguage(code) {
  return getLanguageByCode(code).dir === 'rtl';
}
