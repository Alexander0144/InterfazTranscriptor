// se importa la libreria del cliente de transcripcion de Google
const speech = require("@google-cloud/speech");

/***
 * Funcion que transcribe un archivo almacenado en Google Cloud
 * recibe el nombre de un archivo almacenado en un bucket de google cloud
 * retorna un json con la transcripcion y los timestamps de esta
 * @param {string} filename nombre de un archivo almacenado en Google Cloud
 * @return {object} objeto con el texto de la transcripcion y los timestamps
 */
module.exports.transcribe = async function transcribe(filename) {
	const client = new speech.SpeechClient();

	let timestamps = [];
	let transctipt = "";
	const gcsUri = "gs://bucket-audio-test/" + filename;
	const encoding = "LINEAR16";
	const sampleRateHertz = 16000;
	const languageCode = "es-MX";

	const config = {
		enableWordTimeOffsets: true,
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
	const ret2 = response.results.forEach((result) => {
		transcript = result.alternatives[0].transcript;
		result.alternatives[0].words.forEach((wordInfo) => {
			// NOTE: If you have a time offset exceeding 2^32 seconds, use the
			// wordInfo.{x}Time.seconds.high to calculate seconds.
			const startSecs =
				`${wordInfo.startTime.seconds}` +
				"." +
				wordInfo.startTime.nanos / 100000000;
			const endSecs =
				`${wordInfo.endTime.seconds}` +
				"." +
				wordInfo.endTime.nanos / 100000000;
			timestamps[timestamps.length] = {
				word: wordInfo.word,
				time: {
					start: startSecs,
					end: endSecs,
				},
			};
		});
	});
	return { transcript: transcript, timestamps: timestamps };
};
