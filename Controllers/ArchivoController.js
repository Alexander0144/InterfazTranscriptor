//Se importan las librerias requeridas
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const process = require("process");
const bodyParser = require("body-parser");
//Se importan los modulos ayudantes para realizar
//Funciones relacionadas con Google Cloud Plataform
const sysUploader = require("./helpers/sys_gcp_upload");
const timestampHelper = require("./helpers/timestamp-speech-helper");
const fileDownload = require("./helpers/file-creation-helper");

//analiza los datos de entrada que se le mandan
//a las rutas para poder tener acceso a ellos
let jsonParser = bodyParser.json();

let auxFile = "";

//Objeto de configuracion de almacenamiento de multer
//el objeto multer se usa para recibir y guardar archivos
//que se mandaron desde formularios del lado del cliente
const almacena = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, "Public/Uploads");
	},
	filename: function (req, file, callback) {
		callback(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

//Objeto de configuracion de opciones de Multer
//se definen los tipos de archivo que se pueden subir
const multerConf = {
	storage: almacena,
	fileFilter: (req, file, callback) => {
		if (
			file.mimetype == "audio/mpeg" ||
			file.mimetype == "audio/ogg" ||
			file.mimetype == "audio/wav" ||
			file.mimetype == "audio/x-wav" ||
			file.mimetype == "audio/wave" ||
			file.mimetype == "audio/x-pn-wav"
		) {
			callback(null, true);
		} else {
			callback(null, false);
			return callback(new Error("Solo formatos multimedia"));
		}
	},
};
//Objeto de carga designado para recibir un solo archivo
const carga = multer(multerConf).single("archivo");

/***
 * Definicion de ruta que recibe archivo a cargar
 * El archivo se manda desde el cliente a traves del metodo POST
 */
router.post("/carga", (req, res) => {
	carga(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			res.json({ message: "Error en la carga de archivos" });
		} else if (err) {
			res.json({ message: "Ha oocurrido un error" });
		} else {
			sysUploader.cliUpload(req.file.filename).then((result) => {
				console.log(result);
				if (result == "success: uploaded") {
					res.json({ message: req.file.filename });
				}
			});
		}
	});
});

/***
 * Definicon de ruta que inicia la transcripcion del archivo subido
 * La ruta utiliza el objeto ayudante timestampHelper que llama a la api de transcripcion de Google
 * El metodo espera una respuesta y posteriormente retorna la transcripcion con timestamps
 */

router.post("/mandaTranscripcion", jsonParser, (req, res) => {
	console.log("On server: " + req.body.filename);
	timestampHelper
		.transcribe(req.body.filename)
		.then((gscData) => res.json({ data: gscData }))
		.catch((err) => {
			console.log(err);
		});
});

/***
 * Definicion de ruta que genera el archivo JSON
 * con los datos de la transcripcion generada
 * Utiliza el analizador jsonParser para obtener el nombre del archivo a generar
 */

router.post("/generaTranscripcion", jsonParser, (req, res) => {
	let name = req.body.fileName;
	const file = fileDownload.createFile(req.body.text, req.body.fileName);
	res.json({ message: name });
});

//Ruta que devuelve el archivo de transcripcion generado
//Del lado del cliente se llama la descarga por el metodo GET
router.get("/downloadFile/:name", (req, res) => {
	let data = req.params.name;
	res.download(process.cwd() + "/Public/" + data + ".json");
});

/***
 * @exports router se exporta el ruteador del modulo controlador
 * para ser utilizado en la app principal
 */
module.exports = router;
