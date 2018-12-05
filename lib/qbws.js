'use strict';

var utility = require('./utility');
const Entities = require('html-entities').XmlEntities;
const xmlns = 'http://developer.intuit.com/';

/**
 * @function authenticateResponse
 *
 * @desc Prompts qbws to authenticate the supplied user and specify the company
 *   to be used in the session.
 *
 * @summary When a scheduled update occurs for qbws or when the user clicks
 *   Update Selected in the Web Connector, authenticate() is called supplying
 *   the user name and password required for the user to access your web
 *   service. Your web service validates the user specified in the authenticate
 *   call and returns a string array.
 *
 * @param {String} args.strUsername The Web Connector supplies the user name
 *   that you provided to your user in the QWC file to allow that username to
 *   access your web service.
 *
 * @param {String} args.strPassword The Web Connector supplies the user
 *   password (provided to your user by you) which was stored by the user in
 *   the web connector.
 *
 * @example
 *   authReturn[1] = '';
 *   authReturn[2] = '30'
 *   authReturn[3] = ''
 *   // Result: the update is postponed by `30` seconds. In the QBWC status
 *   //   window this will be shown:
 *   //   'Last Result - Update postponed by application'.
 *
 * @example
 *   authReturn[1] = '';
 *   authReturn[2] = '';
 *   authReturn[3] = '60';
 *   // Result: The minimum limit for the `Every_Min` parameter is set. In the
 *   //   QBWC status window, the value of the `Every_Min` field will be shown
 *   //   set to `60` if the previous `Every_Min` value is lesser than `60`.
 *   //   The Last Run time and the Next Run time is also shown. (Here Next Run
 *   //   Time = Last Run Time = 60 seconds).
 *
 * @example
 *   authReturn[1] = '';
 *   authReturn[2] = '30';
 *   authReturn[3] = '60';
 *   // Result: The update is postponed by `30` seconds and the minimum limit
 *   //   for the `Every_Min` parameter is set. In the QBWC status window, the
 *   //   following are shown: 'Last Result - Update postponed by application.'
 *   //   Last Run time and the Next RUn time is also shown. (Here Next Run
 *   //   Time = Last Run Time + x seconds). Every_Min field is set to `60` if
 *   //   the previous `Every_Min` value is lesser than the `60`.
 *
 * @example
 *   authReturn[1] = 'NONE'; // Or 'NVU' or 'BUSY'
 *   authReturn[2] = '30';
 *   authReturn[3] = '';
 *   // Result: The update is postponed by 30 seconds. In the QBWC status
 *   //   the following will be shown:
 *   //   'Last Results - Update postponed by application'.
 *
 * @example
 *   authReturn[1] = 'NONE'; // Or 'NVU' or 'BUSY'
 *   authReturn[2] = '';
 *   authReturn[3] = '60';
 *   // Result: The minimum limit on the `Every_Min` parameter is set and the
 *   //   update is stopped. In the QBWC status window the following will be
 *   //   shown: 'Last Result - No Data Exchange/Invalid password for username/
 *   //   Application Busy' based on the value of authReturn[1]. Last Run Time
 *   //   and Next Run TIme is displayed; here Next Run Time = Last Run Time +
 *   //   60 seconds. `Every_Min` field is set to `60` if the previous
 *   //   `Every_Min` value was lesser than `60.
 *
 * @example
 *   authReturn[1] = 'NONE'; // Or 'NVU' or 'BUSY'
 *   authReturn[2] = '30';
 *   authReturn[3] = '60';
 *   // Result: the minimum limit on the `Every_Min` parameter is set and the
 *   //   update is postponed. In the QBWC status window the following will be
 *   //   shown: 'Last Result - Update postponed by application'. `Every_Min`
 *   //   field is et to `60` if previously less than `60`. Last Run TIme and
 *   //   Next Run Time is displayed. Here Next Run Time = Last Run Time + 30
 *   //   seconds.
 *
 * @example
 *   authReturn[1] = '';
 *   authReturn[2] = '';
 *   authReturn[3] = '';
 *   // Result: Update will complete successfully.
 *
 * @returns {String|Array} Instructions for QuickBooks to proceed with update.
 *   A string array must be returned with four possible elements. In this
 *   returned string array:
 *   - _The zeroth element_ provides a session ticket for the client.
 *   - _The first element_ contains either `'NONE'`, `'NVU'` (invalid user),
 *     `'BUSY'`, `''` (empty string), or a string that is the QB company file
 *     name. If qbws returns an empty string or any other string that is NOT
 *     `'NVU'`, `'NONE'`, or `'BUSY'`, that string will be used as the
 *     qbCompanyFileName parameter in the web connector's BeginSession call to
 *     QuickBooks.
 *   - _The second element_ enables qbws to postpone the update process. The
 *     value in this parameter determines the number of seconds by which the
 *     update will be postponed. For example, if `authReturn[2] = 60`, the Web
 *     Connector will postpone the update process by 60 seconds. That is, the
 *     current update process is discontinued and will resume after 60 seconds.
 *   - _The third element_ (optional) sets the lower limit in seconds for the
 *     `Every_Min` parameter (this parameter determines the interval the
 *     scheduler uses to run the updates when autorun is enabled). For example:
 *     if `authReturn[3] = 300`, suppose a client tries to set `Every_Min = 2`
 *     using the UI of the Web Connector instance. In this case the result
 *     would be a popup that informs the user that the lower limit for this
 *     parameter is 300 seconds and the Web Connector will automatically set
 *     the `Every_Min` parameter to `5` minutes (300 seconds).
 *   - _The fourth element_ (optional) contains the number of seconds to be
 *     used as the `MinimumRunEveryNSeconds` time.
 *   **Important**: In order to enable qbws to utilize `authReturn[2]` &
 *   `authReturn[3]`, 'Auto Run' hase to be enabled in the Web Connector.
 *
 *   Possible return values
 *   - string[0] = ticket
 *   - string[1]
 *     - `''` (empty string) = use current company file
 *     - `'none'` = no further request/no further action required
 *     - `'nvu'` = not valid user
 *     - any other string value = use this company file
 */
function authenticateResponse(strArray) {
    var response = {
        authenticateResponse: {
            'authenticateResult': {
                string: strArray
            },
            '@xmlns': xmlns
        }

    };

    return utility.buildXml(response);

}

function clientVersionResponse(clientVersion) {
    var response = {
        clientVersionResponse: {
            'clientVersionResult': clientVersion,
            '@xmlns': xmlns
        }

    };

    return utility.buildXml(response);

}


function closeConnectionResponse(result) {
    var response = {
        closeConnectionResponse: {
            'closeConnectionResult': result,
            '@xmlns': xmlns
        }
    };

    return utility.buildXml(response);

}

function connectionErrorResponse(result) {
    var response = {
        connectionErrorResponse: {
            'connectionErrorResult': {
                string: result
            },
            '@xmlns': xmlns
        }
    };

    return utility.buildXml(response);

}


function getLastErrorResponse(error) {
    var response = {
        getLastErrorResponse: {
            'getLastErrorResult': error,
            '@xmlns': xmlns
        }
    };

    return utility.buildXml(response);

}


function interactiveDoneResponse(result) {
    var response = {
        interactiveDoneResponse: {
            'interactiveDoneResult': result,
            '@xmlns': xmlns
        }
    };

    return utility.buildXml(response);

}


function serverVersionResponse(serverVersion) {
    var response = {
        serverVersionResponse: {
            'serverVersionResult': serverVersion,
            '@xmlns': xmlns
        }
    };


    return utility.buildXml(response);

}


function receiveResponseXMLResponse(result) {
    var response = {
        receiveResponseXMLResponse: {
            'receiveResponseXMLResult': result,
            '@xmlns': xmlns
        }
    };

    return utility.buildXml(response);
}


function sendRequestXML(sendRequest) {
    const entities = new Entities();
    if (sendRequest) {
        sendRequest = '<?xml version="1.0"?><?qbxml version="8.0"?>' + sendRequest;
        sendRequest = entities.encode(sendRequest);
    }

    var response = {
        sendRequestXMLResponse: {
            'sendRequestXMLResult': sendRequest,
            '@xmlns': xmlns
        }
    };
    return utility.buildXml(response).replace(/&amp;/g, '&');
}

exports.authenticateResponse = authenticateResponse;
exports.clientVersionResponse = clientVersionResponse;
exports.closeConnectionResponse = closeConnectionResponse;
exports.getLastErrorResponse = getLastErrorResponse;
exports.interactiveDoneResponse = interactiveDoneResponse;
exports.connectionErrorResponse = connectionErrorResponse;
exports.serverVersionResponse = serverVersionResponse;
exports.receiveResponseXMLResponse = receiveResponseXMLResponse;
exports.sendRequestXML = sendRequestXML;
