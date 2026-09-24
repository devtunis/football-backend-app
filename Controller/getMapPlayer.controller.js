
 
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
import unComingMatchDetails from "../Models/custom_Matches.js"
import RoomMatches from "../Models/RoomMatches.js"

const { BAD_REQUEST ,SUCCESS} = httpStatusCodes


export const getMapPlayer = async(req,res)=>{
    
    try{
        const { matchId,roomId} = req.body
    
        const Res = await unComingMatchDetails.findOne({
            matchId,
            roomId
        }).select("-_id")
  
        console.log(Res)
       
      
        
            return res.status(SUCCESS).json({
                mapPlayers:Res.mapPlayers,
                isOwner:req.user.id===Res.ownerId,
                isMember: Res.registerM.find(item => item.id ==req.user.id)?  true:req.user.id===Res.ownerId  ,
               
                
            })

    }


     
   catch(err){

      return res.status(BAD_REQUEST).json({
        err:err.messag
      })
   }

}
 

 