const isLogin = (req, res, next) => {
    const { user } = req.session;
    if (!user) {
        next(new Error("User are not login"))
    }

    next();
}

module.exports = isLogin