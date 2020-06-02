const { Storage } = require("@google-cloud/storage");
const process = require("process");

const storage = new Storage();

const DEFAULT_BUCKET_NAME = "bucket-audio-test";

async function uploadFile(filename) {
	fileUrl = process.cwd() + "/Public/Uploads/" + filename;
	// Sube un archivo local del servidor a Google Cloud Storage
	await storage.bucket(DEFAULT_BUCKET_NAME).upload(fileUrl, {
		// Soporte para llamadas HTTP con `Accept-Encoding: gzip`
		gzip: true,
		// By setting the option `destination`, you can change the name of the
		// object you are uploading to a bucket.
		metadata: {
			// Enable long-lived HTTP caching headers
			// Use only if the contents of the file will never change
			// (If the contents will change, use cacheControl: 'no-cache')
			cacheControl: "public, max-age=31536000",
		},
	});

	console.log(`${filename} subido exitosamente a ${DEFAULT_BUCKET_NAME}.`);
}

function logCwp() {
	console.log(process.cwd());
}

module.exports.uploadFile = uploadFile;
module.exports.logCwp = logCwp;
