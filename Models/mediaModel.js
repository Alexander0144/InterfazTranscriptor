const mongoose = require("mongoose");
const Segment = require("./segmentSchema");

const mediaSchema = new mongoose.Schema({
	mediaPath: {
		type: String,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	sampleRate: {
		type: Number,
		required: true,
	},
	mediaFrequency: {
		type: String,
		required: true,
	},
	mediaChannels: {
		type: Number,
		required: true,
	},
	codec: {
		type: String,
		required: true,
	},
	segmentos: [Segment],
});

module.exports = mongoose.model("Media", mediaSchema);
