'use strict';

var mongodb = require('mongodb');
var Promise = require('bluebird');

var MongoClient = mongodb.MongoClient;

var Collection = require('./collection');
var Db = require('./db');

var app = function app() {
    this._db = null;
    this._collections = {};
};


app.prototype.connect = function connect(url, settings) {

    if (!settings) {
        settings = { };
    }
    if (!url) {throw new Error('No url argument');}
    var that = this;
    return new Promise(function obj(resolve, reject) {
        MongoClient.connect(url, settings, function obj(err, db) {
            if (err) {return reject(err);}
            that._db = new Db(db);
            return resolve(that._db);
        });
    });
};

//Expose raw driver
app.prototype.mongodb = mongodb;

module.exports = new app();
