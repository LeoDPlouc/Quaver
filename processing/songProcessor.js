const mm = require("music-metadata")

module.exports.getSong = async (songPath) => {
    var tag = await mm.parseFile(songPath)

    const song = {
        title: tag.common.title,
        n: tag.common.track.no,
        artist: tag.common.albumartist,
        album: tag.common.album,
        year: tag.common.year,
        duration: tag.format.duration,
        like: 0,
        path: songPath
    }

    return song
}