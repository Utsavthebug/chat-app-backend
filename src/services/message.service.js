import createHttpError from "http-errors"
import { MessageModel } from "../models/index.js"

export const createMessage = async(data)=>{
 let newMessage = await MessageModel.create(data)
 if(!newMessage){
    throw createHttpError.BadRequest("Error while creating new message")
 }
 return newMessage
}

export const populateMessage = async(id)=>{
    let msg = await MessageModel.findById(id).populate({
        path:'sender',
        select:'name picture',
        model:'UserModel'
    }).populate({
        path:'conversation',
        select:'name picture isGroup users',
        model:"ConversationModel",
        populate:{
            path:"users",
            select:"name email picture status",
            model:"UserModel"
        }
    })

    if(!msg) throw createHttpError.BadRequest("OOps ... something went wrong")
    return msg
}


export const getConvoMessages = async(convo_id)=>{
    const messages = await MessageModel.find({conversation:convo_id}).populate("sender","name picture email status").populate("conversation")
    if(!messages){
        throw createHttpError.BadRequest("OOps... Something went wrong!")
    }
    return messages
}