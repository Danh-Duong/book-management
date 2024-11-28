const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;

    if (!token)
        return res.redirect('/');

    jwt.verify(token, 'abc123!@#', (err, decoded) => {
        if (err)
            return res.redirect('/');
        req.user = decoded;
        next();
    });
}

module.exports = authenticateToken;
