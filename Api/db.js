const mysql = require('mysql');
const config = require('./config');
console.log();
const infos = {
	host: config.host,
	user: config.user,
	password: config.password,
	port: config.port,
	database: config.database
};
const connection = mysql.createConnection(infos);

connection.connect(function (error) {
	if (error) {
		console.error(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;
