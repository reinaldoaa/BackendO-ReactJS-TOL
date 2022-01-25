const express=require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const app = express();
require('./config/config');

//Set more security to request
app.use(helmet());

//Allow cors
app.use(cors());

//Set module for helped request information
app.use(morgan('combined'));

//Define json request
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Define static file access
app.use(express.static(path.join(__dirname,'public')));

//Configure routes
app.use('/category',require('./routers/category.router'));
app.use('/user',require('./routers/use.router'));
app.use('/rol',require('./routers/rol.router'));
app.use('/product',require('./routers/product.router'));

module.exports = app;
