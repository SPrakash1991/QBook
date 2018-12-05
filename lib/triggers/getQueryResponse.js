'use strict';

const DataModel = require('../DatamodelService');
const { messages } = require('elasticio-node');
var parser = require('xml2json');


function updateRequest(body, ToModifiedDate) {

    console.log(`QBML : ${JSON.stringify(body)}`);

    var request = body.QBXML.QBXMLMsgsRq;

    if (request.VendorQueryRq) {
        body.QBXML.QBXMLMsgsRq.VendorQueryRq.ToModifiedDate = {
            $t: ToModifiedDate
        };
    }

    if (request.InvoiceQueryRq) {
        body.QBXML.QBXMLMsgsRq.InvoiceQueryRq.ToModifiedDate = {
            $t: ToModifiedDate
        };
    }

    if (request.PurchaseOrderQueryRq) {
        body.QBXML.QBXMLMsgsRq.PurchaseOrderQueryRq.ToModifiedDate = {
            $t: ToModifiedDate
        };
    }

    if (request.AccountQueryRq) {
        body.QBXML.QBXMLMsgsRq.AccountQueryRq.ToModifiedDate = {
            $t: ToModifiedDate
        };
    }


    if (request.PaymentMethodQueryRq) {
        body.QBXML.QBXMLMsgsRq.PaymentMethodQueryRq.ToModifiedDate = {
            $t: ToModifiedDate
        };
    }
}
exports.process = async function ProcessTrigger(msg, cfg, snapshot) {

    snapshot = snapshot || {};
    snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();
    snapshot.lastRequestId = snapshot.lastRequestId || 0;

    var lastRequestId = snapshot.lastRequestId;

    var json = parser.toJson(cfg.qbml, {
        reversible: true
    });

    var xml = parser.toXml(updateRequest(JSON.parse(json), snapshot.lastUpdated));

    this.emit('data', messages.newMessageWithBody(xml));


    const instance = new DataModel(cfg, this);

    if (lastRequestId === 0) {        // make the request
        
        lastRequestId = await instance.addRequest(xml,"VendorQueryRq");
    } else {

        const resultsList = await instance.getActionById(lastRequestId);

        if (resultsList.length > 0) {
            console.log('Found %d new records.', resultsList.length);

            resultsList.forEach((record) => {
                var json = JSON.parse(record.data);
                if (json.VendorQueryRs && json.VendorQueryRs.VendorRet) {
                    const list = json.VendorQueryRs.VendorRet;
                    list.forEach((record) => {
                        this.emit('data', messages.newMessageWithBody(record));
                    });
                }
            });

            this.emit('snapshot', snapshot);
        }
    }


};


