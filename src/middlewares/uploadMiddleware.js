const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ramdomName( _n, _ext,dest,ImagesGroup) {
    const posibleChars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //let filename="";
    let filename= ImagesGroup=='gallery' ? 'gallery' : ( ImagesGroup=='poster' ? 'poster'  : '' );
    //console.log('ImagesGroup ',ImagesGroup);           
    for (let i = 0; i < _n; i++) {
        let random = Math.floor(Math.random() * (posibleChars.length - 1 - 0));
        //if (ImagesGroup=='gallery') 
        //const verifyGallery = req.files.gallery ? await convertGallery(req.files.gallery): []; 
        filename = filename + posibleChars[random];
    }
    //console.log('filename ', filename );
    //console.log('ramdomFilename + ext  ', path.join(__dirname, '/../../public/img/'+dest+'/')  + filename + _ext);
    if (fs.existsSync( path.join(__dirname, '/../../public/img/'+dest+'/')  + filename + _ext)){
        ramdomName( _n, _ext, dest,''); //( _n, _ext, dest)
        return false;
    };
    
    return filename + _ext;
}

const upload = (dest) => {
    //console.log('req: ', body);
    const storage = multer.diskStorage({
        destination:  (req, file, cb) => {
        cb(null, path.join(__dirname, '/../../public/img/'+dest ));
    },
    filename:  (req, file, cb) => {
        cb(null,ramdomName(10, path.extname( file.originalname ),dest,file.fieldname  ) );
    },
});

    return multer({
        storage: storage,
        });
};

module.exports = upload;

