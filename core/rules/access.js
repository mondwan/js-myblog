/**
 * access.js
 *
 * A library of middlewares which responsible for managing rules about access right
 */

var library = {};

library.checkLoginStatus = function (req, res, next) {
    if (req.session.user) {
        //Redirect if user have logined
        req.flash('msg', 'You have logined');
        res.redirect('/');
    } else {
        //Let rest of the middlewares handle this request
        next();
    }
};

/**
 * Make sure the user have been logined b4 passing on the handler
 *
 * @param req Request
 * @param res Respone
 * @param next callback
 */
library.confirmLogin = function (req, res, next) {
    if (!req.session.user) {
        //Redirect if user have logined
        req.flash('msg', 'You cannot use this service until you have been logined');
        res.redirect('/');
    } else {
        //Let rest of the middlewares handle this request
        next();
    }
};

module.exports = library;
