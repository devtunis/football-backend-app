import mongoose from "mongoose"



const userSchema = new mongoose.Schema({
    id:{
        type : String,
    },
    user_name: {
    type: String,
    unique : true ,

  },
  img: {
    type: String,
  },
  password : {
    type : String ,
  },

   matches: {
     type: Number,
     default : 0
    },
    wins: {
      type: Number,
      default : 0
  },
      Goals: {
      type: Number,
      default : 0
  },
        Assists: {
      type: Number,
      default : 0
  },
 coins: {
      type: Number,
      default : 50
  },
    Trophys : {
      type: [String],
      default: [],
    },
    psuedoName: {
      type: String,
    },
    verifed: {
      type: Boolean,
      default:false
  }
    ,
  createdAt: {
    type: Date,
    default: Date.now
  }
});



const User = mongoose.model('Users', userSchema);
export default User
