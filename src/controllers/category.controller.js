const categoryMethod = {};
const Category = require('../models/category.model');
const Rol = require('../models/rol.model');
const acc = require('../middlewares/accessControl');
    
async function getCategoryById(_id) {
    try{
        return Category.findById(_id);
    } catch (error){
        return false
    }
};
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
};
categoryMethod.readCategorys = async (req,res) => {
    //console.log(req.user.roles);
    const rolesFound = await verifyRol(req.user.roles);
    const permission = acc.can(rolesFound).readAny('rol').granted;
    if (permission) {
        const category = await Category.find();
        try {
            if (category){
                return res.status(200).json({
                    status: true,
                    category,
                    message: "Category find"});
            } else{
                return res.status(400).json({
                status: false,
                message: "Not Category find"});    
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Not Category find"});
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };

};
categoryMethod.readCategory = async (req,res) => {
    //const rolesFound = await verifyRol(req.user.roles);
    const permission = acc.can( await verifyRol(req.user.roles) ).readAny('rol').granted;
    if (permission) {
        try {
            const categoryID = req.params.id;
            if (categoryID) {
                const category = await getCategoryById(categoryID);
                if (category){
                    return res.status(200).json({
                        status: true,
                        category,
                        message: "category find"});
                } else{
                    return res.status(400).json({
                    status: false,
                    message: "Not Category find"});    
                }
            } else {
                return res.status(400).json({
                status: false,
                message: "The Category ID is requered"});    
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
categoryMethod.createCategory = async (req,res) => {
    //console.log('categories ',await  Category.find() );
    const permission = acc.can( await verifyRol(req.user.roles) ).createAny('rol').granted;
    if (permission) {
        try {
            const {name} = req.body;
            const categoryFound = await Category.find();
            const categoryExist = categoryFound.some( (Categories)  => { return Categories.name === name}  );
            if (!categoryExist) {
                const category = new Category({name,});
                if (await category.save()){
                    return res.status(201).json({
                        status: true,
                        message: "Category created successfully",
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "there was a problem, please save again",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    //message: "Fill all requered fields"
                    message: "category exist"
                });
            }                    
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "there was a problem, please try again",
            });    
        }        
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };
};
categoryMethod.updateCategory = async (req,res) => {
    const permission = acc.can( await verifyRol(req.user.roles) ).updateAny('rol').granted;
    if (permission) {
        const {categoryID,name} = req.body;
        console.log(categoryID);
        if (categoryID && name ) { 
            try{
                const category = await getCategoryById(categoryID);        
                if (category){
                    if (await category.updateOne({name}) ) {
                        return res.status(200).json({
                        status: true,
                        message: "The Category was updated successfully",});
                    } else {
                        return res.status(400).json({
                        status: false,
                        message: "There was a problem, please updated again",});
                    }
                } else {
                    return res.status(400).json({
                    status: false,
                    message: "The categoryID, was not found",});                   
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
categoryMethod.deleteCategory = async (req,res) => {
    const permission = acc.can( await verifyRol(req.user.roles) ).deleteAny('rol').granted;
    if (permission) {
        try {
            const {categoryID} = req.body;// req.params.id;
            if (categoryID) {
                const category = await getCategoryById(categoryID);
                if (category){
                    if (await category.deleteOne()){
                        return res.status(200).json({
                            status: true,
                            message: "The Category was deleted successfully"});    
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

module.exports = categoryMethod;
