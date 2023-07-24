const {Router} = require('express');
const routeAccess = require('./access.route');
const routeChat = require('./chat.route');
const isLogin = require('../middleware/isLogin.middleware')

const route = Router();

route.use(routeAccess)
route.use(isLogin,routeChat)


module.exports = route