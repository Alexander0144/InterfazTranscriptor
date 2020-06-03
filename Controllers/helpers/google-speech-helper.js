// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");

// Creates a client
module.exports.transcribe = async function transcribe(filename) {
	const client = new speech.SpeechClient();

	/**
	 * TODO(developer): Uncomment the following lines before running the sample.
	 */
	const gcsUri = "gs://bucket-audio-test/" + filename;
	const encoding = "LINEAR16";
	const sampleRateHertz = 16000;
	const languageCode = "es-MX";

	const config = {
		encoding: encoding,
		sampleRateHertz: sampleRateHertz,
		languageCode: languageCode,
	};

	const audio = {
		uri: gcsUri,
	};

	const request = {
		config: config,
		audio: audio,
	};

	// Detects speech in the audio file. This creates a recognition job that you
	// can wait for now, or get its result later.
	const [operation] = await client.longRunningRecognize(request);
	// Get a Promise representation of the final result of the job
	const [response] = await operation.promise();
	const transcription = response.results
		.map((result) => result.alternatives[0].transcript)
		.join("\n");
	return `Transcription: ${transcription}`;
};
