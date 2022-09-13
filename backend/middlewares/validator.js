const { check, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const genres = require('../utils/genres');

exports.userValidator = [
    check("name").trim().not().isEmpty().withMessage('Name is Missing'),
    check("email").normalizeEmail().isEmail().withMessage('Email is Invalid'),
    check("password").trim().not().isEmpty().withMessage('Password is Missing')
        .isLength({ min: 8, max: 20 }).withMessage('Password must be 8 to 20 characters long'),
];

exports.signInValidator = [
    check("email").normalizeEmail().isEmail().withMessage('Email is Invalid'),
    check("password").trim().not().isEmpty().withMessage('Password is Missing')
]

exports.validatePassword = [
    check("newPassword")
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is Missing')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be 8 to 20 characters long')
];

exports.actorInfoValidator = [
    check("name").trim().not().isEmpty().withMessage('Name is Missing'),
    check("about").trim().not().isEmpty().withMessage('About is Required'),
    check("gender").trim().not().isEmpty().withMessage('Gender is Required'),
];

exports.validateMovie = [
    check('title').trim().not().isEmpty().withMessage('Movie Title is Missing'),
    check('storyLine').trim().not().isEmpty().withMessage('Storyline is Missing'),
    check('releaseDate').isDate().withMessage('Release Date is Missing'),
    check('language').trim().not().isEmpty().withMessage('Language is Missing'),
    check('status').isIn(["public", "private"]).withMessage('Movie Status must be public or private'),
    check('type').trim().not().isEmpty().withMessage('Movie Type is Missing'),
    check('genres').isArray().withMessage('Genres Must be Array of Strings')
        .custom((value) => {
            for (let g of value) {
                if (!genres.includes(g)) {
                    throw Error('Invalid Genres Added');
                }
            }
            return true;
        }),
    check('tags').isArray({ min: 1 }).withMessage('Tags Must be Array of Strings')
        .custom((tags) => {
            for (let tag of tags) {
                if (typeof tag !== 'string') {
                    throw Error('Tags Must be Array of Strings');
                }
            }
            return true;
        }),
    check('cast').isArray().withMessage('Cast Must be Array of Objects')
        .custom((cast) => {
            for (let c of cast) {
                if (!isValidObjectId(c.actor)) {
                    throw Error('Invalid ID provided for Cast Member');
                }
                if (!c.roleAs?.trim()) {
                    throw Error('Role As is Missing for Cast Member');
                }
                if (typeof c.leadActor !== 'boolean') {
                    throw Error('Lead Actor must be a Boolean Value');
                }
            }
            return true;
        }),

    // check("poster").custom((_, { req }) => {
    //     if (!req.file) throw Error("Poster file is missing!");
    //     return true;
    // }),
]

exports.validateTrailer = check("trailer")
    .isObject()
    .withMessage("Trailer must be an object with URL and public_id")
    .custom(({ url, public_id }) => {
        try {
            const result = new URL(url);
            if (!result.protocol.includes("http"))
                throw Error("Trailer URL is invalid!");

            const arr = url.split("/");
            const publicId = arr[arr.length - 1].split(".")[0];

            if (public_id !== publicId) throw Error("Trailer public_id is invalid!");
            return true;

        } catch (error) {
            throw Error("Trailer URL is invalid!");
        }
    });

exports.validateRatings = check(
    "rating",
    "Rating must be a number between 0 and 10."
).isFloat({ min: 0, max: 10 });

exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        return res.json({ error: error[0].msg })
    }
    next();
}