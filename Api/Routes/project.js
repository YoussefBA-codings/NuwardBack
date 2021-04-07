/* eslint-disable camelcase */
const express = require('express');
const router = express.Router();
const dbConn  = require('../db');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

// display projects
router.get('/', function (req, res, next) {
	dbConn.query('SELECT * FROM projects ORDER BY id desc', function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send(rows);
		}
	});
});

// add a new Project
router.post('/add', jsonParser, function (req, res, next) {
	const name = req.body.name;
	const length = req.body.length;
	const width = req.body.width;
	const graduation_unit = req.body.graduation_unit;
	if (name === undefined || length === undefined || width === undefined) {
		res.send({ error: 'verify you insert all datas' });
	}
	const formData = {
		name: name,
		length: length,
		width: width,
		graduation_unit: graduation_unit
	};

	dbConn.query('INSERT INTO projects SET ?', formData, function (err, result) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send({ success: 'project successfully added' });
		}
	});
});

// update project data
router.put('/update/:id', jsonParser, function (req, res, next) {
	const id = req.params.id;
	const name = req.body.name;
	const length = req.body.length;
	const width = req.body.width;
	const graduation_unit = req.body.graduation_unit;
	const box_taken = req.body.box_taken;
	let errors = false;

	if (name === undefined && length === undefined && width === undefined && box_taken === undefined && graduation_unit === undefined) {
		errors = true;
		res.send({ error: 'Please enter correct datas' });
	}
	if (!errors) {
		const formData = {

		};
		if (name) {
			formData.name = name;
		}
		if (length) {
			formData.length = length;
		}
		if (width) {
			formData.width = width;
		}
		if (graduation_unit) {
			formData.graduation_unit = graduation_unit;
		}
		if (box_taken) {
			formData.box_taken = JSON.stringify(box_taken);
		}

		dbConn.query(`UPDATE projects SET ? WHERE id = ${id}`, formData, function (err, result) {
			if (err) {
				res.send({ error: err });
			} else {
				res.send({ success: 'project successfully updated' });
			}
		});
	}
});

// delete project
router.get('/delete/(:id)', function (req, res, next) {
	const id = req.params.id;

	dbConn.query(`DELETE FROM projects WHERE id = ${id}`, function (err, result) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send({ success: `project successfully deleted! ID = ${id}` });
		}
	});
});

// get project by import {  } from '// display projects
router.get('/(:id)', function (req, res, next) {
	const id = req.params.id;
	dbConn.query(`SELECT * FROM projects where id = ${id}`, function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send({ projects: { data: rows } });
		}
	});
});

module.exports = router;
