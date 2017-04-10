class App {
	constructor() {
		const Controller = require('./Controller.js');
		this.controller = new Controller(this);
	}

	init() {
		this.controller.init();
	}
}

module.exports = App;