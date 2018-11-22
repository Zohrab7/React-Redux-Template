const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require("dotenv").config();

const app = express();

const db = mongoose.connection;
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/'+process.env.DB_NAME);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser({}));

app.use(express.static(path.join(__dirname, 'client-build')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', require('./routes/users'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client-build', 'index.html'));
});

db.on('error', () =>{
	console.log('Error ');
});
db.once('open', () => {
	app.listen(process.env.PORT, () => {
		console.log('Example app listening on port ',process.env.PORT);
	});
});

module.exports = app
