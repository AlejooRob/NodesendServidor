const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async ( req, res, next) => {

    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 1024 *1024 *10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`)
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async(error) =>{
        console.log(req.file);
        if(!error) {
            res.json({archivo: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });
}
exports.eliminarArchivo = ( req, res) => {
    console.log(req.archivo);
    try {
        fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`);
        console.log('Archivo Eliminado');
    } catch (error) {
        console.log(error);
    }
}

//descarga un archivo
exports.descargar = async (req, res, next) => {

    //Obtiene el enlace 
    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo})

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);


    //Eliminar archivo y la entrada de la base de datos
    //Si las descargas son iguales a 1 borrar el archivo
    const { descargas, nombre } = enlace;

    if(descargas === 1) {
        //Eliminar el archivo
        req.archivo = nombre 
        
        //Eliminar la entrada de la bd
        await Enlaces.findOneAndRemove(enlace.id);
        next()
    } else {
        //Si las descargas son mayores a 1
        enlace.descargas--;
        await enlace.save();
    }
}