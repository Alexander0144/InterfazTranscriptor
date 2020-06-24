const process = require("process");
const exec = require("exec-then");

/***
 * Funcion que recibe el nombre de un archivo a subir
 * retorna el estatus de la subida del archivo
 * @param filename nombre del archiv. Tipo de dato: Cadena
 * @returns retorna el mensaje "success: uploaded" en caso de ser exitosa la subida
 * en el caso de que ocurra un error, se retorna el codigo de error correspondiente
 *
 * NOTA: La funcion depende del sistema operativo, se debe de instalar "gsutil" de antemano
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
