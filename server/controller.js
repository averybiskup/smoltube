// @format
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import ChannelScheme from "./models/channel.js";
import UserSchema from "./models/user.js";

dotenv.config();

const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const YOUTUBE_KEY = process.env.API_KEY;

const getPlaylistID = async (channel, key, callback) => {
  const getUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${channel}&key=${key}`;

  axios
    .get(getUrl)
    .then((res) => {
      const pid =
        res.data.items[0]["contentDetails"]["relatedPlaylists"]["uploads"];
      callback(pid);
    })
    .catch((err) => {
      console.log(err);
      callback(null);
    });
};

const getRecentVids = async (pid, key, callback) => {
  const maxResults = 1;
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${pid}&key=${key}`;
  axios
    .get(playlistUrl)
    .then((res) => {
      const vid = res.data.items[0]["snippet"]["resourceId"]["videoId"];
      callback(vid);
    })
    .catch((err) => {
      console.log(err);
      callback(null);
    });
};

const getToday = () => {
  return (new Date()).getTime()  
}

export const getChannelPID = async (req, res) => {
  const channel = "1Veritasium";
  await getPlaylistID(channel, YOUTUBE_KEY, (channel_id) => {
    if (channel_id) {
      res.send(channel_id);
    } else {
      res.send("Bad channel name").status(501);
    }
  });
};

export const getVids = async (req, res) => {
  const channel = "1Veritasium";
  await getPlaylistID(channel, YOUTUBE_KEY, (channel_id) => {
    if (channel_id) {
      getRecentVids(channel_id, YOUTUBE_KEY, (vid) => {
        res.send(vid);
      });
    } else {
      res.send("Bad channel ID").status(501);
    }
  });
};

export const signup = async (req, res) => {
  const _username = req.query.username
  const newUser = new UserSchema({
    name: _username,
    subs: []
  })
  await newUser.save((err, data) => {
    if (err) {
      console.log(err)  
      res.status(500).send('Trouble inserting user')
    } else {
      console.log(_username, ' - Signed up!')
      res.status(200).send('Added user')
    }
  })
}

export const login = async (req, res) => {
  const _userName = req.query.username

  UserSchema.findOne({ "name": _userName }, (err, data) => {
    if (err || data === null) {
      res.status(400).send("User not found")  
    } else {
      res.status(200).send(data)
    }
  })
}

export const addChannels = async (req, res) => {
  const _userName = req.body.user
  const channels  = req.body.channelArray

  UserSchema.updateOne(
    { "name": _userName },
    { $push: { subs: channels } },
    (err, result) => {
      if (err) {
        console.log("Failed to add subs: ", err)
        res.status(500).send(err)  
      } else {
        console.log("Added subs: ", channels)
        res.status(200).send(result)  
      }
    }
  )
}

export const postChannel = async (req, res) => {
  const channelName = "1Veritasium";
  const _user = req.body.user;
  const _channelArray = req.body.channelArray;

  const channelToInsert = new ChannelScheme({
    name: _user,
    pid: "oI_X2cMHNe0",
    recentVideos: [],
  });

  await channelToInsert.save((err, data) => {
    if (err) {
      console.log('Error inserting document:', err, data)
      res.status(501).send('Failed to insert document')
    } else {
      console.log('Added document: ', data)
      res.status(200).send('Added document')
    }
  })
};

export const getSubs = async (req, res) => {
  const _userName = req.query.userName

  console.log('Getting subs for: ', _userName)

  UserSchema.findOne({ "name": _userName }, (err, result) => {
    if (err || result === null) {
      console.log('Failed to get subs', result)
      res.status(500).send('Failed to get subs')  
    } else {
      console.log('Got subs!') 
      res.status(200).send(result)
    }
  })
}

