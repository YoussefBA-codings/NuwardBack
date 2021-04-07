const express = require('express');
const router = express.Router();
const dbConn  = require('../db');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

// display drawings
router.get('/', function (req, res, next) {
	dbConn.query('SELECT * FROM drawings ORDER BY id desc', function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send({ drawings: { data: rows } });
		}
	});
});

// add a new Drawing
router.post('/add', jsonParser, function (req, res, next) {
	const idProjectUser = req.body.idProjectUser;
	const feature = req.body.feature;

	const formData = {
		id_projectuser: idProjectUser,
		feature: JSON.stringify(feature)
	};

	dbConn.query('INSERT INTO drawings SET ?', formData, function (err, result) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send({ success: 'drawings successfully added' });
		}
	});
});

// update drawings data
router.put('/update/:id', jsonParser, function (req, res, next) {
	const id = req.params.id;
	const idProjectUser = req.body.idProjectUser;
	const feature = req.body.feature;
	let errors = false;

	if (idProjectUser === undefined && feature === undefined) {
		errors = true;
		res.send({ error: 'Please enter correct datas' });
	}
	if (!errors) {
		const formData = {

		};
		if (idProjectUser) {
			formData.id_projectuser = idProjectUser;
		}
		if (feature) {
			formData.feature = JSON.stringify(feature);
		}
		dbConn.query(`UPDATE drawings SET ? WHERE id = ${id}`, formData, function (err, result) {
			if (err) {
				res.send({ error: err });
			} else {
				res.send({ success: 'drawings successfully updated' });
			}
		});
	}
});

// delete drawings
router.get('/delete/(:id)', function (req, res, next) {
	const id = req.params.id;

	dbConn.query(`DELETE FROM drawings WHERE id = ${id}`, function (err, result) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send({ success: `drawings successfully deleted! ID = ${id}` });
		}
	});
});

module.exports = router;
