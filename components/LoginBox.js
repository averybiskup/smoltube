import React, { useState, useEffect } from 'react'
import cc from 'cookie-cutter'

const setUserCookie = (user) => {
  console.log("Setting cookie: " + "user=" + user) 
  cc.set("user", user)
}

const login = async (user) => {
  await axios.get('/login?username=' + user)
    .then((res) => {
      setUserCookie(user)
      setChannels(user.data.subs)
    })
    .catch((err) => {
      console.log('Error logging in')
    })
}

const LoginBox = (props) => {

  const [user, setUser] = useState('')
  const [userType, setUserType] = useState('')

  if (props.user) {
    return (
      <div id="user-name-input-container">Hello, {props.user}</div>
    )
  } else {
    return (
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
    )
  }
}

export default LoginBox
