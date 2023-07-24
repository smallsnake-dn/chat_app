const {Router} = require("express");
const AccessController = require("../controllers/access.controller");

const routeAccess = Router();

routeAccess.get('/login', AccessController.loginPage)
routeAccess.post('/login', AccessController.login)


module.exports = routeAccess;