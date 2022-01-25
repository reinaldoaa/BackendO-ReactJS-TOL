const mongoose = require('mongoose');
//require('dotenv').config();
const URI = process.env.status ==="PROD" ?  process.env.DB_URI_PROD : process.env.DB_URI_DEV;
const db = mongoose.connection;//console.log(URI);

function connect() { 
	mongoose.connect(URI, 
        { useUnifiedTopology:true,
        useNewUrlParser: true
        })
    .then( db => console.log('Database Mongoose Connect'))
    .catch(error=> console.log(error))
}
connect();

//mongoose.connect("mongodb://local...")
//.then(db => console.log('db connected')
//.catch(error=> console.log(error))




        //        useCreateIndex: true,
        /*
        //configuracion inicial para el curso basico
        useCreateIndex:true,
        useFindAndModify: false,
        useNewUrlParser: true,
        */

/*

    db.on('open',(_) => {console.log('Database Mongoose Connect'); });
    db.on('error',error => console.log('Error Conexión : ',error));

mongoose.connect(URI, {
        useUnifiedTopology:true,
        useNewUrlParser: true,
        // useCreateIndex: true,
        //configuracion inicial para el curso basico
        //useCreateIndex:true,
        //useFindAndModify: false,
        //useNewUrlParser: true,
    });
    db.on('open',(_) => {console.log('Database Mongoose Connect'); });
    db.on('error',error => console.log('Error Conexión : ',error));

*/






/*
function connect() { 
	mongoose.connect(DB_URI, {
        useUnifiedTopology:true,
        useCreateIndex: true,
        useNewUrlParser: true,
    });
    db.on('open',()=> {
	console.log('Database Connect');
	});
    db.on('Error',(error) => console.log('Error: ',error));
};
connect();
*/