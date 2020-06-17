//Se importan las librerias requeridas
const process = require("process");
const { exec } = require("child_process");

/***
 * Funcion que recibe el nombre de un archivo a subir
 * retorna el estatus de la subida del archivo
 * acrualizacion asincrona pendiente
 * @param filename nombre del archiv. Tipo de dato: Cadena
 * @returns retorna un mensaje en caso de ser exitosa la subida
 */
function cliUpload(filename) {
	let filePath = process.cwd() + "/Public/Uploads/" + filename;
	exec(
		"gsutil cp " + filePath + " gs://bucket-audio-test/",
		(error, stdout, stderr) => {
			if (error) {
				return `error: ${error.message}`;
			} else if (stderr) {
				return `stderr: ${stderr}`;
			}
			console.log(`stdout: ${stdout}`);
			console.log("Archivo subido a: gs://bucket-audio-test");
			return "success GCP upload";
		}
	);
}
/**
 * @exports cliUpload se exporta la funcion para estar disponible
 * a la hora de utilizar el modulo
 */
module.exports.cliUpload = cliUpload;
