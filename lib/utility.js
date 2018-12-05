'use strict';
const helpers = require('./qbws');
var builder = require('xmlbuilder');

function createXMLBody(soapBody) {

    var body = {
        'soap:Envelope': {
            'soap:Body': soapBody,
            '@xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
            '@xmlns:tns': 'http://developer.intuit.com/',
            '@xmlns:tm': 'http://microsoft.com/wsdl/mime/textMatching/'

        }
    };
    return body;
}


function buildXml(xml) {
    var body = builder.create(createXMLBody(xml), {
        encoding: 'utf-8'
    });
    return body.end({
        pretty: true
    });
}


/**
 * @function parseForVersion
 *
 * @desc Parses the first two version components out of the standard four
 *   component version number: `<Major>.<Minor>.<Release>.<Build>`.
 *
 * @example
 *   // returns 2.0
 *   parseForVersion('2.0.1.30');
 *
 * @param {String} input - A version number.
 *
 * @returns {String} First two version components (i.e. &lt;Major>.&lt;Minor>)
 *   if `input` matches the regular expression. Otherwise returns `input`.
 */
function parseForVersion(input) {
    // As long as you get the version in right format, you could use
    // any algorithm here.
    var major = '';
    var minor = '';
    var version = /^(\d+)\.(\d+)(\.\w+){0,2}$/;
    var versionMatch;

    versionMatch = version.exec(input.toString());

    if (versionMatch !== null) {
        major = versionMatch[1];
        minor = versionMatch[2];

        return major + '.' + minor;
    } else {
        return input;
    }
}


function getConfigureRequest(config) {
    var requests = [];
    var inputXMLDoc;
  // vendor query request
    if (config) {
        inputXMLDoc = builder.begin()
            .ele('QBXML')
            .ele('QBXMLMsgsRq', {
                onError: 'stopOnError'
            })
            .ele('VendorQueryRq', {
                requestID: '1'
            })
            .end({
                pretty: false
            });
        requests.push(inputXMLDoc);
    }

    // invoice query request
    if (config) {
        inputXMLDoc = builder.begin()
            .ele('QBXML')
            .ele('QBXMLMsgsRq', {
                onError: 'stopOnError'
            })
            .ele('InvoiceQueryRq', {
                requestID: '1'
            })
            .end({
                pretty: false
            });

        requests.push(inputXMLDoc);
    }


    // Payment Method  query request
    if (config) {
        inputXMLDoc = builder.begin()
            .ele('QBXML')
            .ele('QBXMLMsgsRq', {
                onError: 'stopOnError'
            })
            .ele('PaymentMethodQueryRq', {
                requestID: '1'
            })
            .end({
                pretty: false
            });

        requests.push(inputXMLDoc);
    }


    // GL account  query request
    if (config) {
        inputXMLDoc = builder.begin()
            .ele('QBXML')
            .ele('QBXMLMsgsRq', {
                onError: 'stopOnError'
            })
            .ele('AccountQueryRq', {
                requestID: '1'
            })
            .end({
                pretty: false
            });

        requests.push(inputXMLDoc);
    }


    // Purchase Order  query request
    if (config) {
        inputXMLDoc = builder.begin()
            .ele('QBXML')
            .ele('QBXMLMsgsRq', {
                onError: 'stopOnError'
            })
            .ele('PurchaseOrderQueryRq', {
                requestID: '1'
            })
            .end({
                pretty: false
            });

        requests.push(inputXMLDoc);
    }
    return requests;
}


/**
 * @function objectNotEmpty
 *
 * @desc Checks that the type of a variable is 'object' and it is not empty.
 *
 * @param {Object} obj - The object to be checked.
 *
 * @returns {Number} The number of properties in obj, or null if it is not an
 *   object.
 */
function objectNotEmpty(obj) {
    if (typeof obj !== 'object') {
        return null;
    }

    return Object.getOwnPropertyNames(obj).length;
}


/**
 * @function announceMethod
 *
 * @desc Logs qbws method calls and their parameters.
 *
 * @param {String} name - The name of the method.
 *
 * @param {Object} params - The parameters sent to the method.
 */
function announceMethod(name, params) {
    var arg;
    var argType;

    console.log('WebMethod: ' + name
        + '() has been called by QBWebConnector');


    if (objectNotEmpty(params)) {
        console.log('Parameters received:');
        for (arg in params) {
            if (params.hasOwnProperty(arg)) {
                    // TODO: Truncate long value
                argType = typeof params[arg];
                    // TODO: DRY this up
                if (argType === 'object') {
                    console.log('        ' + argType + ' ' + arg + ' = '
                            + JSON.stringify(params[arg], null, 2));
                } else {
                    console.log('        ' + argType + ' ' + arg + ' = '
                            + params[arg]);
                }
            }
        }
    } else {
        console.log('No parameters received.');
    }

}

exports.parseForVersion = parseForVersion;
exports.createXMLBody = createXMLBody;
exports.buildXml = buildXml;
exports.getConfigureRequest = getConfigureRequest;
exports.objectNotEmpty = objectNotEmpty;

