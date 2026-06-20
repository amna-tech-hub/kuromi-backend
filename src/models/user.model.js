import mongoose from 'mongoose'

const userSchema=mongoose.Schema({
name:{
    type:String,
    required:[true," name is the required field"]
},
password:{
 type:String,
    required:[true," password is the required field"]
},
email:{
    type:String,
    unique:true,
    required:[true," email is the required field"]
},
isVerified:{
type:Boolean,
default:false,
required:true
},
otp: {
  code: String,
  expiresAt: Date
}

})

export const User=mongoose.model('User',userSchema)
