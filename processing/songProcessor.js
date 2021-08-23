const mp3tag = require("mp3tag")
const mp3Duration = require("mp3-duration")

const extractFrame = (tagData, frameName) => {

    var buffer = tagData.getFrame(frameName)

    if (buffer)
        return tagData.decoder.decodeString(buffer.data.source).replace("\x00", "")
    return ""
}

const getSongTags = async (songPath) => {
    tagData = await mp3tag.readHeader(songPath)

    const song = {
        title: extractFrame(tagData, "TIT2"),
        n: extractFrame(tagData, "TRCK").split("/")[0],
        artist: extractFrame(tagData, "TPE1"),
        album: extractFrame(tagData, "TALB"),
        year: extractFrame(tagData, "TORY")
    }


    return song
}

module.exports.getSong = async (songPath) => {
    var song = await getSongTags(songPath)

    await mp3Duration(songPath, (err, duration) => {
        if (err)
            console.log(err)
        else
            song.duration = duration
    })
    song.like = 0
    song.path = songPath

    return song
}