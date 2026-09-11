 
 
import RoomMatches from "../Models/RoomMatches.js"
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
const {SUCCESS,BAD_REQUEST} =httpStatusCodes 
export const HandelBreakNews = async (req,res) => {
    const {roomId ,messageNews} = req.body 
    if(!roomId || !messageNews){
        return res.status(BAD_REQUEST).json({
            message:"missing data"
        })
    }
  
    try{

         const findRoom = await RoomMatches.findOne({roomId}).select("ownerId -_id")
            if(!findRoom){
        
                 return res.status(BAD_REQUEST).json({
                    message:"no room with id",
                   
                })
            }
            if(findRoom.ownerId!=req.user.id){
                return res.status(BAD_REQUEST).json({
                    message:"you not authorzied to do this request",
                    
                })
            }
        

    const UpdateNews =  await RoomMatches.findOneAndUpdate({
        roomId,
    },

   {
     $set:{
            news  :messageNews
    } 
   }
     
   ,{
    returnDocument:"after"
   }

)

if(UpdateNews){
 return res.status(SUCCESS).json({
        ok:true
    })
}
else{
     return res.status(BAD_REQUEST).json({
        ok:false
    })
}


    }catch(error){
        return res.status(BAD_REQUEST).json({
            err:error.message
        })
    }
}
