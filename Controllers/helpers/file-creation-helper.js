const fs = require("fs");
const process = require("process");
/***
 * Funcion que crea un archivo JSON con los datos de
 * la transcripcion generada
 *
 * Recibe los siguientes parametros
 * @param jsonData datos de la transcripcion en formato JSON
 * @param fileName nombre del archivo a generar
 * @returns retorna el nombre del archivo una vez generado
 *
 * @exports createFile se exporta la funcion para poder utilizarla al invocar el modulo
 */
module.exports.createFile = function createFile(
	jsonData = { fileData: "empty" },
	fileName
) {
	let localFile = fileName + ".json";
	let fileURl = process.cwd() + "/Public/" + localFile;
	fs.writeFileSync(fileURl, JSON.stringify(jsonData), "utf8");
	return localFile;
};
