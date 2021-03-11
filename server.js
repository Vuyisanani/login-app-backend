require('./config/db');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const UserRouter = require('./api/User')

const cors = require('cors');

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.use('/user', UserRouter);

app.listen(PORT, () => {
    console.log(`Server runnig on port ${PORT} `);
})
