import RoomMatches from "../Models/RoomMatches.js"
import { httpStatusCodes } from "../Status/httpStatusCodes.js"

 
const { BAD_REQUEST ,SUCCESS} = httpStatusCodes

export const HandelsetBestPlayers = async(req,res) => {
   try{

  const {name,likes,img,goals,roomId}  = req.body 
  if(!name || likes==null|| !img || goals==null || !roomId){
    return res.status(BAD_REQUEST).json({
        err:"missing fields"
    })
  }

  const  findRoom = await RoomMatches.findOneAndUpdate({roomId},
    {
        $set:{
            bestplayer:{name,likes,img,goals}
        }
    },
    {
        returnDocument:"after"
    }
  )
  if(!findRoom){
    return res.status(BAD_REQUEST).json({err:"no room in this id"})
  }
  if(findRoom.ownerId!=req.user.id){
    return res.status(BAD_REQUEST).json({err:"you not authorized in this action"})
  }



    return res.status(SUCCESS).json(findRoom.bestplayer)


   }catch(err){
    return res.status(BAD_REQUEST).json({
        err:err.message
    })
   }
}

 