const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DATABASE_URL, //change host to '127.0.0.1' if you ant to run on local machine so that it points to the local database
		ssl: true
	}
});

db.select('*').from('users').then(data => {
	console.log(data);
});


// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'John',
// 			email: 'john@gmail.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '124',
// 			name: 'Sally',
// 			email: 'sally@gmail.com',
// 			password: 'bananas',
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	]
// }


app.get('/', (req, res) => {
	res.send('it is working');
	// res.send(database.users);
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});//Dependency injection - We are injecting all the dependencies that handle Signin needs

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});//Dependency injection - We are injecting all the dependencies that handle Register needs

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});
// / --> res = this is working
// /signin --> POST = success/fail
// /register --> POST = user 
// /profile/:userid --> GET = user
// /image --> PUT --> user

// // Load hash from your password DB.
// bcrypt.compare('bacon', hash, function(err, res) {
// 	// res == true
// });
// bcrypt.compare('veggies', hash, function(err, res) {
// 	// res = false
// });


// Port for running on local machine
// app.listen(3010, () => {
// 	console.log("app is running on port 3010");
// });

// Port for deploying on Heroku
app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port 3000 ${process.env.PORT}`);
})