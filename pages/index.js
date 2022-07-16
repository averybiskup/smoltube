import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import LoginBox from '../components/LoginBox'
import Cookies from 'cookies'
import ChannelInput from '../components/ChannelInput'

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


const showSignUp = (show) => {
  const but = document.getElementById("new-user-name-button")  
  if (show) {
    but.style.display = 'block'
  } else {
    but.style.display = 'none'
  }
}

const Home = ({ user }) => {

  const [curUser, setCurUser] = useState(user)

  return (
    <div id="home-container">
      <LoginBox user={curUser} updateUser={setCurUser} />
      <ChannelInput user={curUser} />
    </div>
  )
}

Home.getInitialProps = async ({ req, res }) => {
  return { user: req.cookies.user }
}

export default Home
