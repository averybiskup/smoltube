import { useState, useEffect } from 'react'
import axios from 'axios'

const SubList = (props) => {

  const [subs, setSubs] = useState([])

  useEffect(() => {
    console.log('Getting subs for: ', props.user)
    axios.get('/getsubs', { params: { userName: props.user }})
      .then((res) => {
        setSubs(res.data.subs) 
      })
      .catch((err) => {
        console.log('Problem getting subs') 
      })
  }, [])
  

  if (subs !== undefined) {
    return (
      <div> 
        {
          subs.map((channel) => 
            <div>{channel}</div>  
          )
        }
      </div>
    )
  } else {
    return (
      <div>Loading subs...</div>  
    )
  }
}

export default SubList
