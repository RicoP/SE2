var app = require('http').createServer(handler), io = require('socket.io').listen(app), fs = require('fs');

app.listen(8008);

console.log("SE2 DEmo auf Port 8008.")

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

io.sockets.on('connection', function(socket) {
	socket.emit('news', {
		hello : 'world'
	});
	socket.on('my other event', function(data) {
		console.log(data);
	});
});
