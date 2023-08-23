const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) 
        return res.json({error: "Must login to comment."});

    try {

        // Verifying if acccess token is valid using secret token
        const validToken = verify(accessToken, "gmsjgiobkqxqmhk");

        if (validToken)
            return next();
        
    } catch(err) {
        return res.json({error: err});
    }
};

module.exports = { validateToken };