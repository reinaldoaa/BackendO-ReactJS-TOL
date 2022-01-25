const productMethod = {};
const Product = require('../models/product.model');
const Rol = require('../models/rol.model');
const Category = require('../models/category.model');
//const auth = require('../middlewares/authMiddleware');
const acc = require('../middlewares/accessControl');
const path =require('path');
const fs = require('fs');

async function getProduct(_id) {
    try {
        return Product.findById(_id);
    } catch (error) {
        return false
    }
}
async function getProductOne(param) {
    try {
        return Product.findOne(param);
    } catch (error) {
        return false
    }
}
async function getCategoryOne(param) {
    try {
        return Category.findOne(param);
    } catch (error) {
        return false
    }
}
async function convertGallery(gallery){
    if (gallery.length>0) {
        let galleryObject=[];
        for (let i =0; i < gallery.length; i++){
            galleryObject.push({
                filename: gallery[i].filename,
                link: "/img/products/"+ gallery[i].filename,});
        }
        return galleryObject;
    }else{
        return [];
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
};
function deleteUploandedGallery(gallery){
    try {
        if ( gallery.length>0 ) {
            for (let i =0; i < gallery.length; i++){
                fs.unlinkSync(__dirname +'/../../public'+ gallery[i].link);
            }
            return true;
        }            
    } catch (error) {
        return false
    }
}
function deleteGallery(gallery){
    try {
        if (gallery.length > 0) {
            for (let i =0; i < gallery.length; i++) {
                fs.unlinkSync( path.join( __dirname, '/../../public/'+ gallery[i].link)  );
            }
        }
    } catch (error) {
        console.error(error);        
    }
}
productMethod.readProducts = async (req,res) => {
    const permission = acc.can( await verifyRol(req.user.roles) ).readAny('product').granted;
    if (permission) {
        const products = await Product.find();
        try {
            if (products) {
                return res.status(200).json({status:true,products,message:'exito'});                
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Not was products"});                        
            }            
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "there was a problem, please try again",});
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };
};
productMethod.readProduct = async (req,res) => {
    const permission = acc.can( await verifyRol(req.user.roles) ).readAny('product').granted;
    if (permission) {
        //const productID = req.params.id;
        const {productID} = req.body; //req.params.id;
        const products = await getProduct({_id: productID});
        try {
            if (products) {
                return res.status(200).json({status:true,products,message:'exito'});                
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Not was products"});                        
            }            
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "there was a problem, please try again",});
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };

};
productMethod.createProduct = async (req,res) => {
    //console.log(req.files.poster);
    //console.log(req.files.gallery);
    const permission = acc.can( await verifyRol(req.user.roles) ).createAny('product').granted;
    if (permission) {
        const {name,description,poster,category,price,discount,stock} = req.body;
        const categoryFound = await getCategoryOne({category});
        if (!categoryFound) return res.status(400).json({status:false,message:'Fill requered Category,createProduct'});
        const verifyPoster = req.files.poster;
        if (!verifyPoster) return res.status(400).json({status:false,message:'Poster not found,createProduct'});
        const gallery = req.files.gallery ? await convertGallery(req.files.gallery) : []; 
        if (!gallery) return res.status(400).json({status:false,message:'Gallery not found,createProduct'});
        //console.log('verifyGallery',verifyGallery);
        if (categoryFound) {
            try {
                //category = categoryFound._id;
                //console.log('verifyPoster[0].filename ',verifyPoster[0].filename );
                if (name && description &&  category && price) {
                    const newProduct = new Product({name,description,
                        poster:{filename:verifyPoster[0].filename,
                        link:'img/products/'+verifyPoster[0].filename,},
                        gallery,
                        category,price,discount,stock});
                    newProduct.category = categoryFound._id; 
                    console.log('NewProdutc-> ',newProduct);
                    if (await newProduct.save()){
                        console.log('NewProdutc-> ',newProduct);
                        return res.status(201).json({
                            status: true,
                            message: "Product created successfully",
                        });
                    } else {
                        fs.unlinkSync(verifyPoster[0].path);
                        if(req.files.gallery) {deleteGallery(req.files.gallery);}                            
                        return res.status(400).json({
                            status: false,
                            message: "there was a problem, please save in createProduct again",
                        });
                    }
                } else {
                    fs.unlinkSync(verifyPoster[0].path);
                    if(req.files.gallery) {deleteGallery(req.files.gallery);}                        
                    return res.status(400).json({status:false,message:'Fill all requered fields(name,description,price)'});
                }
            } catch (error) {
                fs.unlinkSync(verifyPoster[0].path);
                if(req.files.gallery) {deleteGallery(req.files.gallery);}                            
                return res.status(400).json({
                    status: false,
                    message: "There was a problem, please try again.."});                    
            }                
        } else {
            
        }
    }else{

    }
};
productMethod.updateProduct = async (req,res) => {
    const permission = acc.can( await verifyRol(req.user.roles) ).updateAny('product').granted;
    if (permission) {
        const {productID} = req.body; //req.params.id;
        const products = await getProduct({_id: productID});
        if (products) {
            try {
                if (name && description &&  category && price) {
                    const newProduct = new Product({name,description,
                        poster:{filename:verifyPoster[0].filename,
                        link:'img/products/'+verifyPoster[0].filename,},
                        gallery,
                        category,price,discount,stock});
                    newProduct.category = categoryFound._id; 
                    console.log('NewProdutc-> ',newProduct);
                    if (await newProduct.save()){
                        console.log('NewProdutc-> ',newProduct);
                        return res.status(201).json({
                            status: true,
                            message: "Product created successfully",
                        });
                    } else {
                        fs.unlinkSync(verifyPoster[0].path);
                        if(req.files.gallery) {deleteGallery(req.files.gallery);}                            
                        return res.status(400).json({
                            status: false,
                            message: "there was a problem, please save in createProduct again",
                        });
                    }
                } else {
                    return res.status(400).json({status:false,message:'Fill all requered fields(name,description,price)'});
                }
            } catch (error) {
                return res.status(400).json({
                    status: false,
                    message: "There was a problem, please try again.."});                    
            }                
        } else {
            return res.status(400).json({
                status: false,
                message: "Product Id not exist"});                    
        }
    }
};

productMethod.deleteProduct = async (req,res) => {
    const permission = acc.can( await verifyRol(req.user.roles) ).deleteAny('product').granted;
    if (permission) {
        const {productID} = req.body; //req.params.id;
        const products = await getProduct({_id: productID});
        try {
            if (products) {
                //const filePoster = path.join(__dirname, '/../../public/'+ products.poster.link); 
                if (fs.existsSync(  path.join(__dirname, '/../../public/'+ products.poster.link)  ) ){fs.unlinkSync( path.join(__dirname, '/../../public/'+ products.poster.link) ); };
                deleteGallery(products.gallery);
                const productSave = products;
                //const gallery = products.gallery.length > 0 ? deleteUploandedGallery(products.gallery) : [];
                //console.log(gallery);
                if ( await products.delete() ) {
                    return res.status(200).json({status:true,message:'delete successfull'});                    
                } else {
                    return res.status(400).json({status:true,message:'error register not delete'});
                }                
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Not was products"});                        
            }            
        } catch (error) {
            return res.status(400).json({
                status: false,
                message:  "there was a problem, please try again",}
                );
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this accion"});
    };
};

module.exports = productMethod;
