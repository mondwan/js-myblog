var express = require('express');
var router = express.Router();

/* GET register web page. */
router.get('/', function (req, res) {
    res.render('reg');
});

/* POST handle register resquest */
router.post('/', function (req, res) {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;
