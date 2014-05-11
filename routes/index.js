//System library
var path = require('path');

//3rd party library
var express = require('express');
var router = express.Router();
var Q = require('q');

//Custom library
var projectRoot = path.join(__dirname, '..');
var Post = require(path.join(projectRoot, 'core', 'post', 'post'));

/* GET home page. */
router.get('/', function (req, res, next) {
    var deferred = Q.defer();
    var post = new Post();
    post.fetch()
        .then(function fetchPostsCB(posts) {
            deferred.resolve(posts);
        })
        .catch(function (err) {
            deferred.reject(err);
        });

    deferred.promise
        .then(function onRenderCB(posts) {
            res.render('index', {
                posts: posts
            });
        })
        .catch(function onErrorCB(err) {
            next(err);
        })
        .done();
});

module.exports = router;
