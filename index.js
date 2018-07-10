/*
* Homework Assignment #1
*
*/

// Dependency
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;



// Create the server
var server = http.createServer(function(req, res){

    // get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get the method
    var method = req.method.toLowerCase();


    //get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });


    // get the handler
    req.on('end', function(){

        buffer += decoder.end();

        // get the handler
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined'? handlers[trimmedPath] : handlers.notFound;

        //prepare the data
        var data = {
            'path': trimmedPath,
            'method': method,
            'payload': buffer
        };

        // route request to handler
        chosenHandler(data, function(statusCode, payload) {
            // use the status code from handler or set to default to 200
            statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

            // use the payload of handler, or default to an empty object
            payload = typeof (payload) === 'string'? payload : {};

            // convert the payload to payload string
            var payloadJSON = JSON.stringify(payload);

            res.writeHead(statusCode);
            res.end(payloadJSON);

            console.log('returning the response as ',statusCode, payloadJSON);

        });
    })

});

// Listen to server
server.listen(3000, function() {
    console.log('server listening on port 3000');
});

// Define Handlers
var handlers ={};

// Hello handler
handlers.hello = function(data, callback) {
    callback(200, 'hello my friend');
}

// not found handler
handlers.notFound = function(data, callback) {
    callback(404);
}


//define router request
var router  = {
    'hello': handlers.hello
}