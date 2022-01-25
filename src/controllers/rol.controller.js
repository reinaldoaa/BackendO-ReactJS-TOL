const rolMethod = {};
const Rol = require('../models/rol.model');
const acc = require('../middlewares/accessControl');
    
async function getRol(_id) {
    try{
        return Rol.findById(_id);
    } catch (error){
        return false
    }
}
async function verifyRol(rols) {
    try {
        const rolesId = await Rol.find( { _id: {$in: rols}});
        if (rolesId) {
            const rolesName = rolesId.map( Rols => Rols.name );
            return rolesName;
        } else {
            return res.status(400).json({status: false, message: "there was a problem, Rol not found",});
        }
    } catch (error) {
        return res.status(400).json({status: false, message: "there was a problem, Rol not found, please try again",});        
    }
}

rolMethod.readRols = async (req,res) => {
    const rolesFound = await verifyRol(req.user.roles);
    const permission = acc.can(rolesFound).readAny('rol').granted;
    if (permission) {
        const rols = await Rol.find();
        try {
            if (rols){
                return res.status(200).json({
                    status: true,
                    rols,
                    message: "Rols find"});
            } else{
                return res.status(400).json({
                status: false,
                message: "Not rols find"});    
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Not rols find"});
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };

};

rolMethod.readRol = async (req,res) => {
    const rolesFound = await verifyRol(req.user.roles);
    const permission = acc.can(rolesFound).readAny('rol').granted;
    if (permission) {
        try {
            const rolID = req.params.id;
            if (rolID) {
                const rol = await getRol(rolID);
                if (rol){
                    return res.status(200).json({
                        status: true,
                        rol,
                        message: "Rol find"});
                } else{
                    return res.status(400).json({
                    status: false,
                    message: "Not rol find"});    
                }
            } else {
                return res.status(400).json({
                status: false,
                message: "The Rol ID is requered"});    
            }    
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "There was a problem, please try again"});
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };
    
};

rolMethod.createRol = async (req,res) => {
    const rolesFound = await verifyRol(req.user.roles);
    const permission = acc.can(rolesFound).createAny('rol').granted;
    if (permission) {
        const {name} = req.body;
        //console.log('Object.values(rols)=> ', Object.values(rols) );
        if (name) {
            const verify = Object.values(rols).some((rol) => { return rol === name;  });        
            //console.log(verify);
            if (!verify) {
                const rol = new Rol({name,});
                //console.log(rol);
                if (await rol.save()){
                    return res.status(201).json({
                        status: true,
                        message: "Rol created successfully",
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "there was a problem, please try again",
                    });
                }
            } else {
                    return res.status(400).json({
                    status: false,
                    message: "The name is not allow",
                });
            }            
        } else {
            return res.status(400).json({
                status: false,
                message: "Fill all requered fields"
            });
        }    
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };
};

rolMethod.updateRol = async (req,res) => {
    const rolesFound = await verifyRol(req.user.roles);
    const permission = acc.can(rolesFound).updateAny('rol').granted;
    if (permission) {
        const {rolID,name} = req.body;
        if (rolID && name ) { 
            try{
                const rol = await getRol(rolID);        
                if (rol){
                    const verify = Object.values(rols).some( rol => {return rol===name;});
                    if (!verify){
                        return res.status(400).json({
                        status: false,
                        message: "The name is not allowed "});
                    }
                    //console.log('updateRol!verify: ',Object.values(rols));
                    console.log('rol: ',rol.name);
                    //if (await rol.findByIdAndUpdate(req.params.id,{name}) ) {
                    if (await rol.updateOne({name}) ) {
                        return res.status(200).json({
                        status: true,
                        message: "The rol was updated successfully",});
                    } else {
                        return res.status(400).json({
                        status: false,
                        message: "There was a problem, please try again",});
                    }
                } else {
                    return res.status(400).json({
                    status: false,
                    message: "The rolID, was not found",});                   
                }
            } catch (error){
                return res.status(400).json({
                status: false,
                message: "There was a problem, please try again-catch.error",});
                }
        } else {
            return res.status(400).json({
            status: false,
            message: "Fill all requered  fields"});
        }
    } else {
        return res.status(400).json({
        status: false,
        message: "You can't do this accion"});
    };

            
};
rolMethod.deleteRol = async (req,res) => {
    //const permission = acc.can(req.user.rol.name).deleteAny('rol').granted;
    const rolesFound = await verifyRol(req.user.roles);
    const permission = acc.can(rolesFound).updateAny('rol').granted;
    if (permission) {
        try {
            const {rolID} = req.body;// req.params.id;
            if (rolID) {
                const rol = await getRol(rolID);
                if (rol){
                    if (await rol.deleteOne()){
                        return res.status(200).json({
                            status: true,
                            message: "The Rol was deleted successfully"});    
                    } else {                    
                        return res.status(400).json({
                        status: false,
                        message: "The was a problem, not delet"});    
                    }
                } else{
                    return res.status(400).json({
                    status: false,
                    message: "The rolID, was not found"});    
                }
            } else {
            }    
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "There was a problem, please try again"});
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };

};

module.exports = rolMethod;
