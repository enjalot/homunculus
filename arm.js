
var WebSocket = require('./client').WebSocket;
var settings = require('./settings');

var host = process.env.HEADHOST || "localhost";
var port = process.env.HEADPORT || settings.headPort || 1337;
var ws = new WebSocket("http://" + host + ":" + port);
console.log(host, port);

ws.onopen = function() {
  console.log("open...");
  //let the head know we are an arm
  //ws.send("arm");
  //open a connection to leap
  var leap = new WebSocket("http://localhost:6437");
  leap.onopen = function(event) {
    console.log("leap connected");
  };

  // On message received
  leap.onmessage = function(message) {
    //console.log("leap msg: " +  message);
    console.log("sending")
    ws.send(JSON.stringify(message));
  };

}

ws.onmessage = function(message) {
  console.log("rcv msg", message);
}


