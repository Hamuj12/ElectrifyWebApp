window.$ = window.jQuery = require('jquery');

const resistorValues = new Map([
	['1K_1-4W', '1 kOhm Resistor rated for up to 0.250W'],
	['1K_2W', '1 kOhm Resistor rated for up to 2W'],
	['1M_1-4W', '1 MOhm Resistor rated for up to 0.250W'],
	['2K2_1-4W', '2.2 kOhm Resistor rated for up to 0.250W'],
	['2R_1W', '2 Ohm Resistor rated for up to 1W'],
	['3R9K_1-4W', '3.9 Ohm Resistor rated for up to 0.250W'],
	['4K7_1-4W', '4.7 kOhm Resistor rated for up to 0.250W'],
	['5K1_1-4W', '5.1 kOhm Resistor rated for up to 0.250W'],
	['5K61_1-4W', '5.61 kOhm Resistor rated for up to 0.250W'],
	['6R8_1-4W', '6.8 Ohm Resistor rated for up to 0.250W'],
	['7K5_1-4W', '7.5 kOhm Resistor rated for up to 0.250W'],
	['8K2_1-4W', '8.2 kOhm Resistor rated for up to 0.250W'],
	['10_1-4W', '10 Ohm Resistor rated for up to 0.250W'],
	['10R_1W', '10 Ohm Resistor rated for up to 1W'],
	['10R_2W', '10 Ohm Resistor rated for up to 2W'],
	['11M_1-2W', '11 MOhm Resistor rated for up to 0.500W'],
	['15R_1-4W', '15 Ohm Resistor rated for up to 0.250W'],
	['20K_1-4W', '20 kOhm Resistor rated for up to 0.250W'],
	['22R_1-4W', '22 Ohm Resistor rated for up to 0.250W'],
	['24K_1-2W', '24 kOhm Resistor rated for up to 0.500W'],
	['27R_1W', '27 Ohm Resistor rated for up to 1W'],
	['33K_2W', '33 kOhm Resistor rated for up to 2W'],
	['56K_1W', '56 kOhm Resistor rated for up to 1W'],
	['68K_1W', '68 kOhm Resistor rated for up to 1W'],
	['100R_1-4W', '100 Ohm Resistor rated for up to 0.250W'],
	['150R_1-4W', '150 Ohm Resistor rated for up to 0.250W'],
	['150R_1-8W', '150 Ohm Resistor rated for up to 0.125W'],
	['180K_1-2W', '180 kOhm Resistor rated for up to 0.500W'],
	['220K_1-4W', '220 kOhm Resistor rated for up to 0.250W'],
	['220R_2W', '220 Ohm Resistor rated for up to 2W'],
	['270K_1-4W', '270 kOhm Resistor rated for up to 0.250W'],
	['470R_1-4W', '470 Ohm Resistor rated for up to 0.250W'],
	['470R_1W', '470 Ohm Resistor rated for up to 1W'],
	['620R_1-4W', '620 Ohm Resistor rated for up to 0.250W'],
	['820R_1-4W', '820 Ohm Resistor rated for up to 0.250W'],
	['4700Mohm', '4700 MOhm Resistor'],
]);

$(function() {
	//values pulled from query string
	$('#model').val("electrify700");
	$('#version').val("1");
	$('#api_key').val("6o8l4D71KyuuOF9FbX3G");

	setupButtonListeners();
});

var infer = function() {
	$('#output').html("Inferring...");
	$("#resultContainer").show();
	$('html').scrollTop(100000);

	getSettingsFromForm(function(settings) {
		settings.error = function(xhr) {
			$('#output').html("").append([
				"Error loading response.",
				"",
				"Check your API key, model, version,",
				"and other parameters",
				"then try again."
			].join("\n"));
		};

		$.ajax(settings).then(function(response) {
			// var pretty = $('<pre>');
			// var formatted = JSON.stringify(response, null, 4)
			var predictions = [];
			response.predictions.forEach(function(prediction) {
				if (prediction.confidence != 0) {
					predictions.push([prediction.class, prediction.confidence]);
				}
			});
			// pretty.html(formatted);
			console.log(predictions[0][0]);
			// console.log(resistorValues.get(predictions[0][0]));
			$('#output').html("").append(resistorValues.get(predictions[0][0]));
			// $('html').scrollTop(100000);
		});
	});
};

var retrieveDefaultValuesFromLocalStorage = function() {
	try {
		var api_key = localStorage.getItem("rf.api_key");
		var model = localStorage.getItem("rf.model");
		var format = localStorage.getItem("rf.format");

		if (api_key) $('#api_key').val(api_key);
		if (model) $('#model').val(model);
		if (format) $('#format').val(format);
	} catch (e) {
		// localStorage disabled
	}

	$('#model').change(function() {
		localStorage.setItem('rf.model', $(this).val());
	});

	$('#api_key').change(function() {
		localStorage.setItem('rf.api_key', $(this).val());
	});

	$('#format').change(function() {
		localStorage.setItem('rf.format', $(this).val());
	});
};

var setupButtonListeners = function() {
	// run inference when the form is submitted
	$('#inputForm').submit(function() {
		infer();
		return false;
	});

	// make the buttons blue when clicked
	// and show the proper "Select file" or "Enter url" state
	$('.bttn').click(function() {
		$(this).parent().find('.bttn').removeClass('active');
		$(this).addClass('active');

		if($('#computerButton').hasClass('active')) {
			$('#fileSelectionContainer').show();
			$('#urlContainer').hide();
		} else {
			$('#fileSelectionContainer').hide();
			$('#urlContainer').show();
		}

		if($('#jsonButton').hasClass('active')) {
			$('#imageOptions').hide();
		} else {
			$('#imageOptions').show();
		}

		return false;
	});

	// wire styled button to hidden file input
	$('#fileMock').click(function() {
		$('#file').click();
	});

	// grab the filename when a file is selected
	$("#file").change(function() {
		var path = $(this).val().replace(/\\/g, "/");
		var parts = path.split("/");
		var filename = parts.pop();
		$('#fileName').val(filename);
	});
};

var getSettingsFromForm = function(cb) {
	var settings = {
		method: "POST",
	};

	var parts = [
		"https://classify.roboflow.com/",
		$('#model').val(),
		"/",
		$('#version').val(),
		"?api_key=" + $('#api_key').val()
	];

	var method = $('#method .active').attr('data-value');
	if(method == "upload") {
		var file = $('#file').get(0).files && $('#file').get(0).files.item(0);
		if(!file) return alert("Please select a file.");

		getBase64fromFile(file).then(function(base64image) {
			settings.url = parts.join("");
			settings.data = base64image;

			console.log(settings);
			cb(settings);
		});
	} else {
		var url = $('#url').val();
		if(!url) return alert("Please enter an image URL");

		parts.push("&image=" + encodeURIComponent(url));

		settings.url = parts.join("");
		console.log(settings);
		cb(settings);
	}
};

var getBase64fromFile = function(file) {
	return new Promise(function(resolve, reject) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function() {
		resizeImage(reader.result).then(function(resizedImage){
			resolve(resizedImage);
		});
    };
		reader.onerror = function(error) {
			reject(error);
		};
	});
};

var resizeImage = function(base64Str) {
	return new Promise(function(resolve, reject) {
		var img = new Image();
		img.src = base64Str;
		img.onload = function(){
			var canvas = document.createElement("canvas");
			var MAX_WIDTH = 1500;
			var MAX_HEIGHT = 1500;
			var width = img.width;
			var height = img.height;
			if (width > height) {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
			} else {
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
			}
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, width, height);
			resolve(canvas.toDataURL('image/jpeg', 1.0));  
		};
	});	
};
