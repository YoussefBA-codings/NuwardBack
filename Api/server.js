const express = require('express');
const app = express();
const usersRouter = require('./Routes/users');
const projectsRouter = require('./Routes/project');
const drawingsRouter = require('./Routes/drawing');
const specialRouter = require('./Routes/special');
const mysqlWatch = require('./mysqlWatch');

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
});
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/drawings', drawingsRouter);
app.use('/special', specialRouter);

const server = app.listen(8081, () => {
	console.log('server running');
});

const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	}
});

mysqlWatch().then(res => {
	io.on('connection', function (socket) {
		console.log('il se lance');
		io.emit('MESSAGE', res);
	});
}).catch(err => {
	console.log(err);
});
