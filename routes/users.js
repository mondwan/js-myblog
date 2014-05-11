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
var User = require(path.join(projectRoot, 'core', 'user', 'user'));
var accessLib = require(path.join(projectRoot, 'core', 'rules', 'access'));

/* Access right */
router.use(accessLib.confirmLogin);

/*
// An user homepage
router.use('/:user', function (req, res) {
    //res.send('req.params');
    res.json(req.params);
});
**/

//Get / render all users in database
router.get('/', function (req, res) {
    req.flash('msg', 'You are not allowed to browse user list');
    res.redirect('/');
});

// GET /:username render all posts from that username
router.get('/:username', function (req, res, next) {
    var post = new Post();
    var deferred = Q.defer();

    console.log('username=%s', req.params.username);
    post.fetch(req.params.username)
        .then(function (posts) {
            deferred.resolve(posts);
        })
        .catch(function (err) {
            deferred.reject(err);
        });


    deferred.promise
        .then(function (posts) {
            if (posts.length === 0) {
                req.flash(
                    'msg',
                    util.format(
                        'User %s has not published any posts yet',
                        req.params.username
                    )
                );
                res.redirect('/');
            } else {
                res.render('user', {
                    posts: posts
                });
            }
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
