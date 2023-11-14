import messagesRepository from "../models/repositories/messages.repository.js"
import socketServer from "../app.js"
import { HTTP_STATUS, successResponse } from "../utils/responses.js"

class MessageController{
    async getAllMessages(req, res, next){
        try {
            const messages = await messagesRepository.getAllMessages()
            socketServer.emit("messages", messages)
            res.render("chat", {messages})
        } catch (error) {
            req.logger.error(error.message)
           next(error)
        }
    }

    async saveMessages(req, res, next){
        const {message} = req.body
        const user = req.user.email

        try {
            const newMessage = await messagesRepository.saveMessages(user, message)
            socketServer.emit("newMessage", newMessage)
            const response = successResponse(newMessage)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }
}

export default new MessageController()