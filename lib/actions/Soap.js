'use strict';

const uuid = require('node-uuid');
const helpers = require('../qbws');
var utility = require('../utility');
const { messages } = require('elasticio-node');
const DataModel = require('../DatamodelService');
var parser = require('xml2json');


exports.process = async function ProcessAction(msg, cfg, snapshot) {

    snapshot = snapshot || {};
    snapshot.counter = snapshot.counter || 0;
    var counter = snapshot.counter;


    var response;


    function clientVersion() {
        //var clientVersion = 'O:' + data.strVersion;
        return helpers.clientVersionResponse('');
    }

    function serverVersion() {
        var serverVersion = '0.2.1';
        return helpers.serverVersionResponse(serverVersion);
    }

    async function receiveResponseXML(data) {
        const xmlResponce = data.response;
        const hresult = data.hresult;
        const message = data.message;
        var retVal;

        if (utility.objectNotEmpty(hresult)) {

            retVal = -101;
        } else {

            console.log('Length of response received = ' + xmlResponce.length);

            const instance = new DataModel(cfg, this);
            var json = parser.toJson(xmlResponce);
            json = JSON.parse(json);


            var myobj = {
                data: JSON.stringify(json.QBXML.QBXMLMsgsRs),
                type: 'response'
            };


            await instance.save(myobj);


            const requests = utility.getConfigureRequest(true);
            var percentage = counter * 100 / requests.length;
            if (percentage >= 100) {
                counter = 0;
            }

            // QVWC throws an error if if the return value contains a decimal
            retVal = percentage.toFixed();
        }

        return helpers.receiveResponseXMLResponse(retVal);

    }


    try {

        console.log('request Body : ' + JSON.stringify(msg.body));

        if (msg.body['soap-Envelope']) {

            const body = msg.body['soap-Envelope']['soap-Body'];

            if (body.clientVersion) {

                response = clientVersion();


            } else if (body.serverVersion) {

                response = serverVersion();


            } else if (body.authenticate) {

                var strArray = [];
                strArray.push(uuid.v1());
                strArray.push('');
                response = helpers.authenticateResponse(strArray);


            } else if (body.sendRequestXML) {

                const requests = utility.getConfigureRequest(true);
                var request;
                var total = requests.length;

                if (counter < total) {
                    request = requests[counter];
                    counter = counter + 1;
                } else {
                    counter = 0;
                    request = '';
                }

                response = helpers.sendRequestXML(request);


            } else if (body.receiveResponseXML) {

                response = receiveResponseXML(body.receiveResponseXML);


            } else if (body.connectionError) {
                var args = body.connectionError;
                var hresult = args.hresult;
                var message = args.message;
                var retVal = null;
                // 0x80040400 - QuickBooks found an error when parsing the
                //     provided XML text stream.
                var QB_ERROR_WHEN_PARSING = '0x80040400';
                // 0x80040401 - Could not access QuickBooks.
                var QB_COULDNT_ACCESS_QB = '0x80040401';
                // 0x80040402 - Unexpected error. Check the qbsdklog.txt file for
                //     possible additional information.
                var QB_UNEXPECTED_ERROR = '0x80040402';
                // Add more as you need...


                var connectionErrCounter = 0;

                if (connectionErrCounter === null) {
                    connectionErrCounter = 0;
                }


                if (hresult.trim() === QB_ERROR_WHEN_PARSING) {

                    retVal = 'DONE';
                } else if (hresult.trim() === QB_COULDNT_ACCESS_QB) {

                    retVal = 'DONE';
                } else if (hresult.trim() === QB_UNEXPECTED_ERROR) {

                    retVal = 'DONE';
                } else {
                    // Depending on various hresults return different value
                    if (connectionErrCounter === 0) {

                        retVal = '';
                    } else {

                        retVal = 'DONE';
                    }
                }


                response = helpers.connectionErrorResponse(retVal);


            } else if (body.getLastError) {
                response = helpers.getLastErrorResponse('');

            } else if (body.closeConnection) {
                response = helpers.closeConnectionResponse('');

            } else {
                this.emit('error', 'Unsupported Action');
            }
        }
    } catch (ex) {
        this.emit('error', ex);
    }
    snapshot.counter = counter;
    this.emit('snapshot', snapshot);
    this.emit('data', messages.newMessageWithBody({
        response: response
    }));
};
