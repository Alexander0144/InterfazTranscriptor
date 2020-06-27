const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
//Se importa el controlador de rutas para peticiones HTTP relacionadas con archivos
const routerArchivo = require("./Controllers/ArchivoController");

app.disable("x-powered-by"); //se oculta informacion del servidor

//Se define a bodu parser como el interprete de JSON por defecto
app.use(bodyParser.urlencoded({ extended: true }));

//Definicion de ruta para manejo de peticiones
//a recursos publicos
app.use("/Public", express.static(path.join(__dirname, "Public")));

//Definicion de ruta de middleware
//Todas las peticiones relacionadas con archivos van a esta ruta
//y son manejadas por el controlador
app.use("/archivo", routerArchivo);

//Manejo de ruta raiz de la pagina
//Devuelve la vista principal Index.html
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/Public/Views/Index.html"));
});

//Manejo de ruta para vista parcial
//Devuelve la vista parcial para la tabla de transcripcion
app.get("/partial", (req, res) => {
	res.sendFile(path.join(__dirname, "/Public/Views/partial.htm"));
});

//Manejo de ruta para favcion
app.get("/favicon.ico", (req, res) => {
	res.sendFile(path.join(__dirname, "/Public/favicon.ico"));
});

//Definicion de puerto para la aplicacion
const puerto = process.env.PORT || 4000;
app.listen(puerto, "0.0.0.0", () => {
	console.log(
		`Servidor escuchand en el puerto ${puerto}\nPresione Ctrl+C para terminar el proceso...`
	);
});
