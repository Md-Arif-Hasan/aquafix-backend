const js2xmlparser = require('js2xmlparser');
const js2Html = require('json-to-html');
const js2Txt = require('json-to-plain-text');

exports.sendJsResponse = (res, statusCode, data) => res.status(statusCode).send(data);

exports.sendXmlResponse = (res, statusCode, data) => {
    res.status(statusCode).send(js2xmlparser.parse('data', data));
}
exports.sendHtmlResponse = ( res, statusCode, data) => res.status(statusCode).send(js2Html(data));

exports.sendTextResponse = ( res, statusCode, data) => {
    res.status(statusCode).send(js2Txt.toPlainText(data)); }

exports.sendResponse = (req, res, statusCode, data) => {
    if (req.headers.accept === 'application/xml') {
        return this.sendXmlResponse(res, statusCode, data);
    }

    if (req.headers.accept === 'application/html') {
        return this.sendHtmlResponse( res, statusCode, data);
    }

    if (req.headers.accept === 'text/plain') {
        return this.sendTextResponse(res, statusCode, data);
    }
    return this.sendJsResponse(res, statusCode, data);
};