const mongoose = require("mongoose");

const Segment = new mongoose.Schema({
	numero: {
		type: String,
		required: true,
	},
	texto: {
		type: String,
		required: true,
	},
	timeStamp: {
		type: String,
		required: true,
	},
});

module.exports = Segment;
