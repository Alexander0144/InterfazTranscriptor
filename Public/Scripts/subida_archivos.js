(function ($) {
	let currentFile = "";
	let uploadedFiles = [];
	let table = null;
	let separationOption = 0;

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

	function asignaEstadoBotonTranscribir(estado) {
		if (estado.isActive) {
			$("#btnTranscribir").removeAttr("disabled");
			$("#btnTranscribir").attr("class", "btn btn-primary");
		} else {
			$("#btnTranscribir").attr("disabled");
			$("#btnTranscribir").attr("class", "btn btn-primary disabled");
		}
	}

	function creaReproductor() {
		let jqProgressBar = new Progressor({
			media: $("audio")[0],
			bar: $("#progressbar")[0],
		});
	}

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

		$("#audioUpload").submit(function () {
			$("#modalArchivo").modal("hide");
			$("label[for='archivo']").text("Seleccione un archivo");
			$(this).ajaxSubmit({
				error: function (err) {
					status("Error: " + err);
					asignaEstadoBotonTranscribir({ isActive: false });
				},
				success: function (res) {
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

	$(document).ready(function () {
		asignaEventosCarga();
	});
})(jQuery);
