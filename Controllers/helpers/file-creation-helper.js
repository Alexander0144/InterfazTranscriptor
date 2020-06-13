const fs = require("fs");
const process = require("process");

module.exports.createFile = function createFile(
	jsonData = { fileData: "empty" },
	fileName
) {
	let localFile = fileName + ".json";
	let fileURl = process.cwd() + "/Public/" + localFile;
	fs.writeFileSync(fileURl, JSON.stringify(jsonData), "utf8");
	return localFile;
};
