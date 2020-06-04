const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
//const cloudUpload = require("./helpers/gcp-helper");
const sysUploader = require("./helpers/sys_gcp_upload");
const speechHelper = require("./helpers/google-speech-helper");
let jsonParser = bodyParser.json();

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

const carga = multer(multerConf).single("archivo");

router.post("/carga", (req, res) => {
	carga(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			res.json({ message: "Error en la carga de archivos" });
		} else if (err) {
			res.json({ message: "Ha oocurrido un error" });
		} else {
			//cloudUpload.uploadFile(req.file.filename).catch(console.error);
			sysUploader.cliUpload(req.file.filename);
			res.json({ message: req.file.filename });
		}
	});
});

router.post("/mandaTranscripcion", jsonParser, (req, res) => {
	//const {filename} = req.body;
	//console.log("On Server data: " + req.body.filename);
	console.log(req.body.filename);
	speechHelper
		.transcribe(req.body.filename)
		.then((str) => res.json({ message: str }));
});

router.get("/descargarTranscripcion", jsonParser, (req, res) => {});

module.exports = router;