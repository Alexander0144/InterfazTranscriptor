const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
	__id: {
		type: Number,
		required: true,
	},
	mediaPath: {
		type: String,
		required: true,
	},
	mediaSize: {
		type: Number,
		required: true,
	},
	sampleRate: {
		type: Number,
		required: true,
	},
	mediaFrequency: {
		type: Number,
		required: true,
	},
	mediaChannels: {
		type: Number,
		required: true,
	},
	sampleType: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("Media", mediaSchema);
