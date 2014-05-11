//System library
var path = require('path');
var util = require('util');

//3rd party library
var express = require('express');
var router = express.Router();
var Q = require('q');

//Custom library
var projectRoot = path.join(__dirname, '..');
var Post = require(path.join(projectRoot, 'core', 'post', 'post'));
var accessLib = require(path.join(projectRoot, 'core', 'rules', 'access'));

/* Access right */
router.use(accessLib.confirmLogin);

/* GET publish web page */
router.get('/', function (req, res) {
    res.redirect('/');
});

/* POST handling publish request */
router.post('/', function (req, res, next) {
    console.log('POST:/publish', req.body);
    var user = req.session.user;
    var deferred = Q.defer();

    var post = new Post();
    post.publish(user, req.body.message)
        .then(function (pass) {
            if (!pass) {
                req.flash(
                    'msg',
                    util.format('Fail to post. Reason:|%s|', post.message)
                );
            } else {
                req.flash('msg', 'You have successfully publish a post');
            }

            deferred.resolve(pass);
        })
        .catch(function (err) {
            deferred.reject(err);
        });

    deferred.promise
        .then(function () {
            res.redirect('/');
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
