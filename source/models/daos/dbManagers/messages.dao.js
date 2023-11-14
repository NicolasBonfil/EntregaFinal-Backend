import messagesModel from "../../schemas/messages.js";
import moment from "moment";

class MessagesDAO{
    getAllMessages = () => {
        let messages = messagesModel.find().lean();
        if(!messages){
            messages = []
        }
        return messages
    }

    saveMessages = async (user, message) => {
        let result = await messagesModel.create({user, message, time_date: {date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString()}})
        return result
    }
}

export default new MessagesDAO()