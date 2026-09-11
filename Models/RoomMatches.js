import mongoose from "mongoose";
import Sqids from 'sqids'
 
 
const exportRoomMatches = new mongoose.Schema({
    
    roomId  :{
        type:String,
        unique:true
    },
    nameroom:{
        type:String,
        
    },
    ownerId:{
        type:String
    },
    news : {
        type:String,
        default:'no'
    },
    uncomingMatches : [
        {  
            _id:false,
            matchId :{type:String,default:()=>crypto.randomUUID()},
            time: {type:String},
            location : {type:String},
            maxplayer : {type:Number},
            description :{type:String},
            author:{type:String},
            currentPlayer:{type:Number,default:0},
        }
    ]
    ,
    finishedmatches : [
        {
        _id:false,
        finishedId :{type:String,default:()=> crypto.randomUUID() },
        imgA:{type:String},
        nameA:{type:String},
        imgB:{type:String},
        nameB:{type:String},
        result:{type:String,trim:true},
        date:{
            type:Date,
             default: () => new Date(Date.now() + 60 * 60 * 1000)
        }
        }
    ]
    ,
    bestplayer: {
    type: {
        name: String,
        likes: Number,
        img: String,
        goals: Number
    },
    default: {
        name: "",
        likes: 0,
        img: "",
        goals: 0
    }
    }
 
});


 
const RoomMatches = mongoose.model('RoomMatches', exportRoomMatches);
export default RoomMatches

// chagne it to extendRoom::