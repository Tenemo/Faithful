var express = require('express');
var app = express();
var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');
var util = require('util');
var port = process.env.PORT || 80;
var session = require('express-session'); // setup production storage later
// development
var errorhandler = require('errorhandler');
var logger = require('morgan');
if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler());
    //app.use(logger('dev'));
}
var developmentConsole = require('./src/modules/development').DevelopmentConsole;
// i18next
var i18n = require('i18next');
var backend = require('i18next-node-fs-backend');
var i18nmiddleware = require('i18next-express-middleware');
var i18nCallback = require('./src/routes/i18n').i18nRoutes;
var i18nOptions = require('./src/modules/i18n').i18nOptions;
// Routers
var mainRouter = require('./src/routes/main');
var changeLanguageRouter = require('./src/routes/changeLanguage');
// var productsRouter = require('./src/routes/products');
var i18nRouter = require('./src/routes/i18n').router;

app.set('views', './src/views');
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser('dogslovecookies'));
app.use(session({
    name: 'SessionID',
    secret: 'dogslovecookies',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}));
i18n
    .use(i18nmiddleware.LanguageDetector)
    .use(backend)
    .init(i18nOptions, i18nCallback);
app.use(i18nmiddleware.handle(i18n, {
    ignoreRoutes: ['/css','/img','/js','/less','/lib'],
    removeLngFromUrl: false
}));
// Development environment console logs
developmentConsole();

// Routes
app.use('/', i18nRouter);
app.use('/changeLanguage', changeLanguageRouter);
// app.use('/products', productsRouter);
app.use('/', mainRouter);

// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('404', {
//             message: err.message,
//             error: err
//         });
//     });
// }

app.get('*', function(req, res) {
    res.redirect('/');
});

// Listen
app.listen(port, function(err) {
    var scriptName = path.basename(__filename);
    console.log('Running ' + scriptName  + ' on port ' + port + ' in ' + process.env.NODE_ENV.toUpperCase() + ' environment');
});