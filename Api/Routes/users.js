const express = require('express');
const router = express.Router();
const dbConn  = require('../db');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const admin = require('firebase-admin');
const serviceAccount = require('../nuward-firebase-adminsdk-nzt5b-7970cdfd9a.json');

const jsonParser = bodyParser.json();

const firebaseConfig = {
	apiKey: 'AIzaSyA7N_amVPVYWfm6gpnOzAfRWUU5RIhZCng',
	authDomain: 'nuward.firebaseapp.com',
	databaseURL: 'https://nuward.firebaseio.com',
	projectId: 'nuward',
	storageBucket: 'nuward.appspot.com',
	messagingSenderId: '389013049497',
	appId: '1:389013049497:web:7b69931474f2fa1d88e808',
	measurementId: 'G-6HV7WRER0P'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://nuward.firebaseio.com'
});
// display users
router.get('/', function (req, res, next) {
	dbConn.query('SELECT * FROM users ORDER BY id desc', function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send({ users: { data: rows } });
		}
	});
});

// add a new User
router.post('/add', jsonParser, function (req, res, next) {
	const pseudo = req.body.pseudo;
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const email = req.body.email;
	const password = req.body.password;
	const token = req.body.token;
	const uid = req.body.uid;
	const emailVerified = req.body.emailVerified;
	const googleProvider = req.body.googleProvider;

	if (googleProvider) {
		const formData = {
			pseudo: pseudo,
			firstname: firstname,
			lastname: lastname,
			email: email,
			token: token,
			uid: uid,
			emailVerif: emailVerified ? 1 : 0
		};
		dbConn.query('INSERT INTO users SET ?', formData, function (err, result) {
			if (err) {
				res.send({ error: err });
			} else {
				res.send({ success: 'user successfully added' });
			}
		});
	} else {
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(data => {
				firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
					.then(idToken => {
						const formData = {
							pseudo: pseudo,
							firstname: firstname,
							lastname: lastname,
							email: email,
							token: idToken,
							uid: data.user.uid,
							emailVerif: data.user.emailVerified ? 1 : 0
						};
						dbConn.query('INSERT INTO users SET ?', formData, function (err, result) {
							if (err) {
								res.send({ error: err });
							} else {
								res.send({ success: 'user successfully added' });
							}
						});
					}).catch(error => {
						res.send({ error: `${error} + soucis token` });
					});
			})
			.catch(err => {
				res.send({ error: err });
			});
	}
});

// update user data
router.put('/update/:id', jsonParser, function (req, res, next) {
	const id = req.params.id;
	const pseudo = req.body.pseudo;
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const email = req.body.email;
	const token = req.body.token;
	const emailVerif = req.body.emailVerif;
	const status = req.body.status;
	let errors = false;

	if (pseudo === undefined && firstname === undefined && lastname === undefined && email === undefined && token === undefined && emailVerif === undefined && status === undefined) {
		errors = true;
		res.send({ error: 'Please enter correct datas' });
	}
	if (!errors) {
		const formData = {

		};
		if (pseudo) {
			formData.pseudo = pseudo;
		}
		if (firstname) {
			formData.firstname = firstname;
		}
		if (lastname) {
			formData.lastname = lastname;
		}
		if (email) {
			formData.email = email;
		}
		if (token) {
			formData.token = token;
		}
		if (emailVerif) {
			formData.emailVerif = emailVerif;
		}
		if (status === 1 || status === 0) {
			formData.status = status;
		}
		dbConn.query(`UPDATE users SET ? WHERE id = ${id}`, formData, function (err, result) {
			if (err) {
				res.send({ error: err });
			} else {
				res.send({ success: 'user successfully updated' });
			}
		});
	}
});

// delete user
router.get('/delete/(:id)', function (req, res, next) {
	const id = req.params.id;

	dbConn.query(`SELECT email FROM users WHERE id = ${id}`, function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			admin.auth().getUserByEmail(rows[0].email)
				.then(userRecord => {
					admin.auth().deleteUser(userRecord.toJSON().uid)
						.then(() => {
							dbConn.query(`DELETE FROM users WHERE id = ${id}`, function (err, result) {
								if (err) {
									res.send({ error: err });
								} else {
									res.send({ success: `user successfully deleted! ID = ${id}` });
								}
							});
						})
						.catch(error => {
							res.send({ error: error });
						});
				})
				.catch(error => {
					res.send({ 'Error fetching user data': error });
				});
		}
	});
});

// user by token
router.post('/current', jsonParser, function (req, res, next) {
	const uid = req.body.uid;
	let errors = false;

	if (uid === undefined) {
		errors = true;
		res.send({ error: 'Please enter correct datas' });
	}

	if (!errors) {
		dbConn.query(`SELECT * FROM users WHERE uid = '${uid}'`, function (err, result) {
			if (err) {
				res.send({ error: err });
			} else {
				res.send(result);
			}
		});
	}
});

// user by id
router.get('/get/(:id)', function (req, res, next) {
	const id = req.params.id;

	dbConn.query(`SELECT * FROM users WHERE id = '${id}'`, function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send({ users: rows });
		}
	});
});

// connected
router.get('/connected', jsonParser, function (req, res, next) {
	dbConn.query('SELECT * FROM users WHERE status = \'1\'', function (err, result) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send(result);
		}
	});
});

// reset password
router.post('/password/reset', jsonParser, function (req, res, next) {
	const auth = firebase.auth();
	const emailAddress = req.body.email;

	auth.sendPasswordResetEmail(emailAddress).then(function () {
		res.send({ action: 'mail sent' });
	}).catch(function (error) {
		res.send({error: error})
	});
});

module.exports = router;
