class Controller {
	constructor(app) {
		this.app = app;
	}

	init() {
		this.socket();
	}

	socket() {
		this.app.socket = io();
		this.app.socket.on('connection', id => {
			console.log(id);
			this.app.socket.emit('cookies', `${id} has cookies ${navigator.cookieEnabled ? 'enabled' : 'disabled'}`);
		});
	}
}

module.exports = Controller;