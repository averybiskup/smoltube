import mongoose from "mongoose"

const Schema = mongoose.Schema

const User = new Schema({
  name: {
    type: String
  },
  subs: [String]
})

const UserSchema = mongoose.models.UserSchema || mongoose.model('users', User )

export default UserSchema
