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

        if ((Object.keys(Device))[d] != 'eSense_left' && (Object.keys(Device))[d] != 'eSense_right') {
          files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_accel'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] + '_accel.log', { flags: 'w' });
          files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_gyro'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] + '_gyro.log', { flags: 'w' });
          files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_magnet'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] + '_magnet.log', { flags: 'w' });
        } else {
          files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_all'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] + '_all.log', { flags: 'w' });
          files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_' + (Object.keys(Device))[d] + '_accelConverted'] = fs.createWriteStream(__dirname + root_dir + '/' + (Object.keys(User))[u] + '/' + (Object.keys(Exercise))[e] + '/' + (Object.keys(Pace))[p] + '/' + (Object.keys(Device))[d] + '_accelConverted.log', { flags: 'w' });
        }

      }
    }
  }
}

//test
//files['User1_Exercise2_Slow_Phone_left_gyro'].write(util.format('hello world') + '\n');

//insert headers that describe the CSV data format
for (var u = 0; u < Object.keys(User).length; u++) {
  for (var e = 0; e < Object.keys(Exercise).length; e++) {
    for (var p = 0; p < Object.keys(Pace).length; p++) {

      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Phone_left_accel'].write(util.format('Phone left accelerometer data: timestamp,accel_x,accel_y,accel_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Phone_left_gyro'].write(util.format('Phone left gyroscope data: timestamp,gyro_x,gyro_y,gyro_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Phone_left_magnet'].write(util.format('Phone left magnetometer data: timestamp,magnet_x,magnet_y,magnet_z') + '\n');

      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Phone_right_accel'].write(util.format('Phone right accelerometer data: timestamp,accel_x,accel_y,accel_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Phone_right_gyro'].write(util.format('Phone right gyroscope data: timestamp,gyro_x,gyro_y,gyro_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Phone_right_magnet'].write(util.format('Phone right magnetometer data: timestamp,magnet_x,magnet_y,magnet_z') + '\n');

      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Watch_left_accel'].write(util.format('Watch left accelerometer data: timestamp,accel_x,accel_y,accel_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Watch_left_gyro'].write(util.format('Watch left gyroscope data: timestamp,gyro_x,gyro_y,gyro_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Watch_left_magnet'].write(util.format('Watch left magnetometer data: timestamp,magnet_x,magnet_y,magnet_z') + '\n');

      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Watch_right_accel'].write(util.format('Watch right accelerometer data: timestamp,accel_x,accel_y,accel_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Watch_right_gyro'].write(util.format('Watch right gyroscope data: timestamp,gyro_x,gyro_y,gyro_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_Watch_right_magnet'].write(util.format('Watch right magnetometer data: timestamp,magnet_x,magnet_y,magnet_z') + '\n');

      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_eSense_left_all'].write(util.format('eSense left accelerometer and gyroscope data: timestamp,accel_x,accel_y,accel_z,gyro_x,_gyro_y,gyro_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_eSense_left_accelConverted'].write(util.format('eSense left accelerometer data converted to m/s^2: timestamp,accel_x,accel_y,accel_z') + '\n');

      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_eSense_right_all'].write(util.format('eSense right accelerometer and gyroscope data: timestamp,accel_x,accel_y,accel_z,gyro_x,_gyro_y,gyro_z') + '\n');
      files[(Object.keys(User))[u] + '_' + (Object.keys(Exercise))[e] + '_' + (Object.keys(Pace))[p] + '_eSense_right_accelConverted'].write(util.format('eSense right accelerometer data converted to m/s^2: timestamp,accel_x,accel_y,accel_z') + '\n');


    }
  }
}


//logs data to file, e.g. to User1/Exercise2/Slow/Phone_left_gyro.log

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/cam', (req, res) => {
  res.sendFile(__dirname + '/webcam_test.html');
});

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
    //socket.broadcast.emit('start ex' + msg + '!');
    socket.broadcast.emit('start ex!', msg + ',' + curr_pace);

    console.log('start exercise ' + msg);
    socket.emit('button press start');
    curr_exercise = 'Exercise' + msg;
  });

  socket.on('stop vid', () => {
    console.log('finished exercise');
    io.emit('button press stop');
  });

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

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});


