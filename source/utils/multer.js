import multer from "multer";
import __dirname from "../dirname.js"
import fs from "fs"

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.fieldname == "Imagen De Perfil"){
            cb(null,  __dirname + `/public/images/profile`)
        }else if(file.fieldname == "Producto"){
            cb(null,  __dirname + `/public/images/products`)
        }else{
            cb(null,  __dirname + `/public/images/documents`)
        }
    },
    filename: function(req, file,cb){
        cb(null, file.originalname)
    }
})

export const uploader = multer({storage})