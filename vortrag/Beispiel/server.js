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
 
var boxes = {};

io.sockets.on('connection', function(socket) {
	socket.emit("data", boxes); 

	broadcast(socket, "drag");
	broadcast(socket, "new");
	broadcast(socket, "kill");
	broadcast(socket, "message");
	
	socket.on("kill", function(data) {
		delete boxes[data.n]; 
	}); 
});
function broadcast(socket, event) {
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

		socket.broadcast.emit(event, data); 
	});
}