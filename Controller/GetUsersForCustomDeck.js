 


 
 
import Rooms from "../Models/room.js"
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
 
const {BAD_REQUEST,SUCCESS} = httpStatusCodes

 
export  const GetUsersForCustomDeck = async (req,res) => {
    try{

        const {roomId} = req.body 
        if(!roomId){
             return res.status(BAD_REQUEST).json({err:"missing fields"})    
        }

        const room =  await Rooms.findOne({
            roomId
        }).select("ownerId members -_id")
        if(!room){
            return res.status(BAD_REQUEST).json({
                err:"no room with this id!!"
            })
        }
        if(room.ownerId!=req.user.id){
                return res.status(BAD_REQUEST).json({err:"you can't do this action"})    
        }
        return res.status(SUCCESS).json(
            {
               members :   room.members
            }
        )
    }
  
      catch(err){
           return res.status(BAD_REQUEST).json({err:err.message})   
        }


}
 