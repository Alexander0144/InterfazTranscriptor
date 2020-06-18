(function ($) {
	let currentFile = "";
	let uploadedFiles = [];
	let table = null;
	let separationOption = 0;

	function ajaxGeneraArchivo(fileData) {
		$.ajax({
			type: "POST",
			url: "./archivo/generaTranscripcion",
			data: fileData,
			dataType: "json",
			success: function (res) {
				$("#btnLinkDescarga").attr(
					"href",
					"/archivo/downloadFile/" + res.message
				);
				$("#btnLinkDescarga").removeClass("disabled");
			},
			error: function () {
				console.log("error en descarga");
			},
		});
	}

	function tableDataToJson(tableData, iRows, jColumns) {
		let tableJson = {};
		for (let i = 0; i < iRows; i++) {
			let rowJson = {};
			for (let j = 0; j < jColumns; j++) {
				let index = j + 1;
				rowJson["columna" + index] = tableData[i][j];
			}
			tableJson["fila" + i] = rowJson;
		}
		return tableJson;
	}

	function groupTimestamps(timeArray, groupEvery) {
		let retArray = [];
		let timeRef = 0.0;
		let sentance = "";
		let cont = 0;

		for (let i = 0; i < timeArray.length; i++) {
			sentance += " " + timeArray[i].word;
			if (i % groupEvery == 0) {
				retArray[cont] = [
					cont,
					sentance,
					timeRef + " - " + timeArray[i].time.end,
				];
				timeRef = timeArray[i].time.end;
				sentance = "";
				cont++;
			}
		}

		return retArray;
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

	function ajaxMandarTranscripcion(url, datos) {
		$.ajax({
			type: "POST",
			url: url,
			data: datos,
			dataType: "json",
			success: function (response) {
				//$("#txtTranscript").text(response.data.transcript);
				$("#tblTranscript").DataTable().clear().destroy();
				let arrTranscript = groupTimestamps(response.data.timestamps, 5);
				table = $("#tblTranscript").DataTable({
					data: arrTranscript,
					columns: [
						{ title: "Seccion" },
						{ title: "Transcripcion" },

						{ title: "Timestamp" },
					],
				});

				$("#tblTranscript").on("click", "tbody tr", function () {
					if ($(this).hasClass("activeRow")) {
						$(this).removeClass("activeRow");
					} else {
						$("#tblTranscript tr").removeClass("activeRow");
						$(this).addClass("activeRow");
					}
				});

				$("#btnEditar").removeClass("disabled");
				$("#btnExportar").removeClass("disabled");
				$("#btnEditar").click((e) => {
					e.preventDefault();
					if ($(".activeRow").length) {
						let a = $(".activeRow").find("td:eq(1)").text();
						$("#textoModalEditar").val(a);
						$("#modalEditar").modal("show");
					} else {
						Swal.fire({
							icon: "info",
							title: "Sin seleccion",
							text: "Por favor sleccione un segmento para editar",
						});
						//window.alert("Seleccione un Segmento a editar");
					}
				});

				$("#btnGuardarEdicion").click((e) => {
					e.preventDefault();
					let rowIndex = parseInt($(".activeRow").find("td:eq(0)").text());
					table.cell(rowIndex, 1).data($("#textoModalEditar").val()).draw();
					//$(".activeRow").find("td:eq(1)").text($("#textoModalEditar").val());
					//badge-warning badge-success
					$("#lblEstatusEdicion").attr("class", "badge badge-warning");
					$("#lblEstatusEdicion").text("Segmento Editado");
					$("#modalEditar").modal("hide");
				});

				$("#btnExportar").click(() => {
					let obj = tableDataToJson(
						table.rows().data(),
						table.rows().count(),
						table.columns().count()
					);
					ajaxGeneraArchivo({
						text: obj,
						fileName: currentFile.split(".")[0],
					});
				});
			},
			error: function () {
				console.log("error");
			},
		});
	}

	function setPlayer(src) {
		$("#playerDiv").find("audio").remove();
		$("#playerDiv").find("div").remove();
		$("#playerDiv").append(
			"<audio preload='auto' controls='controls'></audio>"
		);

		$("#playerDiv audio").append(
			"<source src='" + src + "' type='audio/mpeg' />"
		);

		$("#playerDiv").append("<div id=progressbar></div>");
	}

	function btnTranscribir(state) {
		if (state.isActive) {
			//btn btn-primary
			$("#btnTranscribir").removeAttr("disabled");
			$("#btnTranscribir").attr("class", "btn btn-primary");
		} else {
			$("#btnTranscribir").attr("disabled");
			$("#btnTranscribir").attr("class", "btn btn-primary disabled");
		}
	}

	function progressor() {
		let jqProgressBar = new Progressor({
			media: $("audio")[0],
			bar: $("#progressbar")[0],
		});
	}

	function setEvents() {
		$("#btnTest").click(() => {
			ajaxChangeView();
		});
		$("#audioUpload").change(function () {
			let filename = $("#archivo")[0].files[0].name;
			console.log(filename);
			$("label[for='archivo']").text(filename);
		});

		$("#audioUpload").submit(function () {
			$(this).ajaxSubmit({
				error: function (err) {
					status("Error: " + err);
					btnTranscribir({ isActive: false });
				},
				success: function (res) {
					$("#modalArchivo").modal("hide");
					console.log(res.message);
					currentFile = res.message;
					uploadedFiles[uploadedFiles.length] = currentFile;
					console.log("uploaded files: " + uploadedFiles);
					setPlayer("../Public/Uploads/" + res.message);
					progressor();
					if ($("#btnTranscribir")[0].hasAttribute("disabled")) {
						btnTranscribir({ isActive: true });
					}
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
		setEvents();
	});
})(jQuery);
