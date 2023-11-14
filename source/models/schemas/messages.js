import mongoose from "mongoose";

const mesagesCollection = "messages"

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time_date: Object
})

const messagesModel = mongoose.model(mesagesCollection, messagesSchema)

export default messagesModel