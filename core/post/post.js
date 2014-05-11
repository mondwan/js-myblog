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
 * Class::Post construtor
 * This class will be responsible for publish a post from a valid user and
 * retrieving posts from database
 *
 */
function Post() {
    this.db = null;
    this.message = "";
}

/**
 * Publish a post from a validate user
 *
 * @param User Class::User
 * @param message string
 *
 * @return Class::Q promise
 * {
 *  resolve: boolean, indicate validation result
 *  reject: Error, reject only if there is an unknown error
 * }
 * @note Operation result will be stored on this.message
 */
Post.prototype.publish = function (user, message) {
    var self = this;
    var post = {
        publisher: user.username,
        message: message,
        time: new Date()
    };
    return db.connect()
        .then(function connectDatabaseCB(db) {
            self.db = db;
            return self.getPostCollection();
        })
        .then(function getPostsCollectionCB(collection) {
            return Q.npost(collection, 'insert', [post]);
        })
        .then(function insertCB(result) {
            return true;
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
 * Fetch posts from database
 *
 * @return Class::Q promise
 * {
 *  resolve: Array of post object
 *  reject: Errors from database
 * }
 */
Post.prototype.fetch = function () {
    var self = this;
    return db.connect()
        .then(function connectDatabaseCB(db) {
            self.db = db;
            return self.getPostCollection();
        })
        .then(function getPostsCollectionCB(collection) {
            return Q.npost(collection, 'find');
        })
        .then(function getPostsCursorCB(cursor) {
            return Q.npost(cursor, 'toArray');
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
 * Get instance of posts collection from database
 *
 * @return Class Q::Promise
 * {
 *  resolve: collection object
 *  reject: Errors from database
 * }
 */
Post.prototype.getPostCollection = function () {
    var self = this;
    return Q.npost(self.db, 'collection', ['posts']);
};


module.exports = Post;
