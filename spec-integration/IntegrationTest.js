'use strict';

const expect = require('chai').expect;
const verifyCredentials = require('../verifyCredentials');
const DataModel = require('../lib/DatamodelService');

describe('Integration Test', function GetEntryTest() {

    const cfgs = [
        {
            username: 'ankit',
            password: 'Password123',
            database: 'quickbook',
            tableName: 'request',
            hostname: 'ds037778.mlab.com',
            port: '37778'
        }
    ];

    this.timeout(100000);


    cfgs.forEach(cfg => {
        //describe('Verify Credentials Tests', function VerifyCredentialsTests() {

        //    it('Correct Password', async function CorrectPasswordTest() {
        //        const authResult = await verifyCredentials.call({}, cfg);
        //       // console.log(authResult);

        //        expect(authResult).to.be.true;
        //    });

            //it('Incorrect Password', function IncorrectPasswordTest() {
            //    const wrongCfg = JSON.parse(JSON.stringify(cfg));
            //    wrongCfg.password = 'WrongPassword';
            //    const authResult = verifyCredentials.call({}, wrongCfg);
            //    expect(authResult).to.be.false;
            //});
        //});


        describe('Data Model', function VerifyCredentialsTests() {

        //it('Get Action', function CorrectPasswordTest() {


        //    const instance = new DataModel(cfg, this);
        //    const responce = instance.getAction();

        //    console.log(responce);

        //    //const authResult = verifyCredentials.call({}, cfg);
        //    //expect(authResult).to.be.true;
        //});

            //it('Save Action', function CorrectPasswordTest() {


            //    const instance = new DataModel(cfg, this);
            //    var myobj = {
            //        name: 'Company Inc',
            //        address: 'Highway 37'
            //    };

            //    const responce = instance.save(myobj);

            //    console.log(responce);

            ////const authResult = verifyCredentials.call({}, cfg);
            ////expect(authResult).to.be.true;
            //});
        });


    });
});

