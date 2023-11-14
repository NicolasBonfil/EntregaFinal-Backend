import { Router } from "express"
import usersController from "../controllers/users.controller.js"
import auth from "../middlewares/auth.middlewares.js"
import { uploader } from "../utils/multer.js"
import authorized from "../middlewares/premium.middleware.js"

const uploaderDocuments = [
    uploader.any()
]



class UsersRouter{
    constructor(){
        this.InicioUser = Router()

        this.InicioUser.get("/profile", auth(["BASIC", "PREMIUM", "ADMIN"]), usersController.profile)
        this.InicioUser.post("/premium", auth(["BASIC", "PREMIUM"]), authorized(), usersController.changeRole)
        this.InicioUser.post("/documents", auth(["BASIC", "PREMIUM", "ADMIN"]), uploaderDocuments, usersController.uploadDocuments)
        this.InicioUser.get("/", auth(["ADMIN"]), usersController.getUsers)
        this.InicioUser.post("/adminControl", auth(["ADMIN"]), usersController.adminControl)
        this.InicioUser.delete("/deleteUsers", auth(["ADMIN"]), usersController.deleteUsers)
        this.InicioUser.get('/actualUser', async (req, res) => {
            res.send(req.user)
        })
    }

    getRouter(){
        return this.InicioUser
    }
}

export default new UsersRouter()