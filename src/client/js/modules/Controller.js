class Controller {
	constructor(app) {
		this.app = app;
	}

	init() {
		this.socket();
		this.getNickname();
		this.bindEvents();
	}

	socket() {
		this.app.socket = io();
	}

	getNickname() {
		if (localStorage.getItem('username')) {
			this.app.socket.username = localStorage.getItem('username');
			this.app.view.showEl(this.app.$.usernameForm, false);
			this.app.view.showEl(this.app.$.chatsSection, true);
		}
	}

	bindEvents() {
		this.app.$.usernameForm.addEventListener('submit', this.onNicknameSubmit.bind(this));
		this.app.$.chatForm.addEventListener('submit', this.emitMessage.bind(this));
		this.app.socket.on('message', this.app.view.renderMessage.bind(this));
	}

	onNicknameSubmit(e) {
		e.preventDefault();
		const username = this.app.$.usernameInput.value;
		this.app.socket.username = username;
		localStorage.setItem('username', username);
		this.app.view.showEl(this.app.$.usernameForm, false);
		this.app.view.showEl(this.app.$.chatsSection, true);
	}

	emitMessage(e) {
		console.log('send');
		const socket = this.app.socket;
		const message = {
			sender: socket.username,
			message: this.app.$.chatFormInput.value,
			timestamp: Date.now()
		};
		this.app.socket.emit('message', message);
		this.app.$.chatFormInput.value = '';
		e.preventDefault();
	}
}

module.exports = Controller;