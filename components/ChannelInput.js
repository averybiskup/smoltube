import React, { useState } from 'react'

// Add a channel to user's profile
const postChannels = async (user, channels) => {

  const params = {
    user: user,
    channelArray: channels
  }
  
  let res = await axios.post('/postchannels', params)
}

const ChannelInput = (props) => {
  const user = props.user

  const [newChannel, setNewChannel] = useState('')
  const [channels, setChannels] = useState([])

  return (
    <>
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
    </>
  )
}

export default ChannelInput
