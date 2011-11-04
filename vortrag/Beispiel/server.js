var app = require('http').createServer(handler), io = require('socket.io').listen(app), fs = require('fs'), url = require("url");

app.listen(8008);

function handler(req, res) {
	var path = url.parse(req.url).pathname;
	if(path === '/token') {
		var token = getNewToken();
		res.writeHead(200, {"Cache-Control" : "no-cache"}); 
		res.write(token);
		res.end(""); 
	} else {
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
}

io.sockets.on('connection', function(socket) {
	socket.emit('news', {
		hello : 'world'
	});
	socket.on('my other event', function(data) {
		console.log(data);
	});
});
var getNewToken = (function() {
	var token = 0;

	return function(req, res) {
		return "_" + (token++);
	};
})();
