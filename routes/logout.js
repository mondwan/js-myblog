//System library
var path = require('path');

//3rd party library
var express = require('express');
var router = express.Router();
var Q = require('q');

//Custom library
var projectRoot = path.join(__dirname, '..');

module.exports = router;

/* Process logout request */
router.get('/', function (req, res) {
    if (req.session.user) {
        req.session.user = null;
        req.flash('msg', 'Logout Success');
    }

    //Go to home page anyway
    res.redirect('/');
});
