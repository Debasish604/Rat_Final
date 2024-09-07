const config = require('dotenv');
config.config({ path: '.env' });
const port = process.env.PORT || 5000;

const app = require('./app');
const socketIO = require('socket.io');
const http = require('http');
const db = require('./database/database');
let server = http.createServer(app);
let io = socketIO(server);
let join_data;
const JwtService = require('./service/jwtService');
const { MAX } = require('mssql');
const { resolve } = require('path');
const { rejects } = require('assert');
const looger = require('./logger');
let clipboardy;
(async () => {
  clipboardy = await import('clipboardy');
})();
// socket connection circuit
io.on('connection', (socket, cb) => {
  let roomMap = io.sockets.adapter.rooms;

  // Send socket ID to user
  socket.on('get_socket', (args, callback) => {
    callback(socket.id);
  });

  

  // User wants to connect to another user
  socket.on('join-message', async (arg, callback) => {
    let args = JSON.parse(arg);
    join_data = arg;
    let historyData = {
      "conFristName": args.user.Name.split(' ')[0],
      "conLastName": args.user.Name.split(' ')[1],
      "remoteFristtName": "",
      "remoteLastName": "",
      "connUserName": args.user.UserName,
      "RemoteUserName": "",
      "connIP": socket.client.conn.remoteAddress,
      "remoteIP": "",
      "sessionStart": new Date(),
      "sessionEnd": ""
    };
    let roomId = args.roomId;
    const conHistoryId = await insertAndUpdateHistory(historyData);
    let user_details = JSON.stringify({
      "user_details": args.user,
      "socket_id": socket.id,
      'roomId': args.roomId,
      "historyId": conHistoryId
    });
    await getSocketId(roomId, (callback) => {
      if (callback != 'offline') {
        let authHeader = args.authorization;
        try {
          let data = JwtService.verify(authHeader);
          io.to(callback).emit('access-request', user_details);
        } catch (err) {
          io.to(socket.id).emit('user-offline', 'You are an Unauthorized user.');
        }
      } else {
        io.to(socket.id).emit('user-offline', 'user offline');
      }
    });
  });

  socket.on('reject', async (data) => {
    let historyData = {
      "conFristName": "",
      "conLastName": "",
      "remoteFristtName": "",
      "remoteLastName": "",
      "connUserName": "",
      "RemoteUserName": "",
      "connIP": "",
      "remoteIP": "",
      "sessionStart": "",
      "sessionEnd": new Date(),
    };
    let jsondata = JSON.parse(data);
    const insertedId = await insertAndUpdateHistory(historyData, jsondata.historyId);
    io.to(jsondata.socket_id).emit('you-reject', data);
  });

  socket.on('RejectAfter', async (data) => {
    let historyData = {
      "conFristName": "",
      "conLastName": "",
      "remoteFristtName": "",
      "remoteLastName": "",
      "connUserName": "",
      "RemoteUserName": "",
      "connIP": "",
      "remoteIP": "",
      "sessionStart": "",
      "sessionEnd": new Date(),
    };
    let jsondata = JSON.parse(data);
    io.to(jsondata.socket_id).emit('you-reject-after', data);
  });

  // Accept message to request user
  socket.on('accept', async (data) => {
    let jsondata = JSON.parse(data);
    let historyData = {
      "conFristName": "",
      "conLastName": "",
      "remoteFristtName": jsondata.screendata.fristname,
      "remoteLastName": jsondata.screendata.lastname,
      "connUserName": "",
      "RemoteUserName": jsondata.screendata.username,
      "connIP": "",
      "remoteIP": socket.client.conn.remoteAddress,
      "sessionStart": "",
      "sessionEnd": "",
    };
    roomId = parseInt(jsondata.roomId);
    const insertedId = await insertAndUpdateHistory(historyData, jsondata.historyId);
    socket.join(roomId);
    io.to(jsondata.socket_id).emit('join-you', data);
  });

  // Request user join in a room
  socket.on('join', (data) => {
    let jsondata = JSON.parse(data);
    roomId = parseInt(jsondata.roomId);
    socket.join(roomId);
  });

  socket.on('shere-user-join', (roomId) => {
    if (!roomMap.has(socket.id)) {
      socket.join(roomId);
    }
  });
  socket.on('clipboard-copy', (data) => {
    socket.to(data.room).emit('clipboard-paste', { text: data.text });
  });

  getSocketId = async (uniqueId, callback) => {
    await db.poolconnect;
    try {
      const request = db.pool.request();
      request.input('uniqueId', db.mssql.Int, uniqueId);
      request.output('response', db.mssql.VarChar(2000))
        .execute('[dbo].[get_socket_id]').then(function (recordsets, err, returnValue, affected) {
          callback(recordsets.output.response);
        });
    } catch {
      return;
    }
  };

  const leaveOtherRooms = (socketID) => {
    if (roomMap.has(socketID)) {
      roomMap.forEach((value, key) => {
        if (value.size > 1) {
          let setVal = value;
          setVal.forEach((value, key) => {
            if (value == socketID) {
              setVal.delete(value);
            }
          });
        }
      });
    }
  };

  socket.on('room-leave', (roomId) => {
    socket.leave(roomId);
  });

  socket.on("disconnect", async () => {
    leaveOtherRooms(socket.id);
  });

  // Screen share start
  socket.on("screen-data", (data) => {
    data = JSON.parse(data);
    var room = data.room;
    var imgStr = data.image;
    socket.to(room).emit("scree-image", imgStr);
  });

  // Mouse movement
  socket.on('mouse-move', (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("move-mouse", data);
  });

  // Mouse click event
  socket.on('mouse-click', (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("click-mouse", data);
  });

  // Mouse scroll event
  socket.on("scroll", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("scroll", data);
  });
  socket.on("getdir",(data)=>{
    var Remote_socket_id = data
    //console.log('my socket_id',socket.id)
    console.log('socket_data remote userId',Remote_socket_id)
    io.to(Remote_socket_id).emit('driverRequest',socket.id)
  })
  socket.on('RemoteReadFile',(data)=>{
    let obj =JSON.parse(data);
    let reId = obj.rclientid;
    obj.userId=socket.id
    console.log("recive remote user", obj)
    io.to(reId).emit('fileReadRequest',JSON.stringify(obj));
  })

  socket.on('sharefile',(data)=>{
    console.log('data',data)
    const jsonobj = JSON.parse(data);
    io.to(jsonobj.id).emit('recivedata',data)

  })
  socket.on("getFile",(data)=>{
    console.log('file',data)
    const jsondata=JSON.parse(data);
    io.to(jsondata.socket_id).emit('fileList',data);

  })

  // Mouse type event
  socket.on("type", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("type", data);
  });

  // Mouse double click
  socket.on("dobule-click", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("dobule-click", data);
  });

  // Mouse right click event
  socket.on("right-click", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("right-click", data);
  });

  // Mouse aux click
  socket.on("auxclick", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("auxclick", data);
  });

    socket.on('get_clipboard_text', (text) => {
      var room = parseInt(JSON.parse(text).room);
      console.log(`Received text to copy: ${text}`);
      // Emit the copy-text event to the host machine
      // socket.broadcast.emit('copy-text', JSON.stringify({ text }));
      socket.to(room).emit('get_clipboard_text', JSON.stringify({ text }));
  });

  // Handle text paste event
  socket.on('set_clipboard_text', (text) => {
      var room = parseInt(JSON.parse(text).room);
      console.log('Received request to paste text');
      // Emit the paste-text event to the host machine
      // socket.broadcast.emit('paste-text-request');
      socket.to(room).emit('set_clipboard_text',JSON.stringify({ text }));
  });

  // Listen for the paste-text response from the host machine
  socket.on('paste-text-response', (text) => {
      console.log(`Pasted text: ${text}`);
      // Send the pasted text back to the requesting client
      socket.emit('paste-text-success', JSON.stringify({ text }));
  });
  socket.on("send-data",(data)=>{
    console.log('senddata',data)
    looger.info({message:data}); 
    // logger.log({
    //   level: 'info',
    //   message: 'Hello distributed log files!'
    // });
    socket.emit('recivedData',data)

  })
 
  // Copy file from host
  socket.on('copy-file', (data) => {
    var room = parseInt(JSON.parse(data).room);
    var fileData = data.fileData;
    socket.to(room).emit('paste-file', { fileData: fileData });
  });

  // Inside your existing io.on('connection', (socket) => { ... })

// Request to transfer file from sender to receiver
socket.on('request-file-transfer', (data) => {
  const { room, fileName, fileSize } = data;
  // Forward the request to the intended receiver
  socket.to(room).emit('incoming-file-transfer', { 
      senderSocketId: socket.id, 
      fileName, 
      fileSize 
  });
});

// Receiver accepts the file transfer
socket.on('file-transfer-accept', (data) => {
  const { senderSocketId } = data;
  io.to(senderSocketId).emit('file-transfer-accepted');
});

// Receiver rejects the file transfer
socket.on('file-transfer-reject', (data) => {
  const { senderSocketId, reason } = data;
  io.to(senderSocketId).emit('file-transfer-rejected', { reason });
});

// Sender sends file chunks
socket.on('file-chunk', (data) => {
  const { room, chunk, chunkNumber } = data;
  // Forward the chunk to the receiver
  socket.to(room).emit('receive-file-chunk', { chunk, chunkNumber });
});

// Notify receiver that all chunks have been sent
socket.on('file-transfer-complete', (data) => {
  const { room } = data;
  socket.to(room).emit('file-transfer-complete');
});

// Handle any errors during file transfer
socket.on('file-transfer-error', (data) => {
  const { room, error } = data;
  socket.to(room).emit('file-transfer-error', { error });
});

  // socket.on('file-clicked', (data) => {
  //   var room = parseInt(JSON.parse(data).room);
  //   var filePath = data.filePath;
  //   socket.to(room).emit('file-selected', { filePath: filePath });
  // });
});

async function insertAndUpdateHistory(userDetails, id = null) {
  let connectionData = [{
    "CONN_FIRST_NAME": userDetails.conFristName,
    "CONN_LAST_NAME": userDetails.conLastName,
    "REMOTE_FIRST_NAME": userDetails.remoteFristtName,
    "REMOTE_LAST_NAME": userDetails.remoteLastName,
    "CONN_USER_NAME": userDetails.connUserName,
    "REMOTE_USER_NAME": userDetails.RemoteUserName,
    "CONN_IP": userDetails.connIP,
    "REMOTE_IP": userDetails.remoteIP,
    "SESSION_START": userDetails.sessionStart,
    "SESSION_END": userDetails.sessionEnd
  }];

  try {
    const request = db.pool.request();
    request.input('JSON_DATA', db.mssql.NVarChar(MAX), JSON.stringify(connectionData));
    request.input('Id', db.mssql.BigInt, id);
    request.output('response', db.mssql.Int);
    let result = await request.execute('[dbo].[InsertAndUpdateConnHistory]');
    return result.output.response;
  } catch (err) {
    return err.message;
  }
}

server.listen(port, () => {
  console.log(`app running on port ${port}`);
});


