import mongoose from "mongoose";

let temptokenSchema=new mongoose.Schema({
    token:String,
     userId: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1000*60*5}

}
)

export const temptoken=mongoose.model("temptoken",temptokenSchema)