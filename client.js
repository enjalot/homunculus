//from http://stackoverflow.com/questions/3842565/is-there-a-browserless-websocket-client-for-node-js-that-does-not-need-to-use-a
var WebSocketClient = require('websocket').client;

exports.WebSocket = function (uri) {
  var self = this;
  this.connection = null;
  this.socket = new WebSocketClient();
  this.socket.on('connect', function (connection) {
    self.connection = connection;

    connection.on('error', function (error) {
      self.onerror();
    });

    connection.on('close', function () {
      self.onclose();
    });

    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        self.onmessage({data:message.utf8Data});
      }
    });

    self.onopen();
  });
  this.socket.connect(uri);
}

exports.WebSocket.prototype.send = function (data) {
  this.connection.sendUTF(data);
}
