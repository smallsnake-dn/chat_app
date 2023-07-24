const {Router} = require("express");
const ChatController = require("../controllers/chat.controller");


const routeAccess = Router();



routeAccess.get('/chat', ChatController.chat)
routeAccess.get('/rooms', ChatController.getRoomForUser)
routeAccess.get('/', ChatController.home)


module.exports = routeAccess;