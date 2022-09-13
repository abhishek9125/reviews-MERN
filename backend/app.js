const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./middlewares/error');

require('express-async-errors');
require('dotenv').config();
require('./db');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const userRouter = require('./routes/user');
const actorRouter = require('./routes/actor');
const movieRouter = require('./routes/movie');
const reviewRouter = require('./routes/review');
const { handleNotFound } = require('./utils/helper');
app.use('/api/user',userRouter);
app.use('/api/actor',actorRouter);
app.use('/api/movie',movieRouter);
app.use('/api/review',reviewRouter);
app.use("/*", handleNotFound);
app.use(errorHandler);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is Up and Running on Port ${PORT}`)
});