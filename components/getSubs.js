import axios from 'axios'

const getSubs = async (user) => {
  await axios.get('/getsubs')
    .then((res) => {
      console.log(res) 
    })
    .catch((err) => {
      console.log('Error getting subs', err) 
    })
}

export default getSubs
