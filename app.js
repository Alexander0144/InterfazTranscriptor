const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const routerArchivo = require("./Controllers/ArchivoController");

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/Public", express.static(path.join(__dirname, "Public")));

app.use("/archivo", routerArchivo);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/Public/Views/Index.html"));
});

app.get("/favicon.ico", (req, res) => {
	res.sendFile(path.join(__dirname, "/Public/favicon.ico"));
});

const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
	console.log(
		`Servidor escuchand en el puerto ${puerto}\nPresione Ctrl+C para terminar el proceso...`
	);
});
