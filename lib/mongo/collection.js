'use strict';

var Promise = require('bluebird');
var ObjectID = require('mongodb').ObjectID;
var check = require('check-types');

var Collection = function Collection(db, name, options) {
    var dbo = db.db();

    var that = this;
    if (!dbo) {throw new Error('No db argument');}
    if (!name) {throw new Error('No name argument');}
    that._db = dbo;
    that._name = name;
    that._options = options || {};
    that._collection = dbo.collection(name);
    that._objectIds = that._options.ObjectIds || [];
    if (that._options.ObjectId) {that._objectIds.push('_id');}
};


Collection.prototype.find = function find(query, fields, options) {
    var that = this;
    query = that.formatQuery(query);
    return new Promise(function Promise(resolve, reject) {
        that._collection.find(query, fields, options).toArray(function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.findOne = function findOne(query, fields, options) {
    var that = this;
    query = that.formatQuery(query);
    return new Promise(function Promise(resolve, reject) {
        that._collection.findOne(query, fields, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.findById = function findById(oid, fields, options) {
    var that = this;
    if (!oid) {throw new Error('No oid argument');}
    return that.findOne({
        _id: oid
    }, fields, options);
};

Collection.prototype.insertOne = function insert(docs, options) {
    var that = this;
    docs = that.formatQuery(docs);
    return new Promise(function Promise(resolve, reject) {
        that._collection.insertOne(docs, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.update = function update(query, document, options) {
    var that = this;
    query = that.formatQuery(query);
    if (document && document._id) {delete document._id;}
    return new Promise(function Promise(resolve, reject) {
        that._collection.update(query, document, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.updateById = function updateById(oid, document, options) {
    var that = this;
    if (!oid) {throw new Error('No oid argument');}
    return that.update({
        _id: oid
    }, document, options);
};

Collection.prototype.remove = function remove(query, options) {
    var that = this;
    query = that.formatQuery(query);
    return new Promise(function Promise(resolve, reject) {
        that._collection.remove(query, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.removeById = function removeById(oid, options) {
    var that = this;
    if (!oid) {throw new Error('No oid argument');}
    return that.remove({
        _id: oid
    }, options);
};

Collection.prototype.count = function count(query, options) {
    var that = this;
    query = that.formatQuery(query);
    return new Promise(function Promise(resolve, reject) {
        that._collection.count(query, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.save = function save(doc, options) {
    var that = this;
    doc = that.formatQuery(doc);
    return new Promise(function Promise(resolve, reject) {
        that._collection.save(doc, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.findAndModify = function findAndModify(query, sort, doc, options) {
    var that = this;
    query = that.formatQuery(query);
    return new Promise(function obj(resolve, reject) {
        that._collection.findAndModify(query, sort, doc, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.findAndRemove = function findAndRemove(query, sort, options) {
    var that = this;
    query = that.formatQuery(query);
    return new Promise(function Promise(resolve, reject) {
        that._collection.findAndRemove(query, sort, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

// http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#group
Collection.prototype.group = function group(keys, condition, initial, reduce, finalize, command, options) {
    var that = this;
    return new Promise(function Promise(resolve, reject) {
        that._collection.group(keys, condition, initial, reduce, finalize, command, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

// http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#aggregate
Collection.prototype.aggregate = function obj(array, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._collection.aggregate(array, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.drop = function obj() {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._collection.drop(function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.rename = function obj(newName, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._collection.rename(newName, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.createIndex = function obj(fieldOrSpec, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._collection.createIndex(fieldOrSpec, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.ensureIndex = function obj(fieldOrSpec, options) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._collection.ensureIndex(fieldOrSpec, options, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.dropIndex = function obj(name) {
    var that = this;
    return new Promise(function obj(resolve, reject) {
        that._collection.dropIndex(name, function obj(err, docs) {
            if (err) {return reject(err);}
            return resolve(docs);
        });
    });
};

Collection.prototype.formatQuery = function obj(query) {
    var that = this;
    for (var i = 0; i < that._objectIds.length; i++) {
        if (query && query[that._objectIds[i]]) {
            query[that._objectIds[i]] = that.formatQueryType(query[that._objectIds[i]]);
        }
    }
    return query;
};

Collection.prototype.formatQueryType = function obj(obj) {
    var that = this;
    if (check.string(obj)) {
        return that.formatId(obj);
    } else if (check.array(obj)) {
        return that.formatObjectIds(obj);
    } else if (check.object(obj)) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = that.formatQueryType(obj[key]);
            }
        }
    }
    return obj;
};

Collection.prototype.formatObjectIds = function obj(objects) {
    var that = this;
    for (var i = 0; i < objects.length; i++) {
        objects[i] = that.formatId(objects[i]);
    }
    return objects;
};

Collection.prototype.formatId = function obj(hex) {
    var that = this;
    if (hex instanceof ObjectID) {return hex;}
    if (!hex || hex.length !== 24) {return hex;}
    return ObjectID.createFromHexString(hex);
};


module.exports = Collection;
