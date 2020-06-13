const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const process = require("process");
const bodyParser = require("body-parser");
const sysUploader = require("./helpers/sys_gcp_upload");
const timestampHelper = require("./helpers/timestamp-speech-helper");
const fileDownload = require("./helpers/file-creation-helper");

let jsonParser = bodyParser.json();
let auxFile = "";

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
	console.log("On server" + req.body.filename);
	timestampHelper
		.transcribe(req.body.filename)
		.then((gscData) => res.json({ data: gscData }));
});

router.post("/generaTranscripcion", jsonParser, (req, res) => {
	let name = req.body.fileName;
	//console.log(name);
	const file = fileDownload.createFile(req.body.text, req.body.fileName);
	//res.download(process.cwd() + "/Public/" + file);
	//auxFile = name + ".json";
	res.json({ message: name });
	//res.redirect("/archivo/downloadFile?fileName=" + name);
});

router.get("/downloadFile/:name", (req, res) => {
	let data = req.params.name;
	//console.log(data);
	res.download(process.cwd() + "/Public/" + data + ".json");
});

module.exports = router;
