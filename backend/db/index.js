const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Database Connection Successful..!!'))
.catch((error) => console.log('Database Connection Failed: ', error));