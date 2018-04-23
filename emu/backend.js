var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var spawn = require('child_process').spawn;
var _ = require('underscore');
//var fs = require('fs')
var fs = require('file-system');
var path = require('path')
var lastScreenshot=0
var screenshotDelay=100;


const DISPLAY=99
const W=480
const H=430
const L=0
const T=26
const WT=W+L
const HT=H+T

const INSTALL_LOCATION="../"
const IMAGE_TARGET=INSTALL_LOCATION+"image.png"

var closeEmulator = function() {
  //execSync('export DISPLAY=:99; xdotool key --delay 200 Ctrl+s &');
  //execSync('export DISPLAY=:99; xdotool key --delay 200 Esc');
}

var killOtherInstances = function() {
  try {
    execSync('pgrep Xvfb | xargs kill -9')
    execSync('pgrep visualboy | xargs kill -9')
  } catch(error) {

  }
}

var startXvfb = function() {
  console.log("Starting Xvfb")
  exec('export DISPLAY=:99; Xvfb -ac :'+DISPLAY+' -screen 0 '+WT+'x'+HT+'x24', {stdio:[0,1,2]})
  //xvfb.stdout.pipe(process.stdout);
  //xvfb.stderr.pipe(process.stderr);
  setTimeout(startEmulator, 200);
}

var startEmulator = function() {
  console.log("Starting emulator")
  var emulator = execSync('export DISPLAY=:99; ./visualboyadvance-m ./rom.gb &', {stdio:[0,1,2]})
  setTimeout(startRecording, 200);
}

var takeXVFBScreenshot = function() {
  execSync('export DISPLAY=:99; import -display :99 -window root -crop '+W+'x'+H+'+'+L+'+'+T+' '+IMAGE_TARGET, {stdio:[0,1,2]})
}

var takeScreenshot = function() {
  var t1= Date.now();
  execSync('export DISPLAY=:99; xdotool key --delay 100 m');
  var all = findAllScreenshots('.');
  if (all.length) {
    var newest = findNewestFile(all)
    fs.copyFileSync(newest, IMAGE_TARGET)
    deleteFiles(all)
  }
  var t2= Date.now();
  setTimeout(takeScreenshot,Math.max(screenshotDelay-(t2-t1),0) );
}

var startRecording = function() {
  console.log("Starting recording to "+IMAGE_TARGET)
  takeScreenshot();
}

var findAllScreenshots = function(dir) {
  var files = fs.readdirSync('.');
  files= _.filter(files,function(f) {
    return f.startsWith('rom') && f.endsWith('.png')
  })
  return files
}

var deleteFiles = function(files) {
  _.forEach(files,function(f) {fs.unlinkSync(f)})
}

var findNewestFile = function(files) {
  return _.max(files, function (f) {
    var fullpath = path.join('.', f);
    return fs.statSync(fullpath).ctime;
});
}

killOtherInstances();
startXvfb();

process.stdin.resume();//so the program will not close instantly
function exitHandler(options, err) {
    console.log('Quiting')
    closeEmulator();
    console.log('Emulator safely closed')
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
