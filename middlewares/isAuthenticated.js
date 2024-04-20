const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    
    const authHeader = req.header('Authorization');

    const token = req.cookies.token||req.body.token||authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });

};

module.exports = isAuthenticated;
