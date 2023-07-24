const prisma = require('../helpers/prisma_client')

module.exports = class ChatService {
    static async getRoomForUser(username) {
        const listRoom  = await prisma.room_members.findMany({
            where : {
                users : {
                    name: username
                }
            },
            include: {
                rooms: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return listRoom;
    }
}