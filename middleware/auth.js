const jwt = require('jsonwebtoken');
const secretKey = "qwerty@123";
const Constant = require('./../config/constant');

module.exports = {
    verify: (req, res, next) => {
        try{
            if(req.headers && req.headers.authorization){
                req.user = jwt.verify(req.headers.authorization, secretKey);
                next();
            }else{
                res.status(Constant.Code.UNAUTHORISED).json({ messade: "Unauthorised user" });
            }
        }catch(error){
            res.status(Constant.Code.UNAUTHORISED).json({ messade: "Unauthorised user" });
        }
    },
    encrypt: (data) => {
        return jwt.sign(data, secretKey, {expiresIn: '1h'}); // validity of token is 1 hour
    }
}