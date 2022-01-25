const express = require('express');
const router = express.Router();
const {readProduct,readProducts,createProduct,updateProduct,deleteProduct} = require('../controllers/product.controller');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router
.get('/getProduct/:id',auth,readProduct)
.get('/getProducts',auth,readProducts)
.post('/createProduct',auth,upload("products").fields( [
    {name: "poster", maxCount : 1},
    {name: "gallery", maxCount : 5},] ), createProduct)
.put('/updateProduct',auth,updateProduct)
.delete('/deleteProduct',auth,deleteProduct);

module.exports= router;