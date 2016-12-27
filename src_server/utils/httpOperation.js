/**
 * Created by liuyc14 on 2016/8/30.
 */
var _ = require('lodash');
var http = require('http');


const post = (url, path, port, data, done) => {
    data = JSON.stringify(data);
    console.log(data);
    //这是需要提交的数据
    var options = {
        hostname: url,
        //port: 80,
        //path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    if(path) options.path = path;
    if(port) options.port = port;

    var req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            rawData += chunk;
        });
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                done(parsedData);
            } catch (e) {
                console.log(e.message);
            }
        });
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

// write data to request body
    req.write(data);
    req.end();
};

const get = (url, data, done) => {
    if(data){
        var p = "";
        for (var k in data){
            p += '&' + k + '=' + data[k];
        }
        p = p.replace('&', '');
        p = '?' + p;
        url = url + p;
    }
    console.log(url);

    http.get(url, (res) => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error(`Request Failed.\n` +
                `Status Code: ${statusCode}`);
        } /*else if (!/^application\/json/.test(contentType)) {
         error = new Error(`Invalid content-type.\n` +
         `Expected application/json but received ${contentType}`);
         }*/
        if (error) {
            console.log(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                done(parsedData);
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
        done(null);
    });
};

var httpOperation = {
    post: post,
    get: get
};

module.exports = httpOperation;