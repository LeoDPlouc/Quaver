const Song = require("../models/songModel")

exports.getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find()

        res.status(200).json({
            status: "succes",
            results: songs.length,
            data: {
                songs
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.getOneSong = async (req, res, next) => {
    try {
        const song = await Song.findById(req.params.id)

        res.status(200).json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.createSong = async (req, res, next) => {
    try {
        const song = await Song.create(req.body)

        res.status(200).json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.updateSong = async (req, res, next) => {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.deleteSong = async (req, res, next) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}