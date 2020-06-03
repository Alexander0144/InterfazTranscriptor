const process = require("process");
const { exec } = require("child_process");

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
			return "success";
		}
	);
}

module.exports.cliUpload = cliUpload;
