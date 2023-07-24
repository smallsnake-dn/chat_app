const { Server } = require('socket.io')
const cookie = require('cookie')
const prisma = require('../helpers/prisma_client')
const chatService = require('./chat.service')


const _io_server = global._io;


class SocketIO {

    static async auth(socket, next) {
        const connect_sid = socket.handshake.headers.cookie;
        if (connect_sid) {
            console.log(cookie.parse(connect_sid.toString())['connect.sid'])
            const sid = cookie.parse(connect_sid.toString())['connect.sid'].slice(2, 34);
            console.log({ sid })
            const data = await prisma.user_sessions.findFirst({
                where: {
                    sid
                }
            })

            if (!data) next(new Error('something wrong with session'))
            console.log({ session_data: data.sess.user.username })
            socket.user = data.sess.user;
            next()
        }
        else {
            console.log("cookie is missing")
            next(new Error("cookie is missing"))
        }
    }

    static connection(socket) {
        console.log(`User join with ID::${socket.id}`)
        socket.on('test', (data) => {
            console.log(global._io.sockets.adapter)
            // global._io.in('d19at3').emit('test', 'hello test emit to room')
        })

        socket.on('join_current_room', async (data) => {
            const listRoom = await chatService.getRoomForUser(socket.user.username)
            listRoom.forEach(value => {
                socket.join(value.rooms.name)
            })
        })
        // socket.on("send_msg", (data) => {
        //     const { content, to } = data;
        //     io.sockets.in(to).emit("replay_msg", {
        //         username: socket.username,
        //         content
        //     })
        // })

        socket.on('join_room', async (data) => {
            const room = data;
            const user = socket.user;

            const _room = await prisma.rooms.findFirst({
                where: {
                    name: room
                }
            })
            var current_room = _room;
            console.log({ room_data: room })


            if (!_room) {
                current_room = await prisma.rooms.create({
                    data: {
                        name: room
                    }
                })

            }

            const rs = await prisma.room_members.findFirst({
                where: {
                    id_room: current_room.id,
                    id_user: user.id
                }
            })

            if (rs) {
                socket.emit('room_exist',
                    `User ${user.name} was in`)
            } else {
                await prisma.room_members.create({
                    data: {
                        id_room: current_room.id,
                        id_user: user.id
                    }
                    
                })
                socket.join(current_room.name)
                global._io.in(current_room.name).emit('join_success', {
                    msg: `${socket.user.username} have join room ${current_room.name}`,
                    id: socket.id
                })
            }
        })

        socket.on('send_msg', async data => {
            const parse_room = parseInt(data.room)
            await prisma.msg.create({
                data: {
                    msgfrom: socket.user.id,
                    msgto: parse_room,
                    msg: data.msg
                }
            })
        })

        socket.on('get_msg', async data => {
            const _room = parseInt(data.room)
            const rs = await prisma.msg.findMany({
                where: {
                    msgto: _room
                },
                include: {
                    users: {
                        select: {
                            name: true
                        }
                    },
                    rooms: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                },
                take: data.limit,
                skip: data.offset
                
            })
            if(data) {
                socket.emit('data_get_msg', rs)
            }
        })



    }



}


module.exports = SocketIO