require("dotenv").config();
const jwt = require("jsonwebtoken");

const validarJWT = async (req, res, next) => {
    try {
        const jwtValidado = jwt.verify(req.headers.jwt, process.env.KEY);
        if (jwtValidado) {
            next();
        }else {
            return res.status(401).json({
                mensaje: "No Valido",
            });
        }

    } catch(error){
        return res.status(401).json({
            mensaje: "No Valido",
        });
    }
}

module.exports = {
    validarJWT  
};