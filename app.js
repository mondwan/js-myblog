var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var router = require('./routes/router');
var setting = require('./static/Setting.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(
    session({
        secret: setting.cookieSecret,
        store: mongoStore({
            db: setting.db,
        })
    })
);
app.use(flash());

// Replace dynamicHelpers by locals
app.use(function dynamicHelpers(req, res, next) {
    //Store user reference if any
    res.locals.user = req.session.user ? req.session.user : null;

    //Store global message if any
    var msg = req.flash('msg');
    res.locals.msg = msg.length > 0 ? msg[0] : false;

    next();
});

app.use('/', router.index);
app.use('/users', router.users);
app.use('/time', router.time);
app.use('/reg', router.reg);
app.use('/login', router.login);
app.use('/logout', router.logout);
app.use('/publish', router.publish);
app.use(express.static(path.join(__dirname, 'public')));

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
