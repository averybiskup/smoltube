const getPlaylistID = async (channel, key, callback) => {

    const getURL = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${channel}&key=${key}`;

    fetch(getURL).then((res) => res.json())
        .then((res) => {
            const pid = res.items[0]["contentDetails"]["relatedPlaylists"]["uploads"];
            callback(pid);
        })
        .catch((err) => {
            console.log(err);
            callback(null);
        });
};

const getChannelPID = async (req, res) => {

    const channel = "1Veritasium";

    await getPlaylistID(channel, process.env.YOUTUBE_KEY, (channel_id) => {
        if (channel_id) {
            res.send(channel_id);
        } else {
            res.status(501).send("Bad channel name")
        }
    });
};

export default getChannelPID
