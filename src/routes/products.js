var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if (process.env.NODE_ENV === 'development') {
        console.log();
        console.log('Detected language: ' + req.languages[0]);
        console.log('Plain /products request detected');
    }
    req.i18n.changeLanguage(req.languages[0]);
    if (process.env.NODE_ENV === 'development') {
        console.log();
        console.log('Detected language: ' + req.languages[0]);
        console.log('Changed language to: ' + req.languages[0]);
        console.log('Redirecting to: /' + req.languages[0] + '/products');
    }
    res.redirect('/' + req.languages[0] + '/products');
});

module.exports = router;