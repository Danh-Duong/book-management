const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;

    if (!token)
        return res.status(401).json({ message: 'Unauthorized: No token provided' });

    jwt.verify(token, 'abc123!@#', (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        req.user = decoded;
        next();
    });
}

module.exports = authenticateToken;
