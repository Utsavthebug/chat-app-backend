import createHttpError from "http-errors";
import { UserModel } from "../models";

export const findUser = async(userId) =>{
    const user = await UserModel.findById(userId)
    if(!user) throw createHttpError.BadRequest("Please fill all the fields")
    return user
}