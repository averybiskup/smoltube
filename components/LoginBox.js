import React, { useState, useEffect } from 'react'
import cc from 'cookie-cutter'
import axios from 'axios'

const setUserCookie = (user) => {
  console.log("Setting cookie: " + "user=" + user) 
  cc.set("user", user)
}



const LoginBox = (props) => {

  const [user, setUser] = useState('')
  const [userType, setUserType] = useState('')

  const login = async (user) => {
    await axios.get('/login?username=' + user)
      .then((res) => {
        setUserCookie(user)
        console.log('Set user from: ', user)
        setUser(user)
        props.updateUser(user)
        console.log('Set user to:', user)
        console.log(props)
        //setChannels(user.data.subs)
      })
      .catch((err) => {
        console.log('Error logging in:', err)
      })
  }

  const logout = (user) => {
    cc.set("user", user, { expires: new Date(0) })
    setUser(undefined)
    props.updateUser(undefined)
    console.log(props)
  }

  console.log(props)

  if (props.user !== undefined) {
    return (
      <>
        <div className="user-name-input-container">
          <button onClick={() => { logout(user) }}
                  id="logout-button">hello, {props.user}</button>
        </div>
      </>
    )
  } else {
    return (
      <div className="user-name-input-container">
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
