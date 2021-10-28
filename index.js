/* 
 * Server of the application
 * Wearable devices send sensor data, server writes them to correct log file
 * Connects devices via WebSocket
 * Handles and transfers WebSocket events to and from clients
 */
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// higher ping time out and interval prevents wearable devices from constantly disconnecting
const io = new Server(server, {
  pingTimeout: 60000, pingInterval: 120000
});

var fs = require('fs');
var util = require('util');

var root_dir = '/UserStudy_Data';
var curr_user;
var curr_pace;
var curr_exercise;

var files = {};
const socketID_map = new Map();

const Device = {
  Phone_left: 'Phone_left',
  Phone_right: 'Phone_right',
  eSense_left: 'eSense_left',
  eSense_right: 'eSense_right',
  Watch_left: 'Watch_left',
  Watch_right: 'Watch_right',
};

// creates log files and write streams sensor data is logged in
function createWriteStreams(u, e, p, d) {
  if ((d != 'eSense_left') && (d != 'eSense_right')) {
    files[u + '_' + e + '_' + p + '_' + d + '_accel'] = fs.createWriteStream(__dirname + root_dir + '/' + u + '/' + e + '/' + p + '/' + d + '_accel.log', { flags: 'w' });
    files[u + '_' + e + '_' + p + '_' + d + '_gyro'] = fs.createWriteStream(__dirname + root_dir + '/' + u + '/' + e + '/' + p + '/' + d + '_gyro.log', { flags: 'w' });
    files[u + '_' + e + '_' + p + '_' + d + '_magnet'] = fs.createWriteStream(__dirname + root_dir + '/' + u + '/' + e + '/' + p + '/' + d + '_magnet.log', { flags: 'w' });
  } else {
    files[u + '_' + e + '_' + p + '_' + d + '_all'] = fs.createWriteStream(__dirname + root_dir + '/' + u + '/' + e + '/' + p + '/' + d + '_all.log', { flags: 'w' });
    files[u + '_' + e + '_' + p + '_' + d + '_accelConverted'] = fs.createWriteStream(__dirname + root_dir + '/' + u + '/' + e + '/' + p + '/' + d + '_accelConverted.log', { flags: 'w' });
  }
}

//insert header lines in log files that explain CSV format
function insertHeaders (u, e, p) {
  files[u + '_' + e + '_' + p + '_Phone_left_accel'].write(util.format('Phone left accelerometer data: timestamp,accel_x,accel_y,accel_z') + '\n');
      files[u + '_' + e + '_' + p +  '_Phone_left_gyro'].write(util.format('Phone left gyroscope data: timestamp,gyro_x,gyro_y,gyro_z') + '\n');
      files[u + '_' + e + '_' + p +  '_Phone_left_magnet'].write(util.format('Phone left magnetometer data: timestamp,magnet_x,magnet_y,magnet_z') + '\n');

      files[u + '_' + e + '_' + p + '_Phone_right_accel'].write(util.format('Phone right accelerometer data: timestamp,accel_x,accel_y,accel_z') + '\n');
      files[u + '_' + e + '_' + p + '_Phone_right_gyro'].write(util.format('Phone right gyroscope data: timestamp,gyro_x,gyro_y,gyro_z') + '\n');
      files[u + '_' + e + '_' + p +  '_Phone_right_magnet'].write(util.format('Phone right magnetometer data: timestamp,magnet_x,magnet_y,magnet_z') + '\n');

      files[u + '_' + e + '_' + p +  '_Watch_left_accel'].write(util.format('Watch left accelerometer data: timestamp,accel_x,accel_y,accel_z') + '\n');
      files[u + '_' + e + '_' + p +  '_Watch_left_gyro'].write(util.format('Watch left gyroscope data: timestamp,gyro_x,gyro_y,gyro_z') + '\n');
      files[u + '_' + e + '_' + p + '_Watch_left_magnet'].write(util.format('Watch left magnetometer data: timestamp,magnet_x,magnet_y,magnet_z') + '\n');

      files[u + '_' + e + '_' + p +  '_Watch_right_accel'].write(util.format('Watch right accelerometer data: timestamp,accel_x,accel_y,accel_z') + '\n');
      files[u + '_' + e + '_' + p + '_Watch_right_gyro'].write(util.format('Watch right gyroscope data: timestamp,gyro_x,gyro_y,gyro_z') + '\n');
      files[u + '_' + e + '_' + p +  '_Watch_right_magnet'].write(util.format('Watch right magnetometer data: timestamp,magnet_x,magnet_y,magnet_z') + '\n');

      files[u + '_' + e + '_' + p +  '_eSense_left_all'].write(util.format('eSense left accelerometer and gyroscope data: timestamp,accel_x,accel_y,accel_z,gyro_x,gyro_y,gyro_z') + '\n');
      files[u + '_' + e + '_' + p +  '_eSense_left_accelConverted'].write(util.format('eSense left accelerometer data converted to m/s^2: timestamp,accel_x,accel_y,accel_z') + '\n');

      files[u + '_' + e + '_' + p +  '_eSense_right_all'].write(util.format('eSense right accelerometer and gyroscope data: timestamp,accel_x,accel_y,accel_z,gyro_x,gyro_y,gyro_z') + '\n');
      files[u + '_' + e + '_' + p +  '_eSense_right_accelConverted'].write(util.format('eSense right accelerometer data converted to m/s^2: timestamp,accel_x,accel_y,accel_z') + '\n');
}

//logs data to specifiic file, e.g. to User1/Exercise2/Slow/Phone_left_gyro.log
logData = function (device, dataKind, msg) {
  if (typeof curr_user === 'undefined' || typeof curr_pace  === 'undefined' ) {
    io.emit('alert');
    return;
  }
  if (typeof msg === 'undefined') {
    return;
  } else {
    files[curr_user + '_' + curr_exercise + '_' + curr_pace + '_' + device + '_' + dataKind].write(util.format(msg) + '\n');
  }
};


//different views for study director and user
//study director view
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//webcam test
app.get('/cam', (req, res) => {
  res.sendFile(__dirname + '/webcam_test.html');
});

// user view
app.get('/exercises', (req, res) => {
  res.sendFile(__dirname + '/exercises.html');
});

//socket events
io.on('connection', (socket) => {

  console.log(`Socket ${socket.id} connected.`);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });

  socket.on('start ex?', (msg) => {
    if (typeof curr_user === 'undefined' || typeof curr_pace  === 'undefined' ) {
      io.emit('alert');
      return;
    }

    for (var d = 0; d < Object.keys(Device).length; d++) {
      createWriteStreams(curr_user, 'Exercise' + msg, curr_pace, (Object.keys(Device))[d]);
    }

    insertHeaders(curr_user, 'Exercise' + msg, curr_pace);
    socket.broadcast.emit('start ex!', msg + ',' + curr_pace);
    console.log('start exercise ' + msg);
    socket.emit('button press start');
    curr_exercise = 'Exercise' + msg;
  });

  socket.on('stop vid', () => {
    console.log('finished exercise');
    io.emit('button press stop');
  });

  //different kinds of sensor data events
  socket.on('phone accel data left', (msg) => {
    io.emit('phone accel data left', msg);
    logData('Phone_left', 'accel', msg);
  });

  socket.on('phone gyro data left', (msg) => {
    logData('Phone_left', 'gyro', msg);
  });

  socket.on('phone magnetic data left', (msg) => {
    logData('Phone_left', 'magnet', msg);
  });

  socket.on('esense data left', (msg) => {
    io.emit('esense data left', msg);
    logData('eSense_left', 'all', msg);
  });

  socket.on('watch accel data left', (msg) => {
    io.emit('watch accel data left', msg);
    logData('Watch_left', 'accel', msg);
  });

  socket.on('watch gyro data left', (msg) => {
    logData('Watch_left', 'gyro', msg);
  });

  socket.on('watch gyro data right', (msg) => {
    logData('Watch_right', 'gyro', msg);
  });

  socket.on('phone accel data right', (msg) => {
    io.emit('phone accel data right', msg);
    logData('Phone_right', 'accel', msg);
  });

  socket.on('phone gyro data right', (msg) => {
    logData('Phone_right', 'gyro', msg);
  });

  socket.on('phone magnetic data right', (msg) => {
    logData('Phone_right', 'magnet', msg);
  });

  socket.on('esense data right', (msg) => {
    io.emit('esense data right', msg);
    logData('eSense_right', 'all', msg);
  });

  socket.on('watch accel data right', (msg) => {
    io.emit('watch accel data right', msg);
    logData('Watch_right', 'accel', msg);
  });

  socket.on('esense converted data right', (msg) => {
    logData('eSense_right', 'accelConverted', msg);
  });

  socket.on('esense converted data left', (msg) => {
    logData('eSense_left', 'accelConverted', msg);
  });

  // signal wearable devices to start recording sensor data and send it to server
  socket.on('start recording', () => {
    socket.broadcast.emit('start recording');
    console.log('started recording!');
  });

  // signal wearable devices to stop recording sensor data
  socket.on('stop recording', () => {
    socket.broadcast.emit('stop recording');
    console.log('stopped recording!');

  });

  // wearable devices connection events
  socket.on('phone side connect', (msg) => {
    socket.broadcast.emit('phone side connect', msg);
    console.log('Phone ' + msg + ' connected');
    socketID_map.set(socket.id, 'Phone ' + msg);
  });

  socket.on('phone connect', (msg) => {
    socket.broadcast.emit('phone connect', msg);
    console.log('Phone connected');
  });

  socket.on('esense side connect', (msg) => {
    socket.broadcast.emit('esense side connect', msg);
    console.log('eSense ' + msg + ' connected');
    socketID_map.set(socket.id, 'eSense ' + msg);
  });

  socket.on('watch connect', (msg) => {
    socket.broadcast.emit('watch connect', msg);
    console.log('Smartwatch connected');
  });

  socket.on('watch side connect', (msg) => {
    socket.broadcast.emit('watch side connect', msg);
    console.log('Watch ' + msg + ' connected');
    socketID_map.set(socket.id, 'Watch ' + msg);
  });

  // receive current user id and pace from study leader gui
  socket.on('user id', (msg) => {
    console.log('user id: ' + msg);
    curr_user = msg;
  });

  socket.on('pace', (msg) => {
    console.log('pace: ' + msg);
    curr_pace = msg;
  });

  socket.on('jump', (msg) => {
    logAll('expect jump at ' + msg);
    console.log('expect jump at ' + msg);
  });

  //start, pause and resume videos on user gui
  socket.on('started vid', (msg) => {
    logData('Phone_left', 'accel', 'started video at ' + msg);
    console.log('started video at ' + msg);
  });

  socket.on('pause vid temp', () => {
    socket.broadcast.emit('pause vid temp');
    console.log('pause video');
  });

  socket.on('resume vid temp', () => {
    socket.broadcast.emit('resume vid temp');
    console.log('resume video');
  });

  // wearable device disconnects
  socket.on('disconnect', (msg) => {
      console.log (socketID_map.get(socket.id) + ' disconnected because of ' + msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});


