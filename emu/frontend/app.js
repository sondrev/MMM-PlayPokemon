var http = require('http');
var io = require('socket.io');
var fs = require('fs');
const { exec } = require('child_process');
var index = fs.readFileSync(__dirname + '/index.html');

var inputQ = [];
var curClicked = null;



var clickButton = function(btn) {
    
}

setInterval(function(){
  if (curClicked!=null) {
    exec('export DISPLAY=:99; xdotool keyup '+curClicked);
    curClicked = null;
  } else if (inputQ.length){
    curClicked = inputQ[0];
    console.log('consuming '+curClicked);
    exec('export DISPLAY=:99; xdotool keydown '+curClicked);    
    inputQ.shift();
  }
}, 100);

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

var io = require('socket.io').listen(app);
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('i am client', console.log);
    socket.on('button', function(data) {
        console.log('User hit '+data.btn);
	inputQ.push(data.btn);
    });

});

app.listen(3000);
