//System library
var path = require('path');
var crypto = require('crypto');
var util = require('util');

//3rd party library
var Q = require('q');
Q.longStackSupport = true;


//Custom library
var projectRoot = path.join(__dirname, '..', '..');
var db = require(path.join(projectRoot, 'core', 'db', 'db'));

/**
 * Class::User construtor
 * This class will be responsible for registering the user to our mongodb data-
 * base
 *
 * @param arg dict
 * {
 *  name: string
 *  password: string
 * }
 */
function User(arg) {
    this.username = arg.name;
    var md5 = crypto.createHash('md5');
    this.password = md5.update(arg.password).digest('base64');
    this.message = "";
    this.db = null;
}

/**
 * Register this user to our database.
 *
 * @return Class::Q promise
 * {
 *  resolve: boolean, indicate registration result
 *  reject: Error, Reject only if there is an unknown error
 * }
 * @note Registration message will be placed on this.message if any
 */
User.prototype.register = function () {
    var self = this;

    return db.connect()
        .then(function (db) {
            //console.log('database connected');
            self.db = db;
            return self.checkExistence();
        })
        .then(function (dbObject) {
            //console.log('username collision: %s', collision);
            var ret = true;
            if (dbObject !== null) {
                self.message = util.format(
                    'Username |%s| already exists',
                    self.username
                );
                ret = false;
            } else {
                ret = self.saveUser();
            }
            return ret;
        })
        .finally(function () {
            var ret = true;
            if (self.db) {
                ret = db.close(self.db).then(function (result) {
                    //console.log(result);
                    self.db = null;
                    return true;
                });
            }
            return ret;
        });
};

/**
 * Validate this User by comparing information from MongoDb
 *
 * @return Class::Q promise
 * {
 *  resolve: boolean, true implies login success,
 *  reject: Error, Reject only if there is errors including something unknown
 *      or database operations failure
 * }
 */
User.prototype.validate = function () {
    var self = this;
    return db.connect()
        .then(function (db) {
            //console.log('database connected');
            self.db = db;
            return self.checkExistence();
        })
        .then(function onCheckExists(dbObject) {
            var ret = false;
            if (dbObject !== null) {
                if (dbObject.password === self.password) {
                    //login success
                    ret = true;
                }
            }
            if (!ret) {
                //login failure
                self.message = util.format(
                    'User |%s| does not exists or password incorrect',
                    self.username
                );
            }
            return ret;
        })
        .finally(function () {
            var ret = true;
            if (self.db) {
                ret = db.close(self.db).then(function (result) {
                    //console.log(result);
                    self.db = null;
                    return true;
                });
            }
            return ret;
        });
};

/**
 * Check existence of the given username
 *
 * @return Class::Q promise
 * {
 *  resolve: Database object or null. Return a Database object means there is a collision
 *  reject: Error, Reject only if there is an unknown error or fail to run db
 *          operation
 * }
 */
User.prototype.checkExistence = function () {
    var self = this;
    var myDB = self.db;
    var query = {
        username: self.username
    };
    return Q.npost(myDB, 'collectionNames', ['users'])
        .then(function checkCollectionExistCB(results) {
            //console.log("checkCollectionExist", results);
            return results.length > 0 ? true : false;
        })
        .then(function checkUsernameCollisionCB(collectionExist) {
            var ret = null;
            //console.log('checkUsernameCollisionCB', collectionExist);
            if (collectionExist === true) {
                //validate username
                ret = Q.npost(myDB, 'collection', ['users'])
                    .then(function getUsersCollectionCB(collection) {
                        return Q.npost(collection, 'find', [query]);
                    })
                    .then(function findUsernameCB(cursor) {
                        return Q.npost(cursor, 'nextObject');
                    })
                    .then(function cursorNextCB(object) {
                        return object;
                    });
            } else {
                //Must be no collision since this is a fresh collection
                ret = null;
            }
            return ret;
        });
};

/**
 * Save a user record to database
 *
 * @return Class::Q promise
 * {
 *  resolve: boolean, true implies there is a collision
 *  reject: Error, Reject only if there is an unknown error or fail to run db
 *          operation
 * }
 */
User.prototype.saveUser = function () {
    var self = this;
    var myDB = self.db;
    var record = {
        username: self.username,
        password: self.password
    };
    return Q.npost(myDB, 'collection', ['users'])
        .then(function getUsersCollectionCB(collection) {
            return Q.npost(collection, 'insert', [record]);
        })
        .then(function insertRecordCB(result) {
            //console.log("insert result", result);
            return true;
        });
};

module.exports = User;
