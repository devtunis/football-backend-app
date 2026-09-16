

import mongoose from "mongoose"



const CustomMatchesMap = new mongoose.Schema({

    matchId:{
          type : String,

      },
      roomId:{
          type : String,

  },
    mapPlayers:{
      type: [
        {
          _id:false,
          id: String,
          img:String,
          x: Number,
          y: Number
        }
      ],
      default:[]
    }

 ,

   createdAt: {
    type: Date,
    default: Date.now
  }
});



const unComingMatchDetails = mongoose.model('uncomingMatchesDetails', CustomMatchesMap);
export default unComingMatchDetails
