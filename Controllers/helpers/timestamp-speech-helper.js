// se importa la libreria del cliente de transcripcion de Google
const speech = require("@google-cloud/speech");

/***
 * Funcion que transcribe un archivo almacenado en Google Clouds
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

	//Objetos con opciones de configuracion de la API

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

	// En esta seccion se detecta el habla en el archivo de audio subido
	// La variable espera una respuesta de la operacion asincrona
	const [operation] = await client.longRunningRecognize(request);
	// Se obtiene una promesa de javascript que representa el resultado final
	const [response] = await operation.promise();
	const transcription = response.results
		.map((result) => result.alternatives[0].transcript)
		.join("\n");
	const ret2 = response.results.forEach((result) => {
		transcript = result.alternatives[0].transcript;
		result.alternatives[0].words.forEach((wordInfo) => {
			// Por cada palabra de la transcripcion se calculan
			//Los tiempos de inicio y fin
			const startSecs =
				`${wordInfo.startTime.seconds}` +
				"." +
				wordInfo.startTime.nanos / 100000000;
			const endSecs =
				`${wordInfo.endTime.seconds}` +
				"." +
				wordInfo.endTime.nanos / 100000000;
			//Cada palabra con sus respectivos tiempos se almacena dentro del arreclo timestamps
			timestamps[timestamps.length] = {
				word: wordInfo.word,
				time: {
					start: startSecs,
					end: endSecs,
				},
			};
		});
	});
	return { transcript: transcript, timestamps: timestamps }; //Se retorna la transcripcion con timestamps
};
