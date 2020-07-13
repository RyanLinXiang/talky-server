# talky-server

## Description

"Talky" is a very [simple chat app](https://github.com/RyanLinXiang/talky) written in React Native. This repo represents its websocket back-end and has the following features:
* managing different users
* managing different rooms (rooms can be added via `rooms.js` file)
* different message types (system messages, user's messages, other's messages, private messages)
* allows private conversations via user selection

"Talky" is an ideal base to build a more comprehensive chat app.

## Getting Started

The server back-end has three rooms pre-set in the `rooms.js` file which can be modified/extended. To add a room, just add a new object with a `room` name of your choice and an empty `users` array:
```javascript
// rooms.js

module.exports = [
  { room: "Standard", users: [] },
  { room: "Travel", users: [] },
  { room: "Dating", users: [] },
  // { room: "your room", users: []}
];
```

### Dependencies

```
package.json
```

### Installing

```
npm install
```

### Executing program

```
node server.js
```
