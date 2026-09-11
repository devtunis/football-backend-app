import { Int32 } from "mongodb";
import mongoose from "mongoose"



const roomSchema = new mongoose.Schema({
  roomId: {
    type: String ,
    unique:true

  },

  ownerId: {
    type: String,

  },

  nameRoom :{
    type:String,
  }
,
  bioRoom : {
    type:String ,
  },
  img: {
    type: String,
  },

  admins: {
    type: [
      {
        adminId : String  ,
        name :String ,
        img : String
      }
    ],
    default: [],
  },

  members: {
    type:[
        {
        membersId : String  ,
        name :String ,
        img : String
      }
    ] ,
    default: [],
  },

  rate :{
    type:Number,
    default :48
  },
  NumberOfComunnity :{
    type:Number,
    default:0
  },

  queeRequestJoinRoom : {
    type : [
      {
        userId : String ,
        img : String,
        name:String ,
        roomId:String,
        date: {
        type: Date,
         default: Date.now
        }


      }
    ],
    default : [],
  }
},{
    timestamps:true
});




const Rooms = mongoose.model('rooms', roomSchema);
export default Rooms
