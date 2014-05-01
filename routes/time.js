//system library
var util = require('util');

//3-rd party library
var express = require('express');

//custom variable
var router = express.Router();

/* GET current OS datetime */
router.get('/', function (req, res) {
    res.send(util.format('The current time is %s', new Date().toString()));
});

module.exports = router;
