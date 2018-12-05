
'use strict';
var Promise = require('bluebird');
var objectAssign = require('object-assign');

var Collection = require('./collection');

var Db = function obj(db) {
    var that = this;
    if (!db) {throw new Error('No db argument');}
    that._db = db;
    that._collections = {};
};

Db.prototype.close = function obj() {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._db.close(function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.collection = function obj(name, options, force) {
    var that = this;
    if (!name) {throw new Error('No name argument');}

    var _options = {
        ObjectId: true
    };

    options = objectAssign(_options, options);

    if (force) {return new Collection(that._db, name, options);}
    if (that._collections[name]) {return that._collections[name];}
    that._collections[name] = new Collection(that._db, name, options);
    return that._collections[name];
};

Db.prototype.admin = function obj() {
    var that = this;
    return that._db.admin();
};

Db.prototype.collectionNames = function obj(collectionName, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        that._db.collectionNames(collectionName, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.collections = function obj() {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._db.collections(function obj(err, docs) {
            if (err) { return reject(err); }
            return resolve(docs);
        });
    });
};

Db.prototype.listCollections = function obj(filter,options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        filter = filter || {};

        const ss = that._db.db();
        ss.listCollections(filter,options,function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.eval = function obj(code, parameters, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        that._db.eval(code, parameters, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.logout = function obj() {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._db.logout(function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.authenticate = function obj(username, password, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        that._db.authenticate(username, password, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.addUser = function obj(username, password, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        that._db.addUser(username, password, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.removeUser = function obj(username, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        that._db.removeUser(username, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.createCollection = function obj(collectionName, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        that._db.createCollection(collectionName, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.dropCollection = function obj(collectionName) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._db.dropCollection(collectionName, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.renameCollection = function obj(fromCollection, toCollection, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        that._db.renameCollection(fromCollection, toCollection, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.dropDatabase = function obj() {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._db.dropDatabase(function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Db.prototype.stats = function obj(options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        options = options || {};
        that._db.stats(options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

module.exports = Db;
