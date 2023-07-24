const accessService = require('../services/access.service')


module.exports = class AccessController {
    static loginPage(req, res, next) {
        res.render('login')
    }

    static async login(req, res, next) {
        const { username, password } = req.body
        if (!username || !password) {
            res.json({
                code: 403,
                msg: "missing username or password"
            })
        }

        const data = await accessService.login(req.body);
        if (!data) {
            res.json({
                code: 403,
                msg: "Login fail"
            })
        }
        else {

            req.session.user = {
                id: data.id,
                name: data.name,
                username: data.username
            }

            // req.session.user = {
            //     name: data.name,
            //     username: data.username
            // }
            // res.json({
            //     code: 200,
            //     msg: "Login success"
            // })
            res.redirect('/chat')
        }
    }

}