var app = require('http').createServer(handler), //
io = require('socket.io').listen(app), //
fs = require('fs');

app.listen(8005);

console.log("SE2 Demo auf Port 8005.");
process.title = "node se2 demo"; 


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
var boxes = {};

io.sockets.on('connection', function(socket) {
	sessions.push(socket);
	
	socket.emit("data", boxes); 

	broadcast(socket, sessions, "drag");
	broadcast(socket, sessions, "new");
	broadcast(socket, sessions, "kill");
	broadcast(socket, sessions, "message");
	
	socket.on("kill", function(data) {
		delete boxes[data.n]; 
	}); 
});
function broadcast(socket, sessions, event) {
	socket.on(event, function(data) {
		//update box
		var box = boxes[data.n];
		if(box) {
			for(var k in data) {
				if(data.hasOwnProperty(k)) {
					box[k] = data[k];
				}
			}
		}
		else {
			boxes[data.n] = data; 
		}

		for(var i = 0; i != sessions.length; i++) {
			if(socket !== sessions[i]) {
				var s = sessions[i];
				s.emit(event, data);
			}
		}
	});
}