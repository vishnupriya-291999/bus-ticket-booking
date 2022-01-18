const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=> {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'this-is-my-secret-passcode');
        req.userData = {email: decodedToken.email, id: decodedToken.id}
        next();
    }
    catch(err) {
        res.status(401).json({
            message: 'Error in Authorization'
        })
    }
}