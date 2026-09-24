 
 
import Rooms from "../Models/room.js"
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
const {BAD_REQUEST,SUCCESS} = httpStatusCodes
export const HandelGetMemebers = async(req,res) => {
   try{ 
    const {roomId}  = req.body 
    if(!roomId){
        return res.status(BAD_REQUEST).json({
        err:"missing fileds"
     }) 
    }
    
    const findRoom = await Rooms.findOne({roomId})
    if(!findRoom){
          return res.status(BAD_REQUEST).json({
        err:"no room  without this id"
     }) 
    }
    if(req.user.id!=findRoom.ownerId)
    {
        return res.status(BAD_REQUEST).json({
            err:"you not authorized to do this action"
        })
    }
  res.status(SUCCESS).json({
        members:findRoom.members
     })
   }catch(err){
     res.status(BAD_REQUEST).json({
        err:err.messaeg
     })
   }
}

 