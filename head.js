//The head will consolidate the events from each hand and push them to the client

var WebSocketServer = require('websocket').server;
var http = require('http');

var settings = require('./settings')

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(settings.headPort, settings.headHost, function() { 
  console.log("Head listening on " + settings.headPort);
});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

var clients = [];
//keep track of the clients which want to receive events
var eyes = [];

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    console.log("Connection open from " + request.origin);
    
    //keep track of which client this is
    //TODO: have the clients "identify" so they can reconnect as the same
    //arm/eye
    var index = clients.push(connection) - 1;
    var eyeind;

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
      if(message.type === "utf8") {
        var data = message.utf8Data;
        if(data.length === 3 && data === "eye") {
          eyeind = eyes.push(index)
          console.log("eye!", index);
        } else {
          //console.log("message!")
          //push this message to all the eye clients (visualization endpoints)
          //but we have to pull the data out and set which arm it is
          //TODO: this seems like a lot of parsing, maybe be more efficient
          var armData = JSON.parse(JSON.parse(data).data);
          armData['arm'] = index; 
          //console.log("ARM DATA", armData);
          //console.log("arm", armData.arm, index)
          for(var i = eyes.length; i--;) {
            var ind = eyes[i];
            //don't send a message from ourselves to ourselves
            if(index != ind) {
              clients[ind].send(JSON.stringify(armData));
            }
          }
        }
      }
    });

    connection.on('close', function(connection) {
      // close user connection
      //remove an eye when it disconnects
      eyes.splice(eyeind, 1);
      //TODO: uniquely identify clients so that we don't have to maintain a growing list.
      //this array serves as a poor mans hash
      //clients.splice(index, 1);
    });
});
