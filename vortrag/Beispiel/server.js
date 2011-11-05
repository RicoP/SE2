var app = require('http').createServer(handler), //
io = require('socket.io').listen(app), //
fs = require('fs');

app.listen(8008);

console.log("SE2 Demo auf Port 8008.")

function handler(req, res) {
	fs.readFile(__dirname + '/index.html', function(err, data) {
		if(err) {
			res.writeHead(500);
			res.end('Error loading index.html');
			return;
		}

		res.writeHead(200);
		res.end(data);
	});
}

var sessions = [];

io.sockets.on('connection', function(socket) {
	sessions.push(socket);

	broadcast(socket, sessions, "drag");
	broadcast(socket, sessions, "new");
	broadcast(socket, sessions, "kill");
	broadcast(socket, sessions, "message"); 
});

function broadcast(socket, sessions, event) {
	socket.on(event, function(data) {
		for(var i = 0; i != sessions.length; i++) {
			if(socket !== sessions[i]) {
				var s = sessions[i];
				s.emit(event, data);
			}
		}
	});
}