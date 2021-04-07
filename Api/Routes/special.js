/* eslint-disable camelcase */
const express = require('express');
const router = express.Router();
const dbConn  = require('../db');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const algo = require('../../algo');

// get users by project
router.get('/users/project/(:id)', jsonParser, function (req, res, next) {
	const idProject = req.params.id;
	dbConn.query(`SELECT id_users FROM projet_users where id_project = ${idProject} ORDER BY id desc`, function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			res.send(rows[0]);
		}
	});
});
// add user in project
router.post('/add/user/project/(:id)', jsonParser, function (req, res, next) {
	const idProject = req.params.id;
	const idUser = req.body.idUser;
	if (idProject === undefined || idUser === undefined) {
		res.send({ error: 'Please enter correct datas' });
	} else {
		dbConn.query(`SELECT * FROM projet_users WHERE id_project=${idProject}`, function (err, result) {
			if (err) {
				res.send({ error: err });
			} else {
				if (result.length === 0) {
					const formData = {
						id_project: idProject,
						id_users: `[\r\n    ${idUser}\r\n]`
					};
					dbConn.query('INSERT INTO projet_users SET ?', formData, function (err, result) {
						if (err) {
							res.send({ error: err });
						} else {
							res.send({ success: 'user successfully added' });
						}
					});
				} else {
					const query = `update projet_users set id_users = JSON_ARRAY_INSERT(id_users, '$[0]' ,${idUser}) where id_project = ${idProject}`;
					dbConn.query(query, function (err, result) {
						if (err) {
							res.send({ error: err });
						} else {
							res.send({ success: 'user successfully added' });
						}
					});
				}
			}
		});
	}
});

// get projects by user
router.get('/projects/user/(:id)', function (req, res, next) {
	const idUser = req.params.id;
	dbConn.query('SELECT * FROM projet_users ORDER BY id desc', function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			const projects = [];
			rows.forEach(row => {
				const users = JSON.stringify(JSON.parse(JSON.stringify(row)).id_users).match(/\d+/gm);
				for (let i = 0; i < users.length; i++) {
					if (users[i] === idUser && projects.includes(idUser) === false) {
						projects.push(JSON.parse(JSON.stringify(row)).id_project);
					}
				}
			});
			res.send({ projects: projects });
		}
	});
});

// get drawing by user and project
router.get('/drawings/projet/(:id1)/user/(:id2)', function (req, res, next) {
	dbConn.query('SELECT * FROM projet_users ORDER BY id desc', function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			const idProject = req.params.id1;
			const idUser = req.params.id2;
			rows.forEach(row => {
				if (Number(idProject) === Number(JSON.parse(JSON.stringify(row)).id_project) &&
				JSON.parse(JSON.stringify(row)).id_users.match(/\d+/gm).includes(`${idUser}`)
				) {
					const idProjectUser = JSON.parse(JSON.stringify(row)).id;
					dbConn.query(`SELECT * FROM drawings where id_projectuser = ${idProjectUser} ORDER BY id desc`, function (err, rows) {
						if (err) {
							res.send({ error: err });
						} else {
							res.send({ data: rows });
						}
					});
				}
			});
		}
	});
});

// find place for user in project and update project
router.post('/add/user/(:id1)/project/(:id2)', jsonParser, function (req, res, next) {
	const idUser = req.params.id1;
	const idProject = req.params.id2;
	const newBoxLength = req.body.newBoxLength;

	if (newBoxLength === undefined) {
		res.send({ error: 'insert newBoxLength parameter' });
	}
	dbConn.query(`SELECT * FROM projects where id = ${idProject} ORDER BY id desc`, function (err, rows) {
		if (err) {
			res.send({ error: err });
		} else {
			const length = JSON.parse(JSON.stringify(rows[0])).length;
			const width = JSON.parse(JSON.stringify(rows[0])).width;
			const graduation_unit = JSON.parse(JSON.stringify(rows[0])).graduation_unit;
			const box_taken = JSON.parse(JSON.stringify(rows[0])).box_taken;
			algo(box_taken, graduation_unit, length, width, newBoxLength, idUser).then(result => {
				const formData = {
					box_taken: JSON.stringify(result)
				};
				dbConn.query(`UPDATE projects SET ? WHERE id = ${idProject}`, formData, function (err, res1) {
					if (err) {
						res.send({ error: err });
					} else {
						res.send(result);
					}
				});
			}).catch(err => {
				res.send(err);
			});
		}
	});
});
module.exports = router;
