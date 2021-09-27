const Album = require("../models/albumModel")

exports.getAllAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find()

        res.status(200).json({
            status: "succes",
            results: albums.length,
            data: {
                albums
            }
        })

    } catch (e) {
        console.debug(e)
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.getOneAlbum = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.id)

        res.status(200).json({
            status: "succes",
            data: {
                album
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.updateAlbum = async (req, res, next) => {
    try {
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "succes",
            data: {
                album
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}