(function ($) {
	//arhcivo actual que se carga al servidor
	let currentFile = "";
	//conjunto de todos los archivos cargados
	//se usara para futura implementacion de carga de multiples
	//archivos
	let uploadedFiles = [];
	//objeto que representa la tabla de datos de DataTables
	//se crea una instancia al cambiar a la vista parcial de transcripcion
	let table = null;
	//criterio de agrupacion de palabras de la transcripcion
	//en segmentos
	let separationOption = 0;

	/**
	 * Función que manda una peticion HTTP a traves de AJAX
	 * para transcribir el archivo cargado en la interfaz
	 *
	 * Recibe dos parametros:
	 * @param {string} url la direccion del servicio web que llama a la API de transcripcion de Google Cloud
	 * @param {object} datos objeto que contiene el nombre del archivo en Google Cloud a transcribir
	 *
	 * El arhcivo que se manda a transcribir se carga a Google Cloud a la hora de subir un archivo al servidor
	 */
	function ajaxMandarTranscripcion(url, datos) {
		$.ajax({
			type: "POST",
			url: url,
			data: datos,
			dataType: "json",
			success: function (response) {
				table = llenaTablaTranscripcion(response.data.timestamps);
				asignaEventosBotnesTranscripcion(currentFile, table);
			},
			error: function () {
				console.log("error");
			},
		});
	}

	/**
	 *Función AJAX (Peticion HTTP) que obtiene el html
	 *de la vita parcial de resultados de transcricpión (donde se encuentra la tabla)
	 *e inserta la vista en el <div> contenedor "appBody"
	 *no recibe ningún parametro y no retorna ningún valor
	 */
	function ajaxChangeView() {
		$.ajax({
			type: "GET",
			url: "/partial",
			dataType: "HTML",
			success: function (res) {
				$("#appBody").html(res);
				table = $("#tblTranscript").DataTable({
					language: {
						emptyTable: "<b>Esperando Transcripcion</b>",
					},
				});
			},
			error: function () {
				console.log("error view");
			},
		});
	}

	/**
	 * La función agregaReproductor inserta en la interfaz
	 * los elementos del DOM requeridos por el constrctor "Progressor"
	 * para crear una instancia de la barra de reproducción del player
	 *
	 * Recibe un parametro:
	 * @param {string} src direccion del archivo de aucio cargado (actualmente en el servidor)
	 */
	function agregaReproductor(src) {
		$("#playerDiv").find("audio").remove();
		$("#playerDiv").find("div").remove();
		$("#playerDiv").append(
			"<audio preload='auto' controls='controls'></audio>"
		);

		$("#playerDiv audio").append(
			"<source src='" + src + "' type='audio/mpeg' />"
		);

		$("#playerDiv").append(
			"<div id='progressbar' class='flex-shrink-1' ></div>"
		);
	}

	/**
	 * Esta función cambia el estado del boton "Transcribir"
	 * a activo o inactivo deṕendiendo del objeto de estado que se le pase
	 *
	 * Recibe un parametro:
	 * @param {object} estado objeto que representa el estado activo o inactivo del boton
	 * contiene un valor booleano
	 */
	function asignaEstadoBotonTranscribir(estado) {
		if (estado.isActive) {
			$("#btnTranscribir").removeAttr("disabled");
			$("#btnTranscribir").attr("class", "btn btn-primary");
		} else {
			$("#btnTranscribir").attr("disabled");
			$("#btnTranscribir").attr("class", "btn btn-primary disabled");
		}
	}

	/**
	 * La funcióm "creaReproductor" crea un nuevo objeto
	 * tipo Progressor que crea la barra de reproduccion principal
	 * en la ventana
	 */
	function creaReproductor() {
		let jqProgressBar = new Progressor({
			media: $("audio")[0],
			bar: $("#progressbar")[0],
		});
	}

	/**
	 * Función que asigna los manejadores de eventos a los botones
	 * de la vista principal de la aplicacion (carga de archivos o Index)
	 *
	 * No recibe parametros y no retorna ningun valor
	 *
	 * Es ejecutada al cargar la pagina
	 */
	function asignaEventosCarga() {
		$("#audioUpload").change(function () {
			let filename = $("#archivo")[0].files[0].name;
			console.log(filename);
			$("label[for='archivo']").text(filename);
		});

		$("#btnCancelarCarga").click((e) => {
			e.preventDefault();
			$("#modalArchivo").modal("hide");
			$("label[for='archivo']").text("Seleccione un archivo");
		});

		//Evento "submit" del formularo de carga de archivos
		$("#audioUpload").submit(function () {
			$("#modalArchivo").modal("hide");
			$("label[for='archivo']").text("Seleccione un archivo");
			$(this).ajaxSubmit({
				error: function (err) {
					status("Error: " + err);
					asignaEstadoBotonTranscribir({ isActive: false });
				},
				success: function (res) {
					//Posibles mensajes de error que manda el servidor
					const ERRMSG_1 = "Error en la carga de archivos";
					const ERRMSG_2 = "Ha oocurrido un error";

					if (res.message == ERRMSG_1 || res.message == ERRMSG_2) {
						Swal.fire(
							"Formato no compatible",
							"Asegurese de subir archivos compatibles con el sistema",
							"info"
						);
					} else {
						Swal.fire(
							"Carga Completada",
							"Archivo cargado exitosamente",
							"success"
						);
						currentFile = res.message;
						uploadedFiles[uploadedFiles.length] = currentFile;
						console.log("uploaded files: " + uploadedFiles);
						agregaReproductor("../Public/Uploads/" + res.message);
						creaReproductor();
						if ($("#btnTranscribir")[0].hasAttribute("disabled")) {
							asignaEstadoBotonTranscribir({ isActive: true });
						}
					}
					console.log(res.message);
				},
			});
			return false;
		});

		$("#btnTranscribir").click(function (e) {
			e.preventDefault();
			ajaxChangeView();
			let text = ajaxMandarTranscripcion("archivo/mandaTranscripcion", {
				filename: currentFile,
			});
		});
	}

	//Inicio de la ejecucion del programa
	//Asignacion inicial de eventos al cargar la pagina
	$(document).ready(function () {
		asignaEventosCarga();
	});
})(jQuery);
