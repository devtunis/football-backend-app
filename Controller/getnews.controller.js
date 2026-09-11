 
import RoomMatches from "../Models/RoomMatches.js"
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
const {BAD_REQUEST,SUCCESS} = httpStatusCodes
export const HandelGetNews = async(req,res) => {
   const {roomId} = req.body 
    if(!roomId ){
        return res.status(BAD_REQUEST).json({
            message:"missing data"
        })
    }
  
    try{

         const findRoom = await RoomMatches.findOne({roomId}).select("ownerId news -_id")
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
        
 

 
        return res.status(SUCCESS).json({
                news:findRoom.news
            })
        
 


    }catch(error){
        return res.status(BAD_REQUEST).json({
            err:error.message
        })
    }
}

 