var http = require('http');
var io = require('socket.io');
var fs = require('fs');
const { exec } = require('child_process');
var index = fs.readFileSync(__dirname + '/index.html');

var inputQ = [];
var curClicked = null;
var lastConsumed=0;
var minimumWaitTime=200;
var holdTime=200;

var validateButton = function(btn) {
        console.log('User hit '+btn);
	if (btn=='Left') inputQ.push(btn);
	if (btn=='Right') inputQ.push(btn);
	if (btn=='Up') inputQ.push(btn);
	if (btn=='Down') inputQ.push(btn);

	if (btn=='x') inputQ.push(btn);
	if (btn=='z') inputQ.push(btn);

	if (btn=='Return') inputQ.push(btn);
	if (btn=='BackSpace') inputQ.push(btn);
	consumeNextInput();
	
}

var consumeNextInput = function() {
  var elapsedTime = new Date().getTime() - lastConsumed;
  if (elapsedTime>=minimumWaitTime) {
    if (inputQ.length) {
      lastConsumed=new Date().getTime();
      exec('export DISPLAY=:99; xdotool key --delay '+holdTime+' '+inputQ[0]+' &');
      inputQ.shift();
    }
  }
}

setInterval(function(){
  exec('export DISPLAY=:99; xdotool key --delay 200 Ctrl+s &');
},30*60*1000);

setInterval(function(){
  consumeNextInput();
}, minimumWaitTime);

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
	validateButton(data.btn)
    });

});

app.listen(3000);
