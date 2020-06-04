(function ($) {
	let currentFile = "";
	let uploadedFiles = [];

	function ajaxChangeView(content) {
		$.ajax({
			type: "GET",
			url: "/partial",
			dataType: "HTML",
			success: function (res) {
				//#appBody
				$("#appBody").html(res);
				//console.log(res);
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
				$("#txtTranscript").text(response.message);
				console.log(response.message);
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
		$("#testBtn").click(() => {
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
			"#btnExportar".click(() => {});
			console.log(text);
		});
	}

	$(document).ready(function () {
		setEvents();
	});
})(jQuery);
