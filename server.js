// const config = require('dotenv');
// config.config({ path: '.env' })
// const port = process.env.PORT || 5000
// const app = require('./app');
// const socketIO = require('socket.io');
// const http = require('http');
// const db = require('./database/database');
// let server = http.createServer(app)
// let io = socketIO(server)
// let join_data
// const JwtService = require('./service/jwtService');
// const { MAX } = require('mssql');
// const { resolve } = require('path');
// const { rejects } = require('assert');
// // process.on('unhandledRejection', err => {
// //   console.log(`Error : ${err.message}`);
// //   console.log(`sutting down the server due to Uncaught Exception`);
// //   process.exit(1);
// // })
// //socket connection circute
// io.on('connection', (socket, cb) => {
//   //console.log("socket connected");
//   //console.log("socket id is ", socket.client.conn.remoteAddress);

//   socket.rem
//   let roomMap = io.sockets.adapter.rooms
//   //send socket isd to user
//   socket.on('get_socket', (args, callback) => {
//    // console.log('ioio okkk khokha..............................', socket.id)
//     callback(socket.id)
//   })
//   //user want to connent another user
//   socket.on('join-message', async (arg, callback) => {
//     let args = JSON.parse(arg);
//     //console.log("want to connect another user", socket.client.conn.remoteAddress,args.user.Name)
//     join_data = arg
//     let historyData = {"conFristName":args.user.Name.split(' ')[0],
//     "conLastName":args.user.Name.split(' ')[1],
//     "remoteFristtName":"",
//     "remoteLastName":"",
//     "connUserName":args.user.UserName,
//     "RemoteUserName":"",
//     "connIP":socket.client.conn.remoteAddress,
//     "remoteIP":"",
//     "sessionStart":new Date(),
//     "sessionEnd":""}
//     //console.log("user detils", historyData);
//     let roomId = args.roomId
//     const conHistoryId = await insertAndUpdateHistory(historyData);
//     //console.log('Connection History ID:', conHistoryId);
//     let user_details = JSON.stringify({ "user_details": args.user, "socket_id": socket.id, 'roomId': args.roomId ,"historyId":conHistoryId});
//     await getSocketId(roomId,(callback) => {
//       // console.log("room id is", roomId,callback)
//       if (callback != 'offline') {
//         // user access message 
//         //console.log('callbackvalue is', callback)
//         let authHeader=args.authorization
//         //console.log('loginuser',authHeader);
//         try{
//           let data = JwtService.verify(authHeader)
//           // console.log(data,callback)
       
//         io.to(callback).emit('access-request', user_details, (callback) => {
//           // console.log("access-request is working");
//          })
      
//         }
//         catch(err){
//           // console.log('hi',JSON.stringify(err))
//           io.to(socket.id).emit('user-offline', 'You are a Unauthorized user.');
//         }
     
//       }
//       else {
//         // user is offline send to request user
//         io.to(socket.id).emit('user-offline', 'user offline');
//       }
//     });
//   })

//   socket.on('reject', async (data) => {
//     // console.log("click on the reject",data);
//     let historyData = {
//       "conFristName":"",
//       "conLastName":"",
//       "remoteFristtName":"",
//       "remoteLastName":"",
//       "connUserName":"",
//       "RemoteUserName":"",
//       "connIP":"",
//       "remoteIP":"",
//       "sessionStart":"",
//       "sessionEnd":new Date(),
//     }
//     let jsondata = JSON.parse(data);
    
//    const insertedId = await insertAndUpdateHistory(historyData,jsondata.historyId);
//    //console.log("rw=ejectid",insertedId);
//     io.to(jsondata.socket_id).emit('you-reject', data)
//   })

//   socket.on('RejectAfter', async (data) => {
//     //console.log("click on the reject After screen share", data);
//     let historyData = {
//       "conFristName":"",
//       "conLastName":"",
//       "remoteFristtName":"",
//       "remoteLastName":"",
//       "connUserName":"",
//       "RemoteUserName":"",
//       "connIP":"",
//       "remoteIP":"",
//       "sessionStart":"",
//       "sessionEnd":new Date(),
//     }
//     let jsondata = JSON.parse(data);
//     // const insertedId = await insertAndUpdateHistory(historyData,jsondata.historyId);
//     // console.log(insertedId)
//     io.to(jsondata.socket_id).emit('you-reject-after', data)
//   })

//   //accept message to request user
//   socket.on('accept', async (data) => {
//     let jsondata = JSON.parse(data);
//     console.log('accept data',jsondata)
//     let historyData = {
//       "conFristName":"",
//       "conLastName":"",
//       "remoteFristtName":jsondata.screendata.fristname,
//       "remoteLastName":jsondata.screendata.lastname,
//       "connUserName":"",
//       "RemoteUserName":jsondata.screendata.username,
//       "connIP":"",
//       "remoteIP":socket.client.conn.remoteAddress,
//       "sessionStart":"",
//       "sessionEnd":"",
//     }
//     roomId = parseInt(jsondata.roomId)
//     const insertedId = await insertAndUpdateHistory(historyData,jsondata.historyId);
//     console.log(insertedId);
//     socket.join(roomId)
//     io.to(jsondata.socket_id).emit('join-you', data)
//   })
//   //request user join in a room
//   socket.on('join', (data) => {
//     let jsondata = JSON.parse(data);
//     roomId = parseInt(jsondata.roomId)
//     socket.join(roomId)
//   })
//   socket.on('shere-user-join', (roomId) => {
//     if (!roomMap.has(socket.id)) {
//       socket.join(roomId);
//     }
//   })
//   //user is present or not in a database and he is online or not 
//   getSocketId = async (uniqueId, callback) => {
//     await db.poolconnect
//     try {
//       const request = db.pool.request();
//       request.input('uniqueId', db.mssql.Int, uniqueId)
//       request.output('response', db.mssql.VarChar(2000))
//         .execute('[dbo].[get_socket_id]').then(function (recordsets, err, returnValue, affected) {
//           // console.log("recordsets for get socket id", recordsets);
//           callback(recordsets.output.response);
//         })
//     }
//     catch {
//       return
//     }
//   }

 

//   //leavea the room and join another room
//   const leaveOtherRooms = (socketID) => {
//     if (roomMap.has(socketID)) {
//       roomMap.forEach((value, key) => {
//         if (value.size > 1) {
//           // console.log("i m val", key, value)
//           let setVal = value
//           setVal.forEach((value, key) => {
//             if (value == socketID) {
//               setVal.delete(value)
//             }
//           })
//         }
//       })
//     }
//   }
//   //leave the room when user disconnect
//   socket.on('room-leave', (roomId) => {
//     socket.leave(roomId);
//   })
//   //user disconnect
//   socket.on("disconnect", async () => {
//     //console.log("i m disconnecting.. after click on share screen reject")
//     leaveOtherRooms(socket.id);
//   })
//   //screen share start
//   socket.on("screen-data", (data) => {
//     data = JSON.parse(data);
//     var room = data.room;
//     var imgStr = data.image;
//     // let id = join_data.UniqueId
//     socket.to(room).emit("scree-image", imgStr);
//   })

//   //mouse movement
//   socket.on('mouse-move', (data) => {
//     // console.log("mouse move data is",data);
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("move-mouse", data);
//   })
//   // mouse click event
//   socket.on('mouse-click', (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("click-mouse", data);

//   })
//   //mouse scroll event
//   socket.on("scroll", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("scroll", data)

//   })
//   //mouse type event
//   socket.on("type", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("type", data);

//   })
//   //mouse double click
//   socket.on("dobule-click", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("dobule-click", data);
//   })

//   //mouse right click event
//   socket.on("right-click", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("right-click", data);
//   })
//   //mouse auxious click
//   socket.on("auxclick", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("auxclick", data);
//   })
//   // socket.on('file-copy', (data) => {
//   //   // Broadcast the file data to other clients
//   //   socket.broadcast.emit('file-paste', data);
//   // })



// });

// async function insertAndUpdateHistory(userDetails, id = null) {
//   // Prepare the connection data
//   let connectionData = [{
//       "CONN_FIRST_NAME": userDetails.conFristName,
//       "CONN_LAST_NAME": userDetails.conLastName,
//       "REMOTE_FIRST_NAME": userDetails.remoteFristtName,
//       "REMOTE_LAST_NAME": userDetails.remoteLastName,
//       "CONN_USER_NAME": userDetails.connUserName,
//       "REMOTE_USER_NAME": userDetails.RemoteUserName,
//       "CONN_IP": userDetails.connIP,
//       "REMOTE_IP": userDetails.remoteIP,
//       "SESSION_START": userDetails.sessionStart,
//       "SESSION_END": userDetails.sessionEnd
//   }];
//   // console.log('hi id',id)

//   // console.log('Connection Data:', connectionData);

//   try {
//       // Create a request object
//       const request = db.pool.request();

//       // Set input parameters
//       request.input('JSON_DATA', db.mssql.NVarChar(MAX), JSON.stringify(connectionData));
//       request.input('Id', db.mssql.BigInt, id);
//       request.output('NewID',db.mssql.BigInt)

//       // Execute the stored procedure and await the result
//       const result = await request.execute('[dbo].[Connection_histroy_collect]');

//       // Access output parameters if needed
//       const newId = result.output.NewID;

//       // Return the result
//       return newId;
//   } catch (e) {
//       // Handle errors
//       console.error('Error executing stored procedure:', e);
//       throw e; // Re-throw the error to be handled by the caller
//   }
// }

// // Example usage of the async function
// // async function main() {
// //   try {
// //       const historyData = {
// //           conFristName: 'John',
// //           conLastName: 'Doe',
// //           remoteFristtName: 'Jane',
// //           remoteLastName: 'Smith',
// //           connUserName: 'john_doe',
// //           RemoteUserName: 'jane_smith',
// //           connIP: '192.168.1.1',
// //           remoteIP: '192.168.1.2',
// //           sessionStart: new Date(),
// //           sessionEnd: new Date()
// //       };

// //       // Call the async function and wait for the result
// //       const conHistoryId = await insertAndUpdateHistory(historyData);
// //       console.log('Connection History ID:', conHistoryId);
// //   } catch (e) {
// //       // Handle any errors from insertAndUpdateHistory
// //       console.error('Error in main function:', e);
// //   }
// // }



// //server
// const server1 = server.listen(port, () => {
//   console.log(`server is runing http://localhost:${port}`);
// });
// //unhandle promise Rejection
// process.on('unhandledRejection', (err) => {
//   server1.close(() => {
//     process.exit(1);
//   })
// })


// ------------------------------------------- Dipali 9:50 PM (Modifying) ---------------------------------

// const config = require('dotenv');
// config.config({ path: '.env' });
// const port = process.env.PORT || 5000;
// const app = require('./app');
// const socketIO = require('socket.io');
// const http = require('http');
// const db = require('./database/database');
// let server = http.createServer(app);
// let io = socketIO(server);
// let join_data;
// const JwtService = require('./service/jwtService');
// const { MAX } = require('mssql');
// const { resolve } = require('path');
// const { rejects } = require('assert');

// // socket connection circuit
// io.on('connection', (socket, cb) => {
//   let roomMap = io.sockets.adapter.rooms;

//   // Send socket ID to user
//   socket.on('get_socket', (args, callback) => {
//     callback(socket.id);
//   });

//   // User wants to connect to another user
//   socket.on('join-message', async (arg, callback) => {
//     let args = JSON.parse(arg);
//     join_data = arg;
//     let historyData = {
//       "conFristName": args.user.Name.split(' ')[0],
//       "conLastName": args.user.Name.split(' ')[1],
//       "remoteFristtName": "",
//       "remoteLastName": "",
//       "connUserName": args.user.UserName,
//       "RemoteUserName": "",
//       "connIP": socket.client.conn.remoteAddress,
//       "remoteIP": "",
//       "sessionStart": new Date(),
//       "sessionEnd": ""
//     };
//     let roomId = args.roomId;
//     const conHistoryId = await insertAndUpdateHistory(historyData);
//     let user_details = JSON.stringify({
//       "user_details": args.user,
//       "socket_id": socket.id,
//       'roomId': args.roomId,
//       "historyId": conHistoryId
//     });
//     await getSocketId(roomId, (callback) => {
//       if (callback != 'offline') {
//         let authHeader = args.authorization;
//         try {
//           let data = JwtService.verify(authHeader);
//           io.to(callback).emit('access-request', user_details);
//         } catch (err) {
//           io.to(socket.id).emit('user-offline', 'You are an Unauthorized user.');
//         }
//       } else {
//         io.to(socket.id).emit('user-offline', 'user offline');
//       }
//     });
//   });

//   socket.on('reject', async (data) => {
//     let historyData = {
//       "conFristName": "",
//       "conLastName": "",
//       "remoteFristtName": "",
//       "remoteLastName": "",
//       "connUserName": "",
//       "RemoteUserName": "",
//       "connIP": "",
//       "remoteIP": "",
//       "sessionStart": "",
//       "sessionEnd": new Date(),
//     };
//     let jsondata = JSON.parse(data);
//     const insertedId = await insertAndUpdateHistory(historyData, jsondata.historyId);
//     io.to(jsondata.socket_id).emit('you-reject', data);
//   });

//   socket.on('RejectAfter', async (data) => {
//     let historyData = {
//       "conFristName": "",
//       "conLastName": "",
//       "remoteFristtName": "",
//       "remoteLastName": "",
//       "connUserName": "",
//       "RemoteUserName": "",
//       "connIP": "",
//       "remoteIP": "",
//       "sessionStart": "",
//       "sessionEnd": new Date(),
//     };
//     let jsondata = JSON.parse(data);
//     io.to(jsondata.socket_id).emit('you-reject-after', data);
//   });

//   // Accept message to request user
//   socket.on('accept', async (data) => {
//     let jsondata = JSON.parse(data);
//     let historyData = {
//       "conFristName": "",
//       "conLastName": "",
//       "remoteFristtName": jsondata.screendata.fristname,
//       "remoteLastName": jsondata.screendata.lastname,
//       "connUserName": "",
//       "RemoteUserName": jsondata.screendata.username,
//       "connIP": "",
//       "remoteIP": socket.client.conn.remoteAddress,
//       "sessionStart": "",
//       "sessionEnd": "",
//     };
//     roomId = parseInt(jsondata.roomId);
//     const insertedId = await insertAndUpdateHistory(historyData, jsondata.historyId);
//     socket.join(roomId);
//     io.to(jsondata.socket_id).emit('join-you', data);
//   });

//   // Request user join in a room
//   socket.on('join', (data) => {
//     let jsondata = JSON.parse(data);
//     roomId = parseInt(jsondata.roomId);
//     socket.join(roomId);
//   });

//   socket.on('shere-user-join', (roomId) => {
//     if (!roomMap.has(socket.id)) {
//       socket.join(roomId);
//     }
//   });

//   getSocketId = async (uniqueId, callback) => {
//     await db.poolconnect;
//     try {
//       const request = db.pool.request();
//       request.input('uniqueId', db.mssql.Int, uniqueId);
//       request.output('response', db.mssql.VarChar(2000))
//         .execute('[dbo].[get_socket_id]').then(function (recordsets, err, returnValue, affected) {
//           callback(recordsets.output.response);
//         });
//     } catch {
//       return;
//     }
//   };

//   const leaveOtherRooms = (socketID) => {
//     if (roomMap.has(socketID)) {
//       roomMap.forEach((value, key) => {
//         if (value.size > 1) {
//           let setVal = value;
//           setVal.forEach((value, key) => {
//             if (value == socketID) {
//               setVal.delete(value);
//             }
//           });
//         }
//       });
//     }
//   };

//   socket.on('room-leave', (roomId) => {
//     socket.leave(roomId);
//   });

//   socket.on("disconnect", async () => {
//     leaveOtherRooms(socket.id);
//   });

//   // Screen share start
//   socket.on("screen-data", (data) => {
//     data = JSON.parse(data);
//     var room = data.room;
//     var imgStr = data.image;
//     socket.to(room).emit("scree-image", imgStr);
//   });

//   // Mouse movement
//   socket.on('mouse-move', (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("move-mouse", data);
//   });

//   // Mouse click event
//   socket.on('mouse-click', (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("click-mouse", data);
//   });

//   // Mouse scroll event
//   socket.on("scroll", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("scroll", data);
//   });

//   // Mouse type event
//   socket.on("type", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("type", data);
//   });

//   // Mouse double click
//   socket.on("dobule-click", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("dobule-click", data);
//   });

//   // Mouse right click event
//   socket.on("right-click", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("right-click", data);
//   });

//   // Mouse aux click
//   socket.on("auxclick", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("auxclick", data);
//   });

//   // Copy text from host
//   socket.on('copy-text', (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     var text = data.text;
//     socket.to(room).emit('paste-text', { text: text });
//   });

//   // Copy file from host
//   socket.on('copy-file', (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     var fileData = data.fileData;
//     socket.to(room).emit('paste-file', { fileData: fileData });
//   });
// });

// async function insertAndUpdateHistory(userDetails, id = null) {
//   let connectionData = [{
//     "CONN_FIRST_NAME": userDetails.conFristName,
//     "CONN_LAST_NAME": userDetails.conLastName,
//     "REMOTE_FIRST_NAME": userDetails.remoteFristtName,
//     "REMOTE_LAST_NAME": userDetails.remoteLastName,
//     "CONN_USER_NAME": userDetails.connUserName,
//     "REMOTE_USER_NAME": userDetails.RemoteUserName,
//     "CONN_IP": userDetails.connIP,
//     "REMOTE_IP": userDetails.remoteIP,
//     "SESSION_START": userDetails.sessionStart,
//     "SESSION_END": userDetails.sessionEnd
//   }];

//   try {
//     const request = db.pool.request();
//     request.input('JSON_DATA', db.mssql.NVarChar(MAX), JSON.stringify(connectionData));
//     request.input('Id', db.mssql.BigInt, id);
//     request.output('response', db.mssql.Int);
//     let result = await request.execute('[dbo].[InsertAndUpdateConnHistory]');
//     return result.output.response;
//   } catch (err) {
//     return err.message;
//   }
// }

// server.listen(port, () => {
//   console.log(`app running on port ${port}`);
// });





// -------------------------------------- DIPALI (08/08/2024 11:35 AM) Modifying --------------------------------------------------

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

  // Copy text from host
//  socket.on('copy-text', (text) => {
    // let parsedData = JSON.parse(data);
    // var room = parseInt(parsedData.room);
    // var text = parsedData.text;
    // socket.to(room).emit('paste-text', { text: text });
    socket.on('copy-text', (text) => {
      console.log(`Received text to copy: ${text}`);
      // Emit the copy-text event to the host machine
      socket.broadcast.emit('copy-text', JSON.stringify({ text }));
  });

  // Handle text paste event
  socket.on('paste-text', () => {
      console.log('Received request to paste text');
      // Emit the paste-text event to the host machine
      socket.broadcast.emit('paste-text-request');
  });

  // Listen for the paste-text response from the host machine
  socket.on('paste-text-response', (text) => {
      console.log(`Pasted text: ${text}`);
      // Send the pasted text back to the requesting client
      socket.emit('paste-text-success', JSON.stringify({ text }));
  });
// Paste text from Host
// socket.on('paste-text', ()=>{
//   try
//   {
//     const text = clipboardy.readsync();
//     io.to(socket.id).emit("Paste Text Success", text);

//   }
//   catch(error)
//   {
//     io.to(socket.id).emit("Paste Text Error", `Failed,${error.message}`);
//   }
// })

  // Copy file from host
  socket.on('copy-file', (data) => {
    var room = parseInt(JSON.parse(data).room);
    var fileData = data.fileData;
    socket.to(room).emit('paste-file', { fileData: fileData });
  });
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



//------------------------------------------------------- DIPALI 08/08/24 17:36 PM , Modifying ------------------------------

// const config = require('dotenv');
// config.config({ path: '.env' });
// const port = process.env.PORT || 5000;
// const app = require('./app');
// const socketIO = require('socket.io');
// const http = require('http');
// const db = require('./database/database');
// let server = http.createServer(app);
// let io = socketIO(server);
// let clipboardy;

// (async () => {
//   clipboardy = await import('clipboardy');
// })();

// // socket connection circuit
// io.on('connection', (socket, cb) => {
//   let roomMap = io.sockets.adapter.rooms;

//   // Send socket ID to user
//   socket.on('get_socket', (args, callback) => {
//     callback(socket.id);
//   });

//   // User wants to connect to another user
//   socket.on('join-message', async (arg, callback) => {
//     let args = JSON.parse(arg);
//     let historyData = {
//       "conFristName": args.user.Name.split(' ')[0],
//       "conLastName": args.user.Name.split(' ')[1],
//       "remoteFristtName": "",
//       "remoteLastName": "",
//       "connUserName": args.user.UserName,
//       "RemoteUserName": "",
//       "connIP": socket.client.conn.remoteAddress,
//       "remoteIP": "",
//       "sessionStart": new Date(),
//       "sessionEnd": null
//     };
//     const conHistoryId = await insertAndUpdateHistory(historyData);
//     let user_details = JSON.stringify({
//       "user_details": args.user,
//       "socket_id": socket.id,
//       'roomId': args.roomId,
//       "historyId": conHistoryId
//     });
//     await getSocketId(args.roomId, (callback) => {
//       if (callback != 'offline') {
//         let authHeader = args.authorization;
//         try {
//           let data = JwtService.verify(authHeader);
//           io.to(callback).emit('access-request', user_details);
//         } catch (err) {
//           io.to(socket.id).emit('user-offline', 'You are an Unauthorized user.');
//         }
//       } else {
//         io.to(socket.id).emit('user-offline', 'user offline');
//       }
//     });
//   });

//   socket.on('reject', async (data) => {
//     let historyData = {
//       "conFristName": "",
//       "conLastName": "",
//       "remoteFristtName": "",
//       "remoteLastName": "",
//       "connUserName": "",
//       "RemoteUserName": "",
//       "connIP": "",
//       "remoteIP": "",
//       "sessionStart": "",
//       "sessionEnd": new Date(),
//     };
//     let jsondata = JSON.parse(data);
//     await insertAndUpdateHistory(historyData, jsondata.historyId);
//     io.to(jsondata.socket_id).emit('you-reject', data);
//   });

//   socket.on('RejectAfter', async (data) => {
//     let historyData = {
//       "conFristName": "",
//       "conLastName": "",
//       "remoteFristtName": "",
//       "remoteLastName": "",
//       "connUserName": "",
//       "RemoteUserName": "",
//       "connIP": "",
//       "remoteIP": "",
//       "sessionStart": "",
//       "sessionEnd": new Date(),
//     };
//     let jsondata = JSON.parse(data);
//     io.to(jsondata.socket_id).emit('you-reject-after', data);
//   });

//   // Accept message to request user
//   socket.on('accept', async (data) => {
//     let jsondata = JSON.parse(data);
//     let historyData = {
//       "conFristName": "",
//       "conLastName": "",
//       "remoteFristtName": jsondata.screendata.fristname,
//       "remoteLastName": jsondata.screendata.lastname,
//       "connUserName": "",
//       "RemoteUserName": jsondata.screendata.username,
//       "connIP": "",
//       "remoteIP": socket.client.conn.remoteAddress,
//       "sessionStart": "",
//       "sessionEnd": "",
//     };
//     roomId = parseInt(jsondata.roomId);
//     await insertAndUpdateHistory(historyData, jsondata.historyId);
//     socket.join(roomId);
//     io.to(jsondata.socket_id).emit('join-you', data);
//   });

//   // Request user join in a room
//   socket.on('join', (data) => {
//     let jsondata = JSON.parse(data);
//     roomId = parseInt(jsondata.roomId);
//     socket.join(roomId);
//   });

//   socket.on('shere-user-join', (roomId) => {
//     if (!roomMap.has(socket.id)) {
//       socket.join(roomId);
//     }
//   });

//   const getSocketId = async (uniqueId, callback) => {
//     await db.poolconnect;
//     try {
//       const request = db.pool.request();
//       request.input('uniqueId', db.mssql.Int, uniqueId);
//       request.output('response', db.mssql.VarChar(2000))
//         .execute('[dbo].[get_socket_id]').then(function (recordsets) {
//           callback(recordsets.output.response);
//         });
//     } catch {
//       return;
//     }
//   };

//   const leaveOtherRooms = (socketID) => {
//     if (roomMap.has(socketID)) {
//       roomMap.forEach((value) => {
//         if (value.size > 1) {
//           value.forEach((val, key) => {
//             if (val === socketID) {
//               value.delete(key);
//             }
//           });
//         }
//       });
//     }
//   };

//   socket.on('room-leave', (roomId) => {
//     socket.leave(roomId);
//   });

//   socket.on("disconnect", async () => {
//     leaveOtherRooms(socket.id);
//   });

//   // Screen share start
//   socket.on("screen-data", (data) => {
//     data = JSON.parse(data);
//     var room = data.room;
//     var imgStr = data.image;
//     socket.to(room).emit("scree-image", imgStr);
//   });

//   // Mouse movement
//   socket.on('mouse-move', (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("move-mouse", data);
//   });

//   // Mouse click event
//   socket.on('mouse-click', (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("click-mouse", data);
//   });

//   // Mouse scroll event
//   socket.on("scroll", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("scroll", data);
//   });

//   // Mouse type event
//   socket.on("type", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("type", data);
//   });

//   // Mouse double click
//   socket.on("dobule-click", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("dobule-click", data);
//   });

//   // Mouse right click event
//   socket.on("right-click", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("right-click", data);
//   });

//   // Mouse aux click
//   socket.on("auxclick", (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     socket.to(room).emit("auxclick", data);
//   });

//   // Copy text from host
//   socket.on('copy-text', async (text) => {
//     try {
//       await clipboardy.write(text); // Note that clipboardy methods are async in ESM
//       io.to(socket.id).emit("Copy Text Success");
//     } catch (error) {
//       io.to(socket.id).emit("Copy Text Failed", `Failed, ${error.message}`);
//     }
//   });

//   // Paste text from host
//   socket.on('paste-text', async () => {
//     try {
//       const text = await clipboardy.read(); // Clipboard methods are async
//       io.to(socket.id).emit("Paste Text Success", text);
//     } catch (error) {
//       io.to(socket.id).emit("Paste Text Error", `Failed, ${error.message}`);
//     }
//   });

//   // Copy file from host
//   socket.on('copy-file', (data) => {
//     var room = parseInt(JSON.parse(data).room);
//     var fileData = data.fileData;
//     socket.to(room).emit('paste-file', { fileData: fileData });
//   });
// });

// // HTTP API handling for copy-paste functionality
// // HTTP API handling for copy-paste functionality
// server.on('request', async (req, res) => {
//   if (req.method === 'POST' && req.url === '/copy-text') {
//     let body = '';
//     req.on('data', chunk => {
//       body += chunk.toString();
//     });
//     req.on('end', async () => {
//       try {
//         const { text } = JSON.parse(body);
//         await clipboardy.write(text);
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ status: 'Copy Text Success' }));
//       } catch (error) {
//         if (!res.headersSent) {
//           res.writeHead(500, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify({ status: 'Copy Text Failed', message: error.message }));
//         }
//       }
//     });
//   }
// });

// // Database handling
// async function insertAndUpdateHistory(userDetails, id = null) {
//     let connectionData = [{
//       "CONN_FIRST_NAME": userDetails.conFristName,
//       "CONN_LAST_NAME": userDetails.conLastName,
//       "REMOTE_FIRST_NAME": userDetails.remoteFristtName,
//       "REMOTE_LAST_NAME": userDetails.remoteLastName,
//       "CONN_USER_NAME": userDetails.connUserName,
//       "REMOTE_USER_NAME": userDetails.RemoteUserName,
//       "CONN_IP": userDetails.connIP,
//       "REMOTE_IP": userDetails.remoteIP,
//       "SESSION_START": userDetails.sessionStart,
//       "SESSION_END": userDetails.sessionEnd
//     }];
  
//     try {
//       const request = db.pool.request();
//       request.input('JSON_DATA', db.mssql.NVarChar(MAX), JSON.stringify(connectionData));
//       request.input('Id', db.mssql.BigInt, id);
//       request.output('response', db.mssql.Int);
//       let result = await request.execute('[dbo].[InsertAndUpdateConnHistory]');
//       return result.output.response;
//     } catch (err) {
//       return err.message;
//     }
//   }
  

// // Start the server
// server.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
