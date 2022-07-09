import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'

// Add a channel to user's profile
const postChannels = async (user, channels) => {

  const params = {
    user: user,
    channelArray: channels
  }
  
  let res = await axios.post('/postchannels', params)
}


const setUserCookie = (user) => {
  const cookie = "user=" + user
  console.log("Setting cookie: " + cookie) 
  document.cookie = cookie
}

const getUserCookie = () => {
  const user = document.cookie.split("=")[1]
  if (user) {
    return user
  } else {
    return null  
  }
}

const signup = async (user) => {
  await axios.post('/signup?username=' + user)
    .then(() => {
      console.log("User signed up")
      setUserCookie(user)
    })
    .catch((err) => {
      console.log('Error signing up')
    })
}

const login = async (user) => {
  await axios.get('/login?username=' + user)
    .then((res) => {
      setUserCookie(user)
    })
    .catch((err) => {
      console.log('Error logging in')
    })
}

const showSignUp = (show) => {
  const but = document.getElementById("new-user-name-button")  
  if (show) {
    but.style.display = 'block'
  } else {
    but.style.display = 'none'
  }
}

const Home = () => {

  const [newChannel, setNewChannel] = useState('')
  const [channels, setChannels] = useState([])
  const [user, setUser] = useState('')
  const [userType, setUserType] = useState('')

  // State modification helper function
  const addChannel = (name) => {
    if (channels.indexOf(name) == -1) {
      setChannels(channels => [...channels, name])  
    }
  }

  // State modification helper function
  const saveChannels = (channelsToAdd) => {
    postChannels('testuser', channelsToAdd)
    for (let i = 0; i < channelsToAdd.length; i++) {
      setChannels([])
    }
  }

  return (
    <div id="home-container">
      <div id="user-name-input-container">
        <input onChange={(e) => { setUser(e.target.value) }}
               type="text"  
               placeholder="user name" 
               id="user-name-input"
               value={user} />
        <button id="user-name-button" 
                onClick={() => { signup(user) }}
                >sign up</button>
        <button id="new-user-name-button" 
                onClick={() => { login(user) }}
                >sign in</button>
      </div>
      <div id="home-input-container">
        <input onChange={(e) => { setNewChannel(e.target.value) }} 
               id="home-input" 
               type="text" 
               placeholder="channel name"
               value={newChannel} />
        <button id="home-add-button" 
                onClick={() => { addChannel(newChannel) }}>add</button>
        <button id="home-save-button" 
                onClick={() => { saveChannels(channels) }}>save</button>
      </div>
      <div id="new-channels-container">
        <div id="new-channels-list">
          {
            channels.map((channel, i) => 
              <div className="new-channel-item" 
                   key={i} 
                   id={"new-channel-" + i}>{channel}</div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Home
