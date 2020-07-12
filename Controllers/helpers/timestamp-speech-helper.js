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
	let transcripcion = "";
	const gcsUri = "gs://bucket-audio-test/" + filename; //ubicacion el archivo en google cloud
	const encoding = "LINEAR16"; //Codificacion lineal de pulsos de 16 bits (para archivos de formato WAV)
	const sampleRateHertz = 16000; //Frecuencia de muestreo del archivo de audio (Hz)
	const languageCode = "es-MX"; //Idioma del aduio (Español Mexicano)

	//Objetos con opciones de configuracion de la API

	const config = {
		enableWordTimeOffsets: true, //habilita la generacion de timestamps por cada palabra
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
	response.results.forEach((result) => {
		transcripcion = result.alternatives[0].transcript;
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
	return { transcript: transcripcion, timestamps: timestamps }; //Se retorna la transcripcion con timestamps
};

/**
 * Función que agrupa las palabras de la transcripcion en segmentos
 * cada uno con su tiempo de inicio y fin
 *
 * @param {list} timeArray arreglo de palabras con etiquetas de tiempo (inicio y fin)
 * @param {number} groupNum criterio de agrupacion (cuantas palabras contendra cada segmento)
 * @returns {list} lista de segmentos agrupados con etiquetas de tiempo (inicio y fin)
 */
module.exports.groupTimestamps = (timeArray, groupNum) => {
	const groupEvery = parseInt(groupNum);
	let retArray = [];
	let timeStamp = "";
	let segment = null;
	let sentance = "";

	for (let i = 0; i < timeArray.length; i += groupEvery) {
		if (i + groupEvery < timeArray.length) {
			segment = timeArray.slice(i, i + groupEvery);
		} else {
			segment = timeArray.slice(i, timeArray.length);
		}
		timeStamp =
			String(segment[0].time.start).split(".").join(":") +
			" - " +
			String(segment[segment.length - 1].time.end)
				.split(".")
				.join(":");
		sentance = segment
			.map((elem) => {
				return elem.word;
			})
			.join(" ");
		retArray.push([String(retArray.length + 1), sentance, timeStamp]);
	}
	return retArray;
};
