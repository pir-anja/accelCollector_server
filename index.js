const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var fs = require('fs');
var util = require('util');

var root_dir = '/UserStudy_Data';
var curr_user;
var curr_pace;
var curr_exercise;

var files = {};

const Pace = {
  Slow: 'Slow',
  Normal: 'Normal',
  Fast: 'Fast',
};

const Exercise = {
  Exercise1: 'Exercise1',
  Exercise2: 'Exercise2',
  Exercise3: 'Exercise3',
  Exercise4: 'Exercise4',
  Exercise5: 'Exercise5',
  Exercise6: 'Exercise6',
  Exercise7: 'Exercise7',
  Exercise8: 'Exercise8',
  Exercise9: 'Exercise9',
  Exercise10: 'Exercise10',
};

const User = {
  User1: 'User1',
  User2: 'User2',
  User3: 'User3',
  User4: 'User4',
  User5: 'User5',
  User6: 'User6',
  User7: 'User7',
  User8: 'User8',
};

const Device = {
  Phone_left: 'Phone_left',
  Phone_right: 'Phone_right',
  eSense_left: 'eSense_left',
  eSense_right: 'eSense_right',
  Watch_left: 'Watch_left',
  Watch_right: 'Watch_right',
};


//create all write streams: associative array 'files' with User1_Exercise1_Slow_Phone_left_accel / gyro / magnet
for (var u = 0; u < Object.keys(User).length; u++) {
  for (var e = 0; e < Object.keys(Exercise).length; e++) {
    for (var p = 0; p < Object.keys(Pace).length; p++) {
      for (var d = 0; d < Object.keys(Device).length; d++) {
        files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_accel'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] +'_accel.log', { flags: 'w' });
        files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_gyro'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] +'_gyro.log', { flags: 'w' });
        if ( (Object.keys(Device))[d] != 'eSense_left' && (Object.keys(Device))[d] != 'eSense_right') {
          files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_magnet'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] +'_magnet.log', { flags: 'w' });
        } else {
          files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_accelConverted'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] +'_accelConverted.log', { flags: 'w' });
        }
      
      }
    }
  }
}

//test
files['User1_Exercise2_Slow_Phone_left_gyro'].write(util.format('hi') + '\n');


//logs data to file, e.g. to User1/Exercise2/Slow/Phone_left_gyro.log
logData = function (device, dataKind, msg) {
  files[curr_user + '_' + curr_exercise + '_' + curr_pace + '_' + device + '_' + dataKind].write(util.format(msg) + '\n');
};



/*
//creates separate log files for every sensor: accelerometer, gyroscope and magnetometer if available
var phone_log_file = fs.createWriteStream(__dirname + '/phoneLeftAccelData.log', { flags: 'w' });
var phone_log_stdout = process.stdout;

phonelog = function (d) {
  phone_log_file.write(util.format(d) + '\n');
  phone_log_stdout.write(util.format(d) + '\n');
};

var eSense_log_file = fs.createWriteStream(__dirname + '/eSenseLeftData.log', { flags: 'w' });
var eSense_log_stdout = process.stdout;

eSenselog = function (d) {
  eSense_log_file.write(util.format(d) + '\n');
  eSense_log_stdout.write(util.format(d) + '\n');
};

var watch_log_file = fs.createWriteStream(__dirname + '/watchLeftAccelData.log', { flags: 'w' });
var watch_log_stdout = process.stdout;

watchlog = function (d) {
  watch_log_file.write(util.format(d) + '\n');
  watch_log_stdout.write(util.format(d) + '\n');
};

var phone_right_log_file = fs.createWriteStream(__dirname + '/phoneRightAccelData.log', { flags: 'w' });
var phone_right_log_stdout = process.stdout;

phonerightlog = function (d) {
  phone_right_log_file.write(util.format(d) + '\n');
  phone_right_log_stdout.write(util.format(d) + '\n');
};

var eSense_right_log_file = fs.createWriteStream(__dirname + '/eSenseRightData.log', { flags: 'w' });
var eSense_right_log_stdout = process.stdout;

eSenserightlog = function (d) {
  eSense_right_log_file.write(util.format(d) + '\n');
  eSense_right_log_stdout.write(util.format(d) + '\n');
};

var watch_right_log_file = fs.createWriteStream(__dirname + '/watchRightAccelData.log', { flags: 'w' });
var watch_right_log_stdout = process.stdout;

watchrightlog = function (d) {
  watch_right_log_file.write(util.format(d) + '\n');
  watch_right_log_stdout.write(util.format(d) + '\n');
};

var phone_right_gyro_log_file = fs.createWriteStream(__dirname + '/phoneRightGyroData.log', { flags: 'w' });
var phone_right_gyro_log_stdout = process.stdout;

phonerightgyrolog = function (d) {
  phone_right_gyro_log_file.write(util.format(d) + '\n');
  phone_right_gyro_log_stdout.write(util.format(d) + '\n');
};

var phone_left_gyro_log_file = fs.createWriteStream(__dirname + '/phoneLeftGyroData.log', { flags: 'w' });
var phone_left_gyro_log_stdout = process.stdout;

phoneleftgyrolog = function (d) {
  phone_left_gyro_log_file.write(util.format(d) + '\n');
  phone_left_gyro_log_stdout.write(util.format(d) + '\n');
};

var phone_right_magnetic_log_file = fs.createWriteStream(__dirname + '/phoneRightMagneticData.log', { flags: 'w' });
var phone_right_magnetic_log_stdout = process.stdout;

phonerightmagneticlog = function (d) {
  phone_right_magnetic_log_file.write(util.format(d) + '\n');
  phone_right_magnetic_log_stdout.write(util.format(d) + '\n');
};

var phone_left_magnetic_log_file = fs.createWriteStream(__dirname + '/phoneLeftMagneticData.log', { flags: 'w' });
var phone_left_magnetic_log_stdout = process.stdout;

phoneleftmagneticlog = function (d) {
  phone_left_magnetic_log_file.write(util.format(d) + '\n');
  phone_left_magnetic_log_stdout.write(util.format(d) + '\n');
};

var watch_right_gyro_log_file = fs.createWriteStream(__dirname + '/watchRightGyroData.log', { flags: 'w' });
var watch_right_gyro_log_stdout = process.stdout;

watchrightgyrolog = function (d) {
  watch_right_gyro_log_file.write(util.format(d) + '\n');
  watch_right_gyro_log_stdout.write(util.format(d) + '\n');
};

var watch_left_gyro_log_file = fs.createWriteStream(__dirname + '/watchLeftGyroData.log', { flags: 'w' });
var watch_left_gyro_log_stdout = process.stdout;

watchleftgyrolog = function (d) {
  watch_left_gyro_log_file.write(util.format(d) + '\n');
  watch_left_gyro_log_stdout.write(util.format(d) + '\n');
};

var eSense_right_converted_log_file = fs.createWriteStream(__dirname + '/eSenseRightConvertedData.log', { flags: 'w' });
var eSense_right_converted_log_stdout = process.stdout;

eSenseconvertedrightlog = function (d) {
  eSense_right_converted_log_file.write(util.format(d) + '\n');
  eSense_right_converted_log_stdout.write(util.format(d) + '\n');
};
var eSense_left_converted_log_file = fs.createWriteStream(__dirname + '/eSenseLeftConvertedData.log', { flags: 'w' });
var eSense_left_converted_log_stdout = process.stdout;

eSenseconvertedleftlog = function (d) {
  eSense_left_converted_log_file.write(util.format(d) + '\n');
  eSense_left_converted_log_stdout.write(util.format(d) + '\n');
};

logAll = function (input) {
  phonelog(input);
  eSenselog(input);
  watchlog(input);
  phonerightlog(input);
  eSenserightlog(input);
  watchrightlog(input);
  phoneleftgyrolog(input);
  phonerightgyrolog(input);
  phonerightmagneticlog(input);
  phoneleftmagneticlog(input);
  watchrightgyrolog(input);
  watchleftgyrolog(input);
  eSenseconvertedrightlog(input);
  eSenseconvertedleftlog(input);
}*/

//different views for study director and user

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index2.html');
});

app.get('/vid1', (req, res) => {
  res.sendFile(__dirname + '/vid1.html');
});

app.get('/exercises', (req, res) => {
  res.sendFile(__dirname + '/exercises.html');
});

//socket events

var user_id = "user_00";
var timestamp = -100;

io.on('connection', (socket) => {

  console.log(`Socket ${socket.id} connected.`);


  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });


  socket.on('start ex?', (msg) => {
    //socket.broadcast.emit('start ex' + msg + '!');
    socket.broadcast.emit('start ex!', msg);
    console.log('start exercise ' + msg);
    //curr_dir = '/Exercise 1';
    //logAll('start exercise ' + msg);
    socket.emit('button press');
    curr_exercise = 'Exercise' + msg;
  });

  socket.on('phone accel data left', (msg) => {
    io.emit('phone accel data left', msg);
    //console.log('phone data: ' + msg);
    //phonelog(msg);
    logData('Phone_left', 'accel', msg);
  });

  socket.on('phone gyro data left', (msg) => {

    //console.log('phone data: ' + msg);
    //phoneleftgyrolog(msg);
    logData('Phone_left', 'gyro', msg);
  });

  socket.on('phone magnetic data left', (msg) => {

    //console.log('phone data: ' + msg);
    //phoneleftmagneticlog(msg);
    logData('Phone_left', 'magnet', msg);
  });

  socket.on('esense data left', (msg) => {
    io.emit('esense data left', msg);
    //console.log('eSense data: ' + msg);
    //eSenselog(msg);
    logData('eSense_left', 'accel', msg);
  });

  socket.on('watch accel data left', (msg) => {
    io.emit('watch accel data left', msg);
    //console.log('watch data: ' + msg);
    //watchlog(msg);
    logData('Watch_left', 'accel', msg);
  });

  socket.on('watch gyro data left', (msg) => {
    //io.emit('watch gyro data left', msg);
    //console.log('watch data: ' + msg);
    //watchleftgyrolog(msg);
    logData('Watch_left', 'gyro', msg);
  });

  socket.on('watch gyro data right', (msg) => {
    //io.emit('watch gyro data left', msg);
    //console.log('watch data: ' + msg);
    //watchrightgyrolog(msg);
    logData('Watch_right', 'gyro', msg);
  });

  socket.on('phone accel data right', (msg) => {
    io.emit('phone accel data right', msg);
    //console.log('phone data: ' + msg);
    //phonerightlog(msg);
    logData('Phone_right', 'accel', msg);
    
  });

  socket.on('phone gyro data right', (msg) => {

    //console.log('phone data: ' + msg);
    //phonerightgyrolog(msg);
    logData('Phone_right', 'gyro', msg);
  });

  socket.on('phone magnetic data right', (msg) => {

    //console.log('phone data: ' + msg);
    //phonerightmagneticlog(msg);
    logData('Phone_right', 'magnet', msg);
  });

  socket.on('esense data right', (msg) => {
    io.emit('esense data right', msg);
    //console.log('eSense data: ' + msg);
    //eSenserightlog(msg);
    logData('eSense_right', 'accel', msg);
  });

  socket.on('watch accel data right', (msg) => {
    io.emit('watch accel data right', msg);
    //console.log('watch data: ' + msg);
    //watchrightlog(msg);
    logData('Watch_right', 'accel', msg);
  });

  socket.on('esense converted data right', (msg) => {
    //io.emit('esense converted data right', msg);
    //console.log('eSense data: ' + msg);
    //eSenseconvertedrightlog(msg);
    logData('eSense_right', 'accelConverted', msg);
  });

  socket.on('esense converted data left', (msg) => {
    //io.emit('esense converted data left', msg);
    //console.log('eSense data: ' + msg);
    //eSenseconvertedleftlog(msg);
    logData('eSense_left', 'accelConverted', msg);
  });

  socket.on('start recording', () => {
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
    socket.broadcast.emit('esense side connect', msg);
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
    //user_id = msg;
    curr_user = msg;
    //logAll('user id: ' + user_id);
  });

  socket.on('pace', (msg) => {
    //io.emit('user id', msg);
    console.log('pace: ' + msg);
    //user_id = msg;
    curr_pace = msg;
    //logAll('user id: ' + user_id);
  });

  socket.on('jump', (msg) => {
    //timestamp = msg;
    //phonelog('jumped at ' + timestamp);
    logAll('expect jump at ' + msg);
    console.log('expect jump at ' + msg);
  });

  socket.on('started vid', (msg) => {
    //timestamp = msg;
    //phonelog('jumped at ' + timestamp);
    logAll('started video at ' + msg);
    console.log('started video at ' + msg);
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

