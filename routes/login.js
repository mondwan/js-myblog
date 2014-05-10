//System library
var path = require('path');

//3rd party library
var express = require('express');
var router = express.Router();
var Q = require('q');

//Custom library
var projectRoot = path.join(__dirname, '..');
var User = require(path.join(projectRoot, 'core', 'user', 'user'));
var accessLib = require(path.join(projectRoot, 'core', 'rules', 'access'));

/* Access right */
router.use(accessLib.checkLoginStatus);

/* GET login web page. */
router.get('/', function (req, res) {
    var err = req.flash('error');
    console.log('GET:/reg req.flash(error)=|%s|', err);
    var arg = {
        error: err.length ? err[0] : false,
    };
    res.render('login', arg);
});

/* Handle login request */
router.post('/', function (req, res, next) {
    //{ username: 'a', password: 'aa'}
    console.log('POST:/login', req.body);
    var redirect = '/';
    var deferred = Q.defer();

    try {
        //1. input validation if any

        //2. user validation
        var user = new User({
            name: req.body.username,
            password: req.body.password
        });

        user.validate()
            .then(function validationCB(ret) {
                if (ret) {
                    //Write user'content into current session
                    req.session.user = user;

                    //Notify user that login success
                    req.flash('msg', 'Login Success');
                } else {
                    req.flash('error', user.message);
                    redirect = '/login';
                }

                //Fire the deferred promise
                deferred.resolve(true);
            })
            .catch(function dbOperationFailure(err) {
                //Dump the error to the web page error handler
                deferred.reject(err);
            });
    } catch (e) {
        req.flash('error', e.message);
        redirect = '/login';
        //Fire the deferred promise
        deferred.resolve(true);
    }

    //done() is necessary if we would like to catch any unknown errors
    deferred.promise
        .then(function (err) {
            res.redirect(redirect);
            return true;
        })
        .catch(function renderError(err) {
            next(err);
        })
        .done();
});

module.exports = router;
