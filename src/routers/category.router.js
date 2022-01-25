const express = require('express');
const router = express.Router();
const {readCategory,readCategorys,createCategory,updateCategory,deleteCategory} = require('../controllers/category.controller');
const auth = require('../middlewares/authMiddleware');

router
.get('/getCategory/:id',auth,readCategory)
.get('/getCategorys',auth,readCategorys)
.post('/createCategory',auth,createCategory)
.put('/updateCategory',auth,updateCategory)
.delete('/deleteCategory',auth,deleteCategory);

module.exports= router;