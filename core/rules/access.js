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

module.exports = library;
