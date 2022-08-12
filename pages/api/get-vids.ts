const getPlaylistID = async (channel, key, callback) => {

    const getURL = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${channel}&key=${key}`

    fetch(getURL).then((res) => res.json())
        .then((res) => {
            const pid = res.items[0]["contentDetails"]["relatedPlaylists"]["uploads"]
            callback(pid)
        })
        .catch((err) => {
            console.log(err)
            callback(null)
        })
}

const getRecentVids = async (pid, key, callback) => {
    const maxResults = 1
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${pid}&key=${key}`

    fetch(playlistUrl).then((res) => res.json())
        .then((res) => {
          const vid = res.items[0]["snippet"]["resourceId"]["videoId"]
          callback(vid)
        })
        .catch((err) => {
          console.log(err)
          callback(null)
        })
}

export const getVids = async (req, res) => {
    const channel = "1Veritasium"
    await getPlaylistID(channel, process.env.YOUTUBE_KEY, (channel_id) => {
        if (channel_id) {
            getRecentVids(channel_id, process.env.YOUTUBE_KEY, (vid) => {
                res.send(vid)
            })
        } else {
            res.send("Bad channel ID").status(501)
        }
    })
}

export default getVids
