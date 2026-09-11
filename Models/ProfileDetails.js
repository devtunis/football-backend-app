import mongoose from "mongoose";

const ProfileDetailsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    matches: {
      type: Number,
    },
    wins: {
      type: Number,
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
  },
  {
    timestamps: true,
  }
);

const ProfileDetails = mongoose.model(
  "ProfileDetails",
  ProfileDetailsSchema
);

export default ProfileDetails;
