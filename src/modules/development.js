var i18nDevelopment = require('./i18n').i18nDevelopment;

exports.DevelopmentConsole = function() {
    if (process.env.NODE_ENV === 'development') {
        console.log();
        console.log('DEVELOPMENT CONSOLE');
        i18nDevelopment();
    }
};