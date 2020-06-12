(function ($) {
	let currentFile = "";
	let uploadedFiles = [];
	let table = null;
	let separationOption = 0;

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

	function ajaxChangeView(content) {
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
				$("#tblTranscript").DataTable({
					data: arrTranscript,
					columns: [
						{ title: "Seccion" },
						{ title: "Transcripcion" },

						{ title: "Timestamp" },
					],
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
			$("#btnExportar").click(() => {
				console.log("another");
			});
			console.log(text);
		});
	}

	$(document).ready(function () {
		setEvents();
	});
})(jQuery);
