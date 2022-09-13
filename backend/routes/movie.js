const express = require("express");
const { uploadTrailer, createMovie, updateMovie, removeMovie, getMovies, getMovieForUpdate } = require("../controllers/movie");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const { validateMovie, validate, validateTrailer } = require("../middlewares/validator");
const { parseData } = require("../utils/helper");

const router = express.Router();

router.post("/upload-trailer", isAuth, isAdmin, uploadVideo.single("video"), uploadTrailer);
router.post("/create", isAuth, isAdmin, uploadImage.single("poster"), parseData, validateMovie, validateTrailer, validate, createMovie);
router.patch("/update/:movieId", isAuth, isAdmin, uploadImage.single("poster"), parseData, validateMovie, validate, updateMovie);
router.delete("/:movieId", isAuth, isAdmin, removeMovie);
router.get("/movies", isAuth, isAdmin, getMovies);
router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);

module.exports = router;
