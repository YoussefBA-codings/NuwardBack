const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const config = require('./config');

const mysqlWatch = async () => 	new Promise(
	async (resolve, reject) => {
		const connection = mysql.createConnection({
			host: config.host,
			user: config.user,
			password: config.password
		});

		const instance = new MySQLEvents(connection, {
			startAtEnd: true
		});

		await instance.start();

		instance.addTrigger({
			name: 'monitoring',
			expression: 'Nuward.users',
			statement: MySQLEvents.STATEMENTS.ALL,
			onEvent: (event) => { // You will receive the events here
				resolve(event.affectedRows);
			}
		});

		instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
		instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
	}
);

module.exports = mysqlWatch;
