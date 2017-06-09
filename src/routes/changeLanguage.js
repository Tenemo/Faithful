var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    res.cookie('i18n', req.body.language, {maxAge: 1000 * 60 * 60 * 24 * 365});
    req.i18n.changeLanguage(req.body.language);
    if (process.env.NODE_ENV === 'development') {
        console.log();
        console.log('Detected language: ' + req.languages[0]);
        console.log('Language change triggered manually, changed language to: ' + req.body.language);
        console.log('Redirecting to: /' + req.body.language);
    }
    res.redirect('/' + req.body.language);
});

module.exports = router;