/**
 * Función que recibe un objeto que representa la respuesta de una llamada HTTP
 *
 * Es usada por la funcion ajaxGeneraArchivo que le pasa el objeto de respuesta de una llamada AJAX
 *
 * La función asigna la ruta de descarga para el archivo que contiene los datos de la tarnscripción
 * al boton "Descargar Transcripción" en la vista de datos de transcripción
 *
 * @param {object} res respuesta de llamada AJAX
 */
function setUrlDescarga(res) {
	$("#btnLinkDescarga").attr("href", "/archivo/downloadFile/" + res.message);
	$("#btnLinkDescarga").removeClass("disabled");
	Swal.fire(
		"Archivo Generado",
		"El archivo de transcripción se ha actualizado",
		"success"
	);
}

/**
 * Función que genera un archivo con los datos de la transcripcion generada
 * Recibe un objeto con los datos del archivo
 * Se ejecuta al presionar el boton "Generar archivo"
 *
 * @param {object} fileData objeto con el texto JSON del archivo a exportar y el nombre que se le asigna
 */
function ajaxGeneraArchivo(fileData) {
	$.ajax({
		type: "POST",
		url: "./archivo/generaTranscripcion",
		data: fileData,
		dataType: "json",
		success: setUrlDescarga,
		error: function () {
			console.log("error en descarga");
		},
	});
}

/**
 * Función que llena la tabla de DataTables de la interfaz con los datos recibidos
 * Destruye la tabla vacia y crea una nueva tabla con los datos de la transcripcion
 *
 * @param {list} transcripcionConTiempos lista con las palabras de la transcripcion y los tiempos correspondientes
 * @returns {object} retorna la tabla generada
 */
function llenaTablaTranscripcion(transcripcionConTiempos) {
	$("#tblTranscript").DataTable().clear().destroy(); //Se destruye la tabla vacia para generar una tabla con datos
	let arrTranscript = groupTimestamps(transcripcionConTiempos, 5);
	table = $("#tblTranscript").DataTable({
		data: arrTranscript,
		columns: [
			{ title: "Seccion" },
			{ title: "Transcripcion" },

			{ title: "Timestamp" },
		],
	});

	//Se agrega la clase ".activeRow" a la fila de la tabla
	//que se presione, se remueve en caso de que ta este seleccionada
	$("#tblTranscript").on("click", "tbody tr", function () {
		if ($(this).hasClass("activeRow")) {
			$(this).removeClass("activeRow");
		} else {
			$("#tblTranscript tr").removeClass("activeRow");
			$(this).addClass("activeRow");
		}
	});

	return table;
}

/**
 * Función que activa los botones de la vista de transcripcion y del modal de edición
 * despues de activarse se le asignan a los botones su funcionalidad para el evento "click"
 * Recibe dos parametros
 *
 * @param {string} currentFile nombre del archivo transcrito en Google Cloud
 * @param {object} table tabla con los datos de transcripción del archivo
 */
function asignaEventosBotnesTranscripcion(currentFile, table) {
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
		}
	});

	$("#btnGuardarEdicion").click((e) => {
		e.preventDefault();
		let rowIndex = parseInt($(".activeRow").find("td:eq(0)").text());
		table
			.cell(rowIndex - 1, 1)
			.data($("#textoModalEditar").val())
			.draw();
		$("#lblEstatusEdicion").attr("class", "badge badge-warning");
		$("#lblEstatusEdicion").text("Segmento Editado");
		$("#btnLinkDescarga").addClass("disabled");
		$("#btnTranscribir").attr("href", "#");
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
}

/**
 * función que convierte el objeto de contenido de la tabla de datos
 * al formato utilizado para el archivo en el que se exporta la transcripción
 * Recibe tres parametros
 *
 * @param {list} tableData los datos contenidos en la tabla de la interfaz
 * @param {number} iRows el numero de registros de la tabla (filas)
 * @param {number} jColumns el numero de categorias de la tabla (columnas)
 * @returns {object} retorna los datos de la transcripcion contenidos en la tabla
 * en el formato que se utilizara en el archivo JSON a la hora de descargar la transcripción
 */
function tableDataToJson(tableData, iRows, jColumns) {
	let tableJson = {};
	for (let i = 0; i < iRows; i++) {
		let rowJson = {};
		for (let j = 0; j < jColumns; j++) {
			if (j == 0) {
				rowJson["_id"] = tableData[i][j];
			} else if (j == 1) {
				rowJson["Texto"] = tableData[i][j];
			} else {
				rowJson["TimeStamp"] = tableData[i][j];
			}
		}
		tableJson["segmento_" + i] = rowJson;
	}
	return tableJson;
}

/**
 * Función que agrupa las palabras de la transcripcion en segmentos
 * cada uno con su tiempo de inicio y fin
 *
 * @param {list} timeArray arreglo de palabras con etiquetas de tiempo (inicio y fin)
 * @param {number} groupEvery criterio de agrupacion (cuantas palabras contendra cada segmento)
 * @returns {list} lista de segmentos agrupados con etiquetas de tiempo (inicio y fin)
 */
function groupTimestamps(timeArray, groupEvery) {
	let retArray = [];
	let timeStamp = "";
	let segment = [];
	let sentance = "";

	for (let i = 0; i < timeArray.length; i += groupEvery) {
		if (i + groupEvery < timeArray.length) {
			segment = timeArray.slice(i, i + groupEvery);
		} else {
			segment = timeArray.slice(i, timeArray.length);
		}
		timeStamp =
			String(segment[0].time.start).split(".").join(":") +
			" - " +
			String(segment[segment.length - 1].time.end)
				.split(".")
				.join(":");
		sentance = segment
			.map((elem) => {
				return elem.word;
			})
			.join(" ");
		retArray[retArray.length] = [retArray.length + 1, sentance, timeStamp];
	}
	return retArray;
}
