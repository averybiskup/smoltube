import mongoose from "mongoose"

const Schema = mongoose.Schema

const User = new Schema({
  name: {
    type: String
  },
  joinDate: {
    type: Date  
  },
})

const UserSchema = mongoose.model("users", User)
export default UserSchema
