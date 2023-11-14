import userModel from "../models/schemas/Users.model.js"
import { HTTP_STATUS, successResponse } from "../utils/responses.js"
import { updateCookie } from "../utils/updateCookie.js"
import moment from "moment"

class UsersController{
    async profile(req, res, next){
        const user = req.user 
        res.render("current", {user})
    }

    async changeRole(req, res, next){
        if(req.user.role === "BASIC"){
            req.user.role = "PREMIUM"
        }else{
            req.user.role = "BASIC"
        }

        await userModel.updateOne({email: req.user.email}, req.user)

        updateCookie(res, req.user)

        res.send(`Se ha en convertido en un usuario: ${req.user.role}`)
    }

    async uploadDocuments(req, res, next){
        if(!req.files){
            return res.status(400).send({status: "error", error: "No se guardo la imagen"})
        }

        req.files.forEach(file => {
            req.user.documents.push({name: file.fieldname, reference: file.path})
        });

        await userModel.updateOne({email: req.user.email}, req.user)

        updateCookie(res, req.user)

        const response = successResponse(req.user)
        res.status(HTTP_STATUS.OK).send(response)
    }

    async getUsers(req, res, next){
        const allUsers = await userModel.find()
        let users = allUsers.map(u => (
            {
                first_name: u.first_name,
                last_name: u.last_name,
                email: u.email,
                role: u.role,
            }
        ))

        res.render("users", {users})
    }

    async deleteUsers(req, res, next){
        const users = await userModel.find()
        const eliminatedUsers = []
        
        users.forEach(async u => {
            let lastConnection = u.last_connection
            let now = moment()
            let hourDifference = now.diff(lastConnection, "hours")

            if(hourDifference >= 48){
                await userModel.findByIdAndRemove(u._id)
                eliminatedUsers.push(u)

                const transport = nodemailer.createTransport({
                    service: "gmail",
                    port: 587,
                    auth: {
                        user: "bonfil.nico@gmail.com",
                        pass: "vohcftbednjfztsj"
                    }
                })
        
                const mailParams = {
                    from: "bonfil.nico@gmail.com",
                    to: u.email,
                    subject: "Usuario eliminado",
                    html: `<div>
                        <p>Tu usuario ha sido eliminado por inactividad.</p>
                    </div>`,
                }
        
                transport.sendMail(mailParams, (error, info) => {
                    if (error) {
                        customError.createError({
                            name: "Error al enviar el mail",
                            cause: "Internal Server Error",
                            message: "Ha ocurrido un error en el servidor",
                            code: EError.DATABASE_ERROR
                        })
                    }
                    
                    const result = successResponse(info)
                    return res.status(HTTP_STATUS.OK).send({status: "success", result});
                });
            }            
        })

        const response = successResponse(eliminatedUsers)
        res.status(HTTP_STATUS.OK).send(response)
    }

    async adminControl(req, res, next){
        const {email, accion} = req.body

        if(accion === "eliminar"){
            try{
                await userModel.findOneAndDelete({email})
                return res.status(HTTP_STATUS.OK).send({message: "Se elimino el usuario correctamente"})
            } catch(error){
                return next(error)
            }
        }

        const user = await userModel.findOne({email: email})

        if(user.role === "BASIC"){
            user.role = "PREMIUM"
        }else{
            user.role = "BASIC"
        }

        await userModel.updateOne({email: email}, user)

        res.send(`Se ha en convertido en un usuario: ${user.role}`)
    }
}

export default new UsersController()