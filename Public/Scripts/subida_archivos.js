(function ($) {
	let currentFile = "";
	let uploadedFiles = [];

	function ajaxMandarTranscripcion(url, datos) {
		$.ajax({
			type: "POST",
			url: url,
			data: datos,
			dataType: "json",
			success: function (response) {
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
			ajaxMandarTranscripcion("archivo/mandaTranscripcion", {
				filename: currentFile,
			});
		});
	}

	$(document).ready(function () {
		setEvents();
	});
})(jQuery);
