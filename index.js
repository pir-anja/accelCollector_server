const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


/* const io = require("socket.io")(server, {
  cors: {
    origin: "file:///C:/Users/anja/Documents/SS21/BA/socket.IO_accelCollector/index3.html",
    methods: ["GET", "POST"]
  }
});*/

/*overload the default console.log function so that it writes into a log file
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/accel.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { 
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
//*/

var fs = require('fs');
var util = require('util');
var phone_log_file = fs.createWriteStream(__dirname + '/phoneLeftAccelData.log', {flags : 'w'});
var phone_log_stdout = process.stdout;

phonelog = function(d) { 
  phone_log_file.write(util.format(d) + '\n');
  phone_log_stdout.write(util.format(d) + '\n');
};

var eSense_log_file = fs.createWriteStream(__dirname + '/eSenseLeftData.log', {flags : 'w'});
var eSense_log_stdout = process.stdout;

eSenselog = function(d) { 
  eSense_log_file.write(util.format(d) + '\n');
  eSense_log_stdout.write(util.format(d) + '\n');
};

var watch_log_file = fs.createWriteStream(__dirname + '/watchLeftAccelData.log', {flags : 'w'});
var watch_log_stdout = process.stdout;

watchlog = function(d) { 
  watch_log_file.write(util.format(d) + '\n');
  watch_log_stdout.write(util.format(d) + '\n');
};

var phone_right_log_file = fs.createWriteStream(__dirname + '/phoneRightAccelData.log', {flags : 'w'});
var phone_right_log_stdout = process.stdout;

phonerightlog = function(d) { 
  phone_right_log_file.write(util.format(d) + '\n');
  phone_right_log_stdout.write(util.format(d) + '\n');
};

var eSense_right_log_file = fs.createWriteStream(__dirname + '/eSenseRightData.log', {flags : 'w'});
var eSense_right_log_stdout = process.stdout;

eSenserightlog = function(d) { 
  eSense_right_log_file.write(util.format(d) + '\n');
  eSense_right_log_stdout.write(util.format(d) + '\n');
};

var watch_right_log_file = fs.createWriteStream(__dirname + '/watchRightAccelData.log', {flags : 'w'});
var watch_right_log_stdout = process.stdout;

watchrightlog = function(d) { 
  watch_right_log_file.write(util.format(d) + '\n');
  watch_right_log_stdout.write(util.format(d) + '\n');
};

var phone_right_gyro_log_file = fs.createWriteStream(__dirname + '/phoneRightGyroData.log', {flags : 'w'});
var phone_right_gyro_log_stdout = process.stdout;

phonerightgyrolog = function(d) { 
  phone_right_gyro_log_file.write(util.format(d) + '\n');
  phone_right_gyro_log_stdout.write(util.format(d) + '\n');
};

var phone_left_gyro_log_file = fs.createWriteStream(__dirname + '/phoneLeftGyroData.log', {flags : 'w'});
var phone_left_gyro_log_stdout = process.stdout;

phoneleftgyrolog = function(d) { 
  phone_left_gyro_log_file.write(util.format(d) + '\n');
  phone_left_gyro_log_stdout.write(util.format(d) + '\n');
};

var phone_right_magnetic_log_file = fs.createWriteStream(__dirname + '/phoneRightMagneticData.log', {flags : 'w'});
var phone_right_magnetic_log_stdout = process.stdout;

phonerightmagneticlog = function(d) { 
  phone_right_magnetic_log_file.write(util.format(d) + '\n');
  phone_right_magnetic_log_stdout.write(util.format(d) + '\n');
};

var phone_left_magnetic_log_file = fs.createWriteStream(__dirname + '/phoneLeftMagneticData.log', {flags : 'w'});
var phone_left_magnetic_log_stdout = process.stdout;

phoneleftmagneticlog = function(d) { 
  phone_left_magnetic_log_file.write(util.format(d) + '\n');
  phone_left_magnetic_log_stdout.write(util.format(d) + '\n');
};

var watch_right_gyro_log_file = fs.createWriteStream(__dirname + '/watchRightGyroData.log', {flags : 'w'});
var watch_right_gyro_log_stdout = process.stdout;

watchrightgyrolog = function(d) { 
  watch_right_gyro_log_file.write(util.format(d) + '\n');
  watch_right_gyro_log_stdout.write(util.format(d) + '\n');
};

var watch_left_gyro_log_file = fs.createWriteStream(__dirname + '/watchLeftGyroData.log', {flags : 'w'});
var watch_left_gyro_log_stdout = process.stdout;

watchleftgyrolog = function(d) { 
  watch_left_gyro_log_file.write(util.format(d) + '\n');
  watch_left_gyro_log_stdout.write(util.format(d) + '\n');
};

var eSense_right_converted_log_file = fs.createWriteStream(__dirname + '/eSenseRightConvertedData.log', {flags : 'w'});
var eSense_right_converted_log_stdout = process.stdout;

eSenseconvertedrightlog = function(d) { 
  eSense_right_converted_log_file.write(util.format(d) + '\n');
  eSense_right_converted_log_stdout.write(util.format(d) + '\n');
};
var eSense_left_converted_log_file = fs.createWriteStream(__dirname + '/eSenseLeftConvertedData.log', {flags : 'w'});
var eSense_left_converted_log_stdout = process.stdout;

eSenseconvertedleftlog = function(d) { 
  eSense_left_converted_log_file.write(util.format(d) + '\n');
  eSense_left_converted_log_stdout.write(util.format(d) + '\n');
};



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index2.html');
});

app.get('/vid1', (req, res) => {
  res.sendFile(__dirname + '/vid1.html');
});

app.get('/exercise1', (req, res) => {
  res.sendFile(__dirname + '/exercise1.html');
});
app.get('/exercise2', (req, res) => {
  res.sendFile(__dirname + '/exercise2.html');
});
app.get('/exercise3', (req, res) => {
  res.sendFile(__dirname + '/exercise3.html');
});

var user_id = "user_00";

io.on('connection', (socket) => {

  console.log(`Socket ${socket.id} connected.`);
  

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });

  socket.on('start ex1?', () => {
   socket.broadcast.emit('start ex1!');
    console.log('start exercise 1');
  });

  socket.on('start ex2?', () => {
    socket.broadcast.emit('start ex2!');
     console.log('start exercise 2');
   });

   socket.on('start ex3?', () => {
    socket.broadcast.emit('start ex3!');
     console.log('start exercise 3');
   });

  socket.on('phone accel data left', (msg) => {
    io.emit('phone accel data left', msg);
    //console.log('phone data: ' + msg);
    phonelog(msg);
  });

  socket.on('phone gyro data left', (msg) => {
    
    //console.log('phone data: ' + msg);
    phoneleftgyrolog(msg);
  });

  socket.on('phone magnetic data left', (msg) => {
    
    //console.log('phone data: ' + msg);
    phoneleftmagneticlog(msg);
  });

  socket.on('esense data left', (msg) => {
    io.emit('esense data left', msg);
    //console.log('eSense data: ' + msg);
    eSenselog(msg);
  });

  socket.on('watch accel data left', (msg) => {
    io.emit('watch accel data left', msg);
    //console.log('watch data: ' + msg);
    watchlog(msg);
  });

  socket.on('watch gyro data left', (msg) => {
    //io.emit('watch gyro data left', msg);
    //console.log('watch data: ' + msg);
    watchleftgyrolog(msg);
  });

  socket.on('watch gyro data right', (msg) => {
    //io.emit('watch gyro data left', msg);
    //console.log('watch data: ' + msg);
    watchrightgyrolog(msg);
  });

  socket.on('phone accel data right', (msg) => {
    io.emit('phone accel data right', msg);
    //console.log('phone data: ' + msg);
    phonerightlog(msg);
  });

  socket.on('phone gyro data right', (msg) => {
    
    //console.log('phone data: ' + msg);
    phonerightgyrolog(msg);
  });

  socket.on('phone magnetic data right', (msg) => {
    
    //console.log('phone data: ' + msg);
    phonerightmagneticlog(msg);
  });

  socket.on('esense data right', (msg) => {
    io.emit('esense data right', msg);
    //console.log('eSense data: ' + msg);
    eSenserightlog(msg);
  });

  socket.on('watch accel data right', (msg) => {
    io.emit('watch accel data right', msg);
    //console.log('watch data: ' + msg);
    watchrightlog(msg);
  });

  socket.on('esense converted data right', (msg) => {
    io.emit('esense converted data right', msg);
    //console.log('eSense data: ' + msg);
    eSenseconvertedrightlog(msg);
  });

  socket.on('esense converted data left', (msg) => {
    io.emit('esense converted data left', msg);
    //console.log('eSense data: ' + msg);
    eSenseconvertedleftlog(msg);
  });

  socket.on('start recording', () => {
    phonelog(user_id);
    eSenselog(user_id);
    watchlog(user_id);
    phonerightlog(user_id);
    eSenserightlog(user_id);
    watchrightlog(user_id);
    phoneleftgyrolog(user_id);
    phonerightgyrolog(user_id);
    phonerightmagneticlog(user_id);
    phoneleftmagneticlog(user_id);
    watchrightgyrolog(user_id);
    watchleftgyrolog(user_id);
    eSenseconvertedrightlog(user_id);
    eSenseconvertedleftlog(user_id);
    socket.broadcast.emit('start recording');
    console.log('started recording!');

  });

  socket.on('stop recording', () => {
    socket.broadcast.emit('stop recording');
    console.log('stopped recording!');
    
  });

  socket.on('phone side connect', (msg) => {
    socket.broadcast.emit('phone side connect', msg);
    console.log('Phone ' + msg + ' connected');
  });

  socket.on('phone connect', (msg) => {
    socket.broadcast.emit('phone connect', msg);
    console.log('Phone connected');
  });

  
  socket.on('esense side connect', (msg) => {
    socket.broadcast.emit('esense side connect',msg);
    console.log('eSense ' + msg + ' connected');
  });

  socket.on('watch connect', (msg) => {
    socket.broadcast.emit('watch connect', msg);
    console.log('Smartwatch connected');
  });

  socket.on('watch side connect', (msg) => {
    socket.broadcast.emit('watch side connect', msg);
    console.log('Watch ' + msg + ' connected');
  });

  socket.on('user id', (msg) => {
    //io.emit('user id', msg);
    console.log('user id: ' + msg);
    user_id = msg;
  });

  


  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});




/*
const http2 = require('http');
const server2 = http2.createServer(app);
const io2 = require("socket.io")
server2.listen(8080, () => {
  console.log('listening on *:8080');
});*/

