'use strict';

const DataModel = require('./lib/DatamodelService');

module.exports = async function Verify(credentials) {

   
    const instance = new DataModel(credentials, this);
    const responce = await instance.verifyCredentials();
    console.log(responce);
        if (responce) {
            console.log('Successfully verified credentials.');
            return true;
        }
        console.log(`Error in validating credentials: ${JSON.stringify(responce)}`);
        return false;   
};
