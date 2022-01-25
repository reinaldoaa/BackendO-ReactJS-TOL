const app=require("./app");
require('dotenv').config();
const dotenv=require('dotenv').config();
const BASE_PORT = process.env.PORT; // dotenv.parsed.PORT;
require('../database');

async function init() {
	if (dotenv.error) {
		throw dotenv.error
	}
	//console.log(dotenv); console.log(BASE_PORT); 
	await app.listen( BASE_PORT || 4000); // process.env.PORT 
	console.log("app running on port : " , process.env.PORT || 4000 ); // . dotenv.parsed.PORT || 3000
}
init();
module.exports = app;


