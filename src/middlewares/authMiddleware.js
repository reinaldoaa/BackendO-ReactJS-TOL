const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req,res,next) => {
    try{
        const token = req.headers["authorization"];
        if(token){
            const verify = jwt.verify(token, process.env.PRIVATE_KEY);
            //console.log('verify: ',token);
            if (verify){
                req.userID = verify; //token
                req.user = await User.findById(verify);
                //console.log(req.user );
                next();    
            } else {
                return res.status(400).json({ 
                    status: false,
                    message: 'The token is incorrect.',
                });
            }
        }else {
            return res.status(400).json({ 
                status: false,
                message: 'The token is required',
            });
        }
        } catch (error){
            return res.status(400).json({ 
                status: false,
                message: error,
                // 'The token is Invalid..',
            });
        }    
};

module.exports = authMiddleware;