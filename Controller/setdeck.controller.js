
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
const { BAD_REQUEST, SUCCESS } = httpStatusCodes
import unComingMatchDetails from "../Models/custom_Matches.js"
import RoomMatches from "../Models/RoomMatches.js"
import Rooms from "../Models/room.js"

export const setDeckForMatches = async (req,res) => {
  try {
 
         
         const {matchId , roomId ,map} = req.body 
        
         if(!matchId  || !roomId || !map)

         {
          return res.status(BAD_REQUEST).json({
            message :"missing fields"
          })
         }
           const room = await Rooms.findOne({roomId}).select("ownerId")
          if(room.ownerId!=req.user.id)return res.status(BAD_REQUEST).json({err:"you not auhtorized to do this action"})



  const SeeMaxPlayer = await unComingMatchDetails.findOne({
            matchId,
            roomId,
            
            })
            console.log(SeeMaxPlayer,map ,"this is the length of the map",map.length)
            if (map.length>SeeMaxPlayer.maxPlayer ){
               return res.status(BAD_REQUEST).json({
                err:"the room Pretty full !!"
            })
            }





         // delete deck 
            await unComingMatchDetails.findOneAndUpdate({
              matchId,
              roomId
            },

              {
                $set: {
                  mapPlayers : [] 
                }
              }
      
              
            )
    
  //set the deck
    const findUncomingMatches = await unComingMatchDetails.findOneAndUpdate({
      matchId,
      roomId
    },

      {
        $push: {
           mapPlayers : map
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
          $set: {
            "uncomingMatches.$.currentPlayer": map,
          },
        },
        {
          returnDocument: "after",
        }
      );



    res.status(SUCCESS).json(findUncomingMatches)
  } catch (err) {
    res.status(BAD_REQUEST).json({
       err:err.message
     })
}
}
