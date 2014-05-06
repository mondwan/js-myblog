//System library
var path = require('path');

//3rd party library
var express = require('express');
var router = express.Router();
var Q = require('q');

//Custom library
var projectRoot = path.join(__dirname, '..');
var User = require(path.join(projectRoot, 'core', 'user', 'user'));

/* GET register web page. */
router.get('/', function (req, res) {
    var err = req.flash('error');
    console.log('GET:/reg req.flash(error)=|%s|', err);
    var arg = {
        error: err.length ? err[0] : false,
    };
    res.render('reg', arg);
});

/* POST handle register resquest */
router.post('/', function (req, res, next) {
    var redirect = '/';
    var deferred = Q.defer();
    //{ username: 'a', password: 'aa', 'confirm-password': 'a' }
    console.log('POST:/reg', req.body);

    try {
        //1st Validate the correctness of the given request
        if (req.body['confirm-password'] !== req.body.password) {
            throw new Error('Two input passwords must be identical. Try again.');
        }

        //2nd delegate the registration to Class::User
        var registration = new User({
            name: req.body.username,
            password: req.body.password,
        });

        registration.register()
            .then(function dbOperationSuccess(ret) {
                if (ret === false) {
                    req.flash('error', registration.message);
                    redirect = '/reg';
                } else {
                    //Write user'content into current session
                    req.session.user = registration;
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
        redirect = '/reg';
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
