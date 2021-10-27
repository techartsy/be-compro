const express = require('express');
const cors = require('cors');
// const nodemailer = require('nodemailer');

const app = express();
const router = require('./src/routes');
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/app/v1/techartsy', router);
app.use('/uploads', express.static('uploads'));

app.listen(port, () => console.log(`Server Starts on ${port}!`));
