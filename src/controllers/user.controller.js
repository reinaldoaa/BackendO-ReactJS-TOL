const userMethods = {};
require('dotenv').config();
const User = require('../models/user.model');
const Rol = require('../models/rol.model');
const jwt = require('jsonwebtoken');

async function getUser(param){
    try{
        return User.findOne(param);
    } catch(error) {
        return false;
    }
};

async function getRol(_id){
    try{
        return Rol.findById(_id);
    } catch(error) {
        return false;
    }
};

userMethods.readUsers = async (req,res) => {
    console.log(req.user);
    const permission = acc.can(req.user.rol.name).createAny('rol').granted;
    if (permission) {
        try {
            const foundUser = await User.find();
            if (foundUser) {
                return res.status(200).json({status: true,foundUser,message: 'Users OK.',});
            } else {
                return res.status(400).json({status: false,foundUser,message: 'Database users empty.',});            
            }
        } catch (error) {
        }    
    }
}

userMethods.login = async (req,res) => {
    const {email,password} = req.body;
    const user = await getUser({email});
    if (user) {
        const verifyPassword = await user.verifyPassword(password);
        if (!verifyPassword) {
            return res.status(400).json({
            status: false,
            message: 'Email or Password incorect.',});
        }
        try {
            const token = jwt.sign({_id: user._id.toString()},process.env.PRIVATE_KEY,{expiresIn:84600});
            return res.status(200).json({
                status: true,
                token,
                message:'Login correct.',});
        } catch (error){
            return res.status(400).json({
                status: false,
                message: 'There was  oProblem, please try again.',}); 
        }
    } else {
        return res.status(400).json({
            status: false,
            message: 'Email or Password incorrect.',});
    }
};

userMethods.register = async (req,res) => {
    const {rolID, username,email,password,name} =req.body;
    if(rolID && username && email && password){
        const rol = await getRol(rolID);
        try {
            if (rol){
                const verifyusername = await  getUser({username});
                if(verifyusername){
                    return res.status(400).json({ 
                    status: false,
                    message: 'The username has already token',});
                }
                const verifyemail =  await getUser({email});
                if(verifyemail){
                    return res.status(400).json({ 
                    status: false,
                    message: 'The email has already token',});
                }
                const user = new User({
                    rol:{rolID:rol._id,name:rol.name,},
                    username,email,password,name, }); 
                user.password = await user.encryptPassword(user.password);
                if(await user.save()){
                    return res.status(200).json({
                    status: true,
                    message: "User create successfull",});               
                    }else {
                        return res.status(400).json({
                        status: false,
                        message: "There was a problem, please try again",});                   
                    }
            } else {
                return res.status(400).json({
                status: false,
                message: "Rol notnexits",});                   
            }//Fin Validar rol  
        } catch (error) {
            return res.status(400).json({
            status: false,
            message: 'There was on error,please try aganin',});                
        }
    } else{
        return res.status(400).json({
        status: false,
        message: 'fill all requered fields',});
    }
};
    
userMethods.authenticate = (req,res) => {
    try{
    const token = req.headers["authorization"];
    //console.log(token);
    if(token){
        const verify = jwt.verify(token, process.env.PRIVATE_KEY);
        if (verify){
            return res.status(200).json({ 
                status: true,
                message: 'The token is correct.',
            });
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
            message: 'The token is required',
        });
    }
};

module.exports = userMethods; 
