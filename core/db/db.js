//System library
var util = require('util');
var path = require('path');

//3rd party library
var mongodb = require('mongodb');
var Q = require('q');

//Custom library
var projectRoot = path.join(__dirname, '..', '..');
var setting = require(path.join(projectRoot, 'static', 'Setting.json'));

module.exports = {
    connect: function () {
        var deferred = Q.defer();
        var url = util.format(
            'mongodb://%s:%d/%s',
            setting.host,
            setting.port,
            setting.db
        );

        mongodb.connect(url, function (err, db) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(db);
            }
        });

        return deferred.promise;
    },
    close: function (db) {
        var deferred = Q.defer();
        db.close(true, function (err, ret) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve("Database closed");
            }
        });
        return deferred.promise;
    },
};
