const mongoose = require("mongoose");
const Segment = require("./segmentSchema");

const mediaSchema = new mongoose.Schema({
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
		type: String,
		required: true,
	},
	segmentos: [Segment],
});

module.exports = mongoose.model("Media", mediaSchema);
