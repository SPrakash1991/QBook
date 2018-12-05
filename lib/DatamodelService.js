'use strict';

const path = require('path');
const { promisify } = require('util');
const _ = require('underscore');

var mongo = require('./mongo');

/**
 * Return configured API caller instance.  This caller instance handles authentication
 * @constructor
 * @param {Object} config
 * @param {string} config.database -  database
 * @param {string} config.tableName - tableName
 * @param {string} config.username - username
 * @param {string} config.password - password
 * @param {string} config.hostname - password
 * @param {string} config.port - password
 *
 * @returns {{insertAction: Function}}
 * @constructor
 */


module.exports = function Service(config, emitter) {
    if (!config || !config.database) {
        throw new Error('Configuration is missing databse name');
    }
    let cfg = { };

    cfg = _.extend(cfg, config);

    function buildUrl() {
        return 'mongodb://' + cfg.username + ':' + cfg.password + '@' + cfg.hostname + ':' + cfg.port + '/' + cfg.database;
    }


    this.getAction = async function getAction() {
        var db = await mongo.connect(buildUrl(), {
            useNewUrlParser: true
        });
        var collection = db.collection(config.tableName);
        var responce = await collection.find();
        db.close();
        return responce;
    };

    this.getAction = async function getActionById(id) {
        var db = await mongo.connect(buildUrl(), {
            useNewUrlParser: true
        });
        var collection = db.collection(config.tableName);
        var responce = await collection.findById(id);
        db.close();
        return responce;
    };

    this.addRequest = async function insertAction(request,action) {

        var obj = {
            request: request,
            response: '',
            action: action,
            isProcess: false
        };

        var db = await mongo.connect(buildUrl(), {
            useNewUrlParser: true
        });
        var collection = db.collection(config.tableName);
        var responce = await collection.insertOne(obj);
        db.close();
        return responce;
    };

    this.addResponse = async function addResponse(request, response, action) {

        var obj = {
            request: request,
            response: response,
            action: action,
            isProcess: false
        };

        var db = await mongo.connect(buildUrl(), {
            useNewUrlParser: true
        });
        var collection = db.collection(config.tableName);
        var responce = await collection.insertOne(obj);
        db.close();
        return responce;
    };

    this.verifyCredentials = async function verifyCredentials() {
        var db = await mongo.connect(buildUrl(), {
            useNewUrlParser: true
        });
        db.close();
        return true;

    };

    return this;
};
