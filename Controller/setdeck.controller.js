
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
const { BAD_REQUEST, SUCCESS } = httpStatusCodes
import unComingMatchDetails from "../Models/custom_Matches.js"


export const setDeckForMatches = async (req,res) => {
  try {
 
         
         const {matchId , roomId ,map} = req.body 
         if(!matchId  || !roomId || !map)

         {
          return res.status(BAD_REQUEST).json({
            message :"missing fields"
          })
         }


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

    res.status(SUCCESS).json(findUncomingMatches)
  } catch (err) {
    res.status(BAD_REQUEST).json({
       err:err.message
     })
}
}
