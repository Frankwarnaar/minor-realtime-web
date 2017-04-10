'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const staticAsset = require('static-asset');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const baseDir = 'build/client';

app.engine('ejs', require('express-ejs-extend'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(staticAsset(baseDir));
app.use(express.static(baseDir, {
	maxAge: 31557600000 // one year
}));

app.get('/', (req, res) => {
	res.render('index');
});

const server = app.listen(port, host, err => {
	err ? console.error(err) : console.log(`app running on http://localhost:${port}`);
});

const io = require('socket.io')(server);

io.on('connection', socket => {
	console.log(`Client ${socket.id} connected`);

	socket.emit('connection', socket.id);

	socket.on('cookies', message => {
		console.log(message);
	});

	socket.on('disconnect', () => {
		console.log(`${socket.id} disconnected`);
	});
});