 
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
import unComingMatchDetails from "../Models/custom_Matches.js"
import RoomMatches from "../Models/RoomMatches.js"
const {BAD_REQUEST,SUCCESS,CONFLICT} = httpStatusCodes
export const HandelJoinSession = async(req,res)=>{
    const {matchId ,roomId} = req.body
      


      let userExist =  await unComingMatchDetails.findOne({
            matchId,
            roomId,
            "mapPlayers.id":req.user.id
            },
 
        
            )

        if(userExist){
            return res.status(CONFLICT).json({
                err:"duplicate user"
            })
        }

      const SeeMaxPlayer = await unComingMatchDetails.findOne({
            matchId,
            roomId,
            
            })
            console.log(SeeMaxPlayer,"mdn refrence")
            if (SeeMaxPlayer.mapPlayers.length>=SeeMaxPlayer.maxPlayer ){
               return res.status(BAD_REQUEST).json({
                err:"the room full !!"
            })
            }
  
    

            let user = {
                    matchId:matchId,
                    roomId: roomId,
                    id:req.user.id,
                    img:req.user.img,
                    x: 0,
                    y: 0
            }
            
      let d =  await unComingMatchDetails.findOneAndUpdate({
            matchId,
            roomId
            },

            {
                $push: {
                mapPlayers : user,
                registerM : user
                }
            }
        ,
            {
                returnDocument:"after"
            }
            )


            await RoomMatches.findOneAndUpdate(
                  {
                    roomId,
                    "uncomingMatches.matchId": matchId,
                  },
                  {
                    $push: {
                      "uncomingMatches.$.currentPlayer": user,
                     "uncomingMatches.$.registerPlayer": user,  //  can i push in 2 table???? like this ???
                    },
                  },
                  {
                    returnDocument: "after",
                  }
                );
        



  return res.status(SUCCESS).json(d)

  

}