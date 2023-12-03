import createHttpError from "http-errors"
import logger from "../configs/logger.config.js"
import tryCatch from "../utils/tryCatch.js"
import { findUser } from "../services/user.service.js"
import { createConversation, doesConversationExist, getUserConversations, populateConversation } from "../services/conversation.service.js"

export const create_open_conversation = tryCatch(async(req,res)=>{
    const sender_id = req.user.userId

    const {receiver_id} = req.body
    //check receiver id is provided 
    if(!receiver_id){
        logger.error("Please provide the user id you wanna start a conversation with!")
        throw createHttpError.BadRequest("something went wrong")
    }
    //check if chat exists 
    const existed_conversation = await doesConversationExist(sender_id,receiver_id)
    if(existed_conversation){
        return res.json(existed_conversation)
    }
    else{
        //getting receiver name 
        let receiver_user = await findUser(receiver_id)

        let convoData = {
            name : receiver_user.name,
            picture:receiver_user?.picture,
            isGroup:false,
            users:[sender_id,receiver_id]
        }
        const newConvo = await createConversation(convoData)
        //populate users in  conversation
        const populatedConvo = await populateConversation(newConvo._id,"users","-password")

        res.status(200).json(populatedConvo)
    }
})

export const getConversations = tryCatch(async(req,res)=>{
    const user_id = req.user.userId 

    const conversations = await getUserConversations(user_id)


    res.status(200).json(conversations ||  [])
})