//Se importan las librerias requeridas
const process = require("process");
const exec = require("exec-then");

/***
 * Funcion que recibe el nombre de un archivo a subir
 * retorna el estatus de la subida del archivo
 * @param filename nombre del archiv. Tipo de dato: Cadena
 * @returns retorna un mensaje en caso de ser exitosa la subida
 */
function cliUpload(filename) {
	let filePath = process.cwd() + "/Public/Uploads/" + filename;
	return exec(`gsutil cp ${filePath} gs://bucket-audio-test/`).then((obj) => {
		if (obj.err) {
			return `error: ${JSON.stringify(obj.err)}`;
		} else {
			return "success: uploaded";
		}
	});
}
/**
 * @exports cliUpload se exporta la funcion para estar disponible
 * a la hora de utilizar el modulo
 */
module.exports.cliUpload = cliUpload;
