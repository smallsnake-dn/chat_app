const chatService = require('../services/chat.service')

module.exports = class ChatController {
    static home(req, res, next) {
        if(req.session.user) {
            res.redirect('/chat')
        } else {
            res.redirect('/login')
        }
    }

    static async chat(req, res, next) {
        const username = req.session.user.username
        const list = await chatService.getRoomForUser(username);
        res.render("chat", { list })
    }

    static async getRoomForUser(req, res, next) {
        const { user } = req.session;
        if (!user) {
            res.json({
                code: 403,
                msg: "FORBIDDEN"
            })
        } else {
            const list = await chatService.getRoomForUser(user.username);
            res.send(list)
        }
    }
}