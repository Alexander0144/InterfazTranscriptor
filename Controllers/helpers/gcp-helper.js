/***
 * CODIGO PROBLEMATICO
 * CORROMPE ARCHIVOS AL SUBIRLOS A GOOGLE CLOUD
 * REPARACION PENDIENTE
 * En su lugar se utliliza el modulo: sys_gcp_upload.js
 */

const { Storage } = require("@google-cloud/storage");
const process = require("process");

async function uploadFile(filename) {
	const storage = new Storage();

	const DEFAULT_BUCKET_NAME = "bucket-audio-test";

	fileUrl = process.cwd() + "/Public/Uploads/" + filename;
	// Sube un archivo local del servidor a Google Cloud Storage
	await storage.bucket(DEFAULT_BUCKET_NAME).upload(fileUrl, {
		// Soporte para llamadas HTTP con `Accept-Encoding: gzip`
		gzip: true,

		metadata: {
			cacheControl: "public, max-age=31536000",
		},
	});

	console.log(`${filename} subido exitosamente a ${DEFAULT_BUCKET_NAME}.`);
}

module.exports.uploadFile = uploadFile;
