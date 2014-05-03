var express = require('express');
var router = express.Router();

/* GET register web page. */
router.get('/', function (req, res) {
    res.render('reg', {
        title: 'Express',
    });
});

module.exports = router;
