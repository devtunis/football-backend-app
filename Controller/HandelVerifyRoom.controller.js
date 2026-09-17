import RoomsFollow from "../Models/filter.js"
import Rooms from "../Models/room.js"
import RoomMatches from "../Models/RoomMatches.js"
import { httpStatusCodes } from "../Status/httpStatusCodes.js"

export const   HandelVerifyRoom =async (req,res) => {
  
    const {BAD_REQUEST,SUCCESS} = httpStatusCodes
    try{
 
         const {roomId} = req.body
         if(!roomId){
            return res.status(BAD_REQUEST).json({
                message:"missing fields"
            })
         }

        const findRoomsFollow = await RoomsFollow.findOne({id:req.user.id}) 

        if(!findRoomsFollow){
             return res.status(BAD_REQUEST).json({
             err:"no room exist"
        })
        }
        const ListFollowRoom = findRoomsFollow.roomsfollow  
      
        const seeIfFind =  ListFollowRoom.find((item)=>item==roomId)
        if(!seeIfFind)
        {
            return res.status(BAD_REQUEST).json({
                isMember:false,
            
            })

        }


        const bringUncomingRoms = await RoomMatches.findOne({roomId}).select("uncomingMatches finishedmatches  -_id")

        const checkPermison = await Rooms.findOne({roomId})
        return res.status(SUCCESS).json({
             permision:checkPermison.ownerId==req.user.id,
             isMember:true,
             uncomingMatches:bringUncomingRoms.uncomingMatches,
             finishedmatches  : bringUncomingRoms.finishedmatches,
             roomId
        })
    }
    catch(err){
        return res.status(BAD_REQUEST).json({
            message:err
        })
    }
}

 