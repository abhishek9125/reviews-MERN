const Actor = require('../models/actor');
const { isValidObjectId } = require('mongoose');
const { sendError, uploadImageToCloud, formatActor } = require('../utils/helper');
const cloudinary = require('../cloud');

exports.createActor = async (req, res) => {

    const { name, about, gender } = req.body;
    const { file } = req;

    const newActor = new Actor({ name, about, gender });

    if(file) {
        const { url, public_id } = await uploadImageToCloud(file.path);
        newActor.avatar = { url, public_id };
    }

    await newActor.save();
    return res.status(201).json({ actor: formatActor(newActor) });
}

exports.updateActor = async (req, res) => {

    const { name, about, gender } = req.body;
    const { file } = req;
    const { actorId } = req.params;

    if(!isValidObjectId(actorId)) {
        return sendError(res, 'Invalid Actor ID');
    }

    const actor = await Actor.findById(actorId);

    if(!actor) {
        return sendError(res, 'Actor Data not Found..!!');
    }

    const public_id = actor.avatar?.public_id;

    if(public_id && file) {
        const { result } = await cloudinary.uploader.destroy(public_id);

        if(result !== 'ok') {
            return sendError(res, 'Error Deleting the Old Avatar');
        }
    }

    if(file) {
        const { url, public_id } = await uploadImageToCloud(file.path);
        newActor.avatar = { url, public_id };
    }

    actor.name = name;
    actor.about = about;
    actor.gender = gender;

    await actor.save();

    return res.status(201).json({ actor: formatActor(actor) });
}

exports.removeActor = async (req, res) => {

    const { actorId } = req.params;

    if(!isValidObjectId(actorId)) {
        return sendError(res, 'Invalid Actor ID');
    }

    const actor = await Actor.findById(actorId);

    if(!actor) {
        return sendError(res, 'Actor Data not Found..!!');
    }

    const public_id = actor.avatar?.public_id;

    if(public_id) {
        const { result } = await cloudinary.uploader.destroy(public_id);

        if(result !== 'ok') {
            return sendError(res, 'Error Deleting the Old Avatar');
        }
    }

    await Actor.findByIdAndDelete(actorId);

    return res.json({ message: 'Actor Data Removed Successfully..!!' });
}

exports.searchActor = async (req, res) => {
    const { query } = req;
    const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
    const actors = result.map((actor) => formatActor(actor));
    return res.status(201).json({ results: actors });
}

exports.getLatestActors = async (req, res) => {
    const result = await Actor.find().sort({ createdAt: '-1' }).limit(12);
    const actors = result.map((actor) => formatActor(actor));
    return res.json(actors);
}

exports.getSingleActor = async (req, res) => {

    const { id } = req.params;

    if(!isValidObjectId(id)) {
        return sendError(res, 'Invalid Actor ID');
    }

    const actor = await Actor.findById(id);

    if(!actor) {
        return sendError(res, 'Actor Data not Found..!!', 404);
    }

    return res.status(201).json({ actor: formatActor(actor) });
}

exports.getActors = async (req, res) => {

    const { pageNo, limit } = req.params;

    const actors = await Actor.find({})
    .sort({ createdAt: -1 }) // Sort from Latest Created to Oldest
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))

    const profiles = actors.map((actor) => formatActor(actor));

    return res.status(201).json({ profiles });
}