//System library
var path = require('path');
var fs = require('fs');

//3-rd party library
var _ = require('underscore');

//Custom define variable
var projectRoot = path.join(__dirname, '..');
var routes = [];
var router = {};

//Find all routes inside ./routes
routes = fs.readdirSync(path.join(projectRoot, 'routes'));

//Filter this file
routes = _.filter(routes, function (val) {
    return path.basename(val, '.js') !== 'router';
});

//Get path basename
routes = _.map(routes, function (val) {
    return path.basename(val, '.js');
});

//Get routes
_.reduce(routes, function (obj, val) {
    obj[val] = require(path.join(projectRoot, 'routes', val));
    return obj;
}, router);

module.exports = router;
