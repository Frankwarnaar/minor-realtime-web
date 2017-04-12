'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const staticAsset = require('static-asset');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const baseDir = 'build/client';

const messages = [];

app.engine('ejs', require('express-ejs-extend'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(cookieParser());
app.use(staticAsset(baseDir));
app.use(express.static(baseDir, {
	maxAge: 31557600000 // one year
}));

app.get('/', (req, res) => {
	let username = null;
	console.log(req.cookie);
	if (req.cookie) {
		if (req.cookie.username) {
			username = req.cookie.username;
		}
	}
	res.render('index', {
		messages,
		username
	});
});

const server = app.listen(port, host, err => {
	err ? console.error(err) : console.log(`app running on http://localhost:${port}`);
});

const io = require('socket.io')(server);

io.on('connection', socket => {
	console.log(`Client ${socket.id} connected`);

	socket.on('message', message => {
		messages.push(message);
		io.sockets.emit('message', message);
	});

	socket.on('disconnect', () => {
		console.log(`${socket.id} disconnected`);
	});
});