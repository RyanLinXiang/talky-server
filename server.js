const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const port = process.env.PORT || 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });
const rooms = [
  { room: "Standard", users: [] },
  { room: "Travel", users: [] },
  { room: "Dating", users: [] },
];

wss.on("connection", function connection(ws) {
  let username;
  let userid;

  //When "Connect" Button hit:
  if (ws.protocol) {
    console.log("connect");
    const infos = decodeURIComponent(ws.protocol).split(",");
    const roomid = +infos[0] - 1;
    username = infos[1];
    userid = ws._socket._handle.fd;
    console.log(username, roomid);
    if (rooms[roomid].users.findIndex((e) => e.userid === userid) === -1) {
      rooms[roomid].users.push({
        userid: userid,
        username: username,
      });
    }

    //Sent data that new user joined to all users:
    const data = {
      initialConnect: true,
      username,
      userid,
      usersInRoom: rooms[roomid].users,
    };

    // Make sure to send the initial data (esp. userid) to the client first who initiated the connection ...
    ws.send(JSON.stringify(data));
    // ... and then to all the other clients
    sendToClients(data, roomid, userid);

    // Make sure to log out if users closes web connection without officially disconnect
    ws.on("close", function () {
      const currentUserIndex = rooms[roomid].users.findIndex(
        (e) => e.userid === userid
      );
      if (currentUserIndex > -1)
        rooms[roomid].users.splice(currentUserIndex, 1);

      const data = {
        disconnect: true,
        username,
        userid,
        usersInRoom: rooms[roomid].users,
      };
      console.log(data);
      sendToClients(data, roomid, userid);
    });
  } else ws.send(JSON.stringify({ roomsOverview: true, rooms: [...rooms] })); // Initial load of the website without any user data infos

  ws.on("message", function incoming(data) {
    data = JSON.parse(data);
    const roomid = +data.room - 1;
    data.username = username;
    data.usersInRoom = rooms[roomid].users;
    console.log(data);
    //if (rooms.findIndex((e) => e === contents.room) === -1)
    // rooms.push(contents.room);
    sendToClients(data, roomid, userid);
  });
});

function sendToClients(data, roomid, userid) {
  wss.clients.forEach((client) => {
    const clientid = client._socket._handle.fd;

    if (
      //client !== ws &&
      client.readyState === WebSocket.OPEN &&
      rooms[roomid].users.findIndex((e) => e.userid === clientid) > -1 &&
      (!data.privateToUserId ||
        (data.privateToUserId && data.privateToUserId === clientid) ||
        (data.privateToUserId && data.userid === userid && userid === clientid))
    ) {
      client.send(JSON.stringify(data));
    }
  });
}

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
