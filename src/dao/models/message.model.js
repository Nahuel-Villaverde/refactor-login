import mongoose, { mongo } from "mongoose";

const messageCollection = "Mensaje"

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
})

const messageModel = mongoose.model(messageCollection, messageSchema)

export default messageModel