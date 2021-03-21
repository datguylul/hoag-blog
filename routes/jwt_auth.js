const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).render('../views/pages/client/login', {
        username: "",
        password: "",
        error: "Access Denied"
    });

    try {
        const verified = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).render('../views/pages/client/login', {
            username: "",
            password: "",
            error: "Invalid Token"
        });
    }
}