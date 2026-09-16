
import RoomMatches from "../Models/RoomMatches.js"
import unComingMatchDetails from "../Models/custom_Matches.js"
import { httpStatusCodes } from "../Status/httpStatusCodes.js"

const {SUCCESS ,BAD_REQUEST}   = httpStatusCodes
export const createMatchcontroller =async (req,res) => {
    const {roomId,time,location,maxplayer,description} = req.body


    if(!roomId || !time || !location || !maxplayer || !description       ){
        return res.status(BAD_REQUEST).json({
            message:"missing fields",
            code:1
        })
    }
  try{

    const findRoom = await RoomMatches.findOne({roomId}).select("ownerId -_id")
    if(!findRoom){

         return res.status(BAD_REQUEST).json({
            message:"no room with id",
            code:2
        })
    }
    if(findRoom.ownerId!=req.user.id){
        return res.status(BAD_REQUEST).json({
            message:"you not authorzied to do this request",
            code:3
        })
    }


    const genreateKey = crypto.randomUUID()
 // description here do trim  for description and found about it
    await RoomMatches.findOneAndUpdate(
        { roomId },
        {
            $push:{
                uncomingMatches : {
                    matchId:genreateKey,
                    time,
                    location,
                    maxplayer,
                    description,
                    author:req.user.user_name,
                }
            }
        }


)

    const SaveDetailsMatches = new unComingMatchDetails({
      roomId,
      matchId:genreateKey

    })

await SaveDetailsMatches.save()

    res.status(SUCCESS).json({
       roomId,time,location,maxplayer,description
    })
  }catch(err){
    res.status(BAD_REQUEST).json({
        message:err.message
    })
  }
}
