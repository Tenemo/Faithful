var i18n = require('i18next');
var backend = require('i18next-node-fs-backend');
var i18nmiddleware = require('i18next-express-middleware');
var util = require('util');
var express = require('express');
var router = express.Router();

var translatedLanguages = [
    'pl',
    'en',
    'ru',
];
var fallbacks = {
    'default': ['pl'],
    'de': ['en'],
    'fr': ['en'],
    'es': ['en'],
    'zh': ['en'],
    'it': ['en'],
    'pt': ['en'],
    'uk': ['ru'],
};
var fallbacksKeys = Object.keys(fallbacks);

for (var i = fallbacksKeys.length - 1; i >= 0; i--) {
    if (fallbacksKeys[i] === 'default') {
        fallbacksKeys.splice(i, 1);
    }
}
var translatedAndFallbacks = translatedLanguages.concat(fallbacksKeys);

var i18nOptions = {
        preload: translatedLanguages,
        fallbackLng: fallbacks,
        saveMissing: true,
        saveMissingTo: 'fallback',
        debug: false,
        cookie: 'i18n',
        useCookie: 'i18n',
        detectLngFromHeaders: false,
        ns: 'translation',
        whitelist: translatedAndFallbacks,
        backend: {
            loadPath: './src/locales/{{lng}}/{{ns}}.json',
            addPath: '.src/locales/{{lng}}/{{ns}}.missing.json',
            jsonIndent: 4
        },
        detection: {
            order: ['path', 'querystring',/* 'session'*/ 'cookie', 'header'],
            lookupQuerystring: 'l',
            lookupCookie: 'i18n',
            lookupSession: 'lng',
            lookupPath: 'lng',
            lookupFromPathIndex: 0,
            //caches: ['cookie'],
            //cookieExpirationDate: new Date()
            //.getTime() + 1000 * 60 * 60 * 24 * 365
        }
    };

exports.i18nDevelopment = function() {
    if (process.env.NODE_ENV === 'development') {
        console.log('translatedLanguages: ' + util.inspect(translatedLanguages));
        console.log('fallbacksKeys: ' + util.inspect(fallbacksKeys));
        console.log('translatedAndFallbacks: ' + util.inspect(translatedAndFallbacks));
        console.log('fallbacks: \n' + util.inspect(fallbacks));
    }
};
exports.i18nOptions = i18nOptions;
exports.translatedAndFallbacks = translatedAndFallbacks;
exports.fallbacks = fallbacks;
exports.translatedLanguages = translatedLanguages;
exports.i18nRouter = router;