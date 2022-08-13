import UserSchema from "../../helpers/server/models/user.ts";
import mongoose from "mongoose";
import dbConnect from '../../lib/dbConnect'

const getSubs = async (req, res) => {

    await dbConnect()
  
    const _userName = req.query.userName

    UserSchema.findOne({ "name": _userName }, (err, result) => {
        if (err || result === null) {
            console.log('Failed to get subs', result, err)
            res.status(500).send('Failed to get subs')  
        } else {
            console.log('Got subs!') 
            res.status(200).send(result)
        }
    })
}

export default getSubs
