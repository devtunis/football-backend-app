 

import mongoose from "mongoose"



const RoomsFollowbd = new mongoose.Schema({
 
    id:{
        type : String,
        unique:true
    },
    roomsfollow:{
        type : [String],
        default : []
    }
  
 ,
 
   createdAt: { 
    type: Date, 
    default: Date.now 
  }
});


 
const RoomsFollow = mongoose.model('RoomsFollow', RoomsFollowbd);
export default RoomsFollow
