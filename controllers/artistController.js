const Artist = require("../models/artistModel")

exports.getAllArtists = async (req, res, next) => {
    try {
        const artists = await Artist.find()

        res.status(200).json({
            status: "succes",
            results: songs.length,
            data: {
                artists
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.getOneArtist = async (req, res, next) => {
    try {
        const artist = await Artist.findById(req.params.id)

        res.status(200).json({
            status: "succes",
            data: {
                artist
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.updateArtist = async (req, res, next) => {
    try {
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "succes",
            data: {
                artist
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}