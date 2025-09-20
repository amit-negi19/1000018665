const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const shortUrlsRouter = require('./routes/shorturls');

const app = express();
app.use(bodyParser.json());
app.use(logger);

// Routes
app.use('/shorturls', shortUrlsRouter);

app.listen(3000, () => console.log("Server running on port 3000"));
