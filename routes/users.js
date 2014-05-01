//System library
var util = require('util');

//3-rd party library
var express = require('express');
var router = express.Router();

//simple logger
router.use(function (req, res, next) {
    console.log('[DEBUG]: %s %s', req.method, req.url);
    next();
});

// An user homepage
router.use('/:user', function (req, res) {
    //res.send('req.params');
    res.json(req.params);
});

// Users list
router.use('/', function (req, res, next) {
    res.send('hello world');
});

module.exports = router;
