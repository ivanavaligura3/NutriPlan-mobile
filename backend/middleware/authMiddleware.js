const jwt = require('jsonwebtoken');

// Middleware za proveru JWT tokena
const authenticateToken = (req, res, next) => {
    try {
        // Preuzimanje Authorization header-a
        const authHeader = req.headers.authorization;

        // Izdvajanje tokena iz formata: Bearer TOKEN
        const token = authHeader && authHeader.split(' ')[1];

        // Ako token nije prosleđen
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token nije prosleđen.'
            });
        }

        // Provera da li je token validan
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Čuvanje podataka iz tokena u request
        req.user = decoded;

        // Nastavak ka sledećoj funkciji
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Nevažeći ili istekao token.'
        });
    }
};

module.exports = authenticateToken;