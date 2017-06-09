var express = require('express');
var router = express.Router();
var appRootPath = require('app-root-path');
var i18n = require('i18next');
var i18nmiddleware = require('i18next-express-middleware');

var translatedAndFallbacks = require('../modules/i18n').translatedAndFallbacks;
var translatedLanguages = require('../modules/i18n').translatedLanguages;
var fallbacks = require('../modules/i18n').fallbacks;

exports.i18nRoutes = function() {
        // i18nmiddleware.addRoute(i18n, '/:lng/products', translatedAndFallbacks, router, 'get', function(req, res) {
        //     if (translatedLanguages.includes(req.languages[0])) {
        //         if (process.env.NODE_ENV === 'development') {
        //             console.log();
        //             console.log('Current language: ' + req.languages[0]);
        //             console.log('/:lng/products translated triggered, rendering products in ' + req.languages[0]);
        //         }
        //         res.render('products', {
        //             translatedLanguages: translatedLanguages
        //         });
        //     } else {
        //         if (process.env.NODE_ENV === 'development') {
        //             console.log();
        //             console.log('Current language: ' + req.languages[0]);
        //             console.log('Best possible match: ' + fallbacks[req.languages[0]]);
        //             console.log('/:lng/products NOT translated triggered, redirecting to ' + '/' + fallbacks[req.languages[0]] + '/products');
        //         }
        //         res.redirect('/' + fallbacks[req.languages[0]] + '/products');
        //     }
        // });
        i18nmiddleware.addRoute(i18n, '/:lng', translatedAndFallbacks, router, 'get', function(req, res) {
            if (translatedLanguages.includes(req.languages[0])) {
                i18n.changeLanguage(req.languages[0]);
                if (process.env.NODE_ENV === 'development') {
                    console.log();
                    console.log('/:lng TRANSLATED triggered, rendering index in ' + req.languages[0]);
                }
                res.render('index', {
                    translatedLanguages: translatedLanguages,
                    MP: {
                        tClose: req.t('MPtClose'),
                        tCounter: req.t('MPtCounter'),
                        tError: req.t('MPtError'),
                        tLoading: req.t('MPtLoading'),
                        tNext: req.t('MPtNext'),
                        tPrevious: req.t('MPtPrevious')
                    }
                });
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.log();
                    console.log('Current language: ' + req.languages[0]);
                    console.log('Best possible match: ' + fallbacks[req.languages[0]]);
                    console.log('/:lng NOT TRANSLATED triggered, redirecting to ' + '/' + fallbacks[req.languages[0]]);
                }
                res.redirect('/' + fallbacks[req.languages[0]]);
            }
        });
    };

router.post('/src/locales/add/:lng/:ns', i18nmiddleware.missingKeyHandler(i18n));
router.get('/src/locales/resources.json', i18nmiddleware.getResourcesHandler(i18n));

exports.router = router;