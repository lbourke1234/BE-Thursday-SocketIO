import { saveMessage } from '../utils/messages.js'
import RoomsModel from '../models/rooms.js'

let onlineUsers = []

const connectionHandler = (socket) => {
  socket.emit('welcome', { message: `Hello ${socket.id}!` })

  socket.on('setUsername', (payload) => {
    onlineUsers.push({
      username: payload.username,
      socketId: socket.id,
      room: payload.room
    })
    console.log('ONLINE USERS: ', onlineUsers)

    socket.join(payload.room)

    console.log('ROOMS ', socket.rooms)

    socket.emit('loggedin', onlineUsers)
    socket.broadcast.emit('newConnection', onlineUsers)
  })

  socket.on('sendMessage', async ({ message, room }) => {
    console.log('MESSAGE: ', message)
    await saveMessage(message, room)

    socket.to(room).emit('message', message)
  })

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    socket.broadcast.emit('newConnection', onlineUsers)
  })

  socket.on('privateChat', ({ mainUser, clickedUser }) => {
    console.log('hello')
    console.log('MAIN USER: ', mainUser)
    console.log('CLICKED USER: ', clickedUser)

    const privateRoom = new RoomsModel({
      name: mainUser.username + clickedUser.username,
      members: [mainUser.username, clickedUser.username]
    })
    privateRoom.save()

    socket.join(privateRoom.name)
  })
}

export default connectionHandler
