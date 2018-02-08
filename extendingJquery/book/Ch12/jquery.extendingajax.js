/* Ajax Extensions for jQuery v1.0.0.
   Written by Keith Wood (kwood{at}iinet.com.au) May 2012.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

/* Disable Ajax processing. */
$.ajax.disableDataTypes = [];

$.ajaxPrefilter('*', function(options, originalOptions, jqXHR) {
	if ($.inArray(options.dataType, $.ajax.disableDataTypes) > -1) {
		jqXHR.abort();
	}
});

/* Set CSV data type */
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	if (options.url.match(/.*\.csv/)) {
		return 'csv';
	}
});

/* Transport image data. */
$.ajaxTransport('image', function(options, originalOptions, jqXHR) {
	if (options.type === 'GET' && options.async) {
		var image;
		return {
			send: function(headers, complete) {
				image = new Image();
				function done(status) {
					if (image) {
						var statusText = (status == 200 ? 'success' : 'error');
						var tmp = image;
						image = image.onreadystatechange = image.onerror = image.onload = null;
						complete(status, statusText, {image: tmp}, headers);
					}
				}
				image.onreadystatechange = image.onload = function() {
					done(200);
				};
				image.onerror = function() {
					done(404);
				};
				image.src = options.url;
			},

			abort: function() {
				if (image) {
					image = image.onreadystatechange = image.onerror = image.onload = null;
				}
			}
		};
	}
});

/* Simulate HTML loading. */
$.ajax.simulateHtml = {};

$.ajaxTransport('html', function(options, originalOptions, jqXHR) {
	if (options.type === 'GET') {
		var timer;
		return {
			send: function(headers, complete) {
				var fileName = options.url.replace(/.*\/([^\/]+)$/, '$1');
				var simulate = $.ajax.simulateHtml[fileName] || $.ajax.simulateHtml['default'];
				timer = setTimeout(function() {
					complete(simulate.html ? 200 : 404,
						simulate.html ? 'success' : 'error', {html: simulate.html}, headers);
				}, Math.random() * simulate.variation + simulate.delay);
			},

			abort: function() {
				clearTimeout(timer);
			}
		};
	}
});

/* Convert CSV file into a JavaScript object.
   @param  csvText  (string) the CSV text
   @return  (object) the extracted CSV with attributes
                     fieldNames (string[]) and rows (string[][]) */
function textToCsv(csvText) {
	var fieldNames = [];
	var fieldCount = 9999;
	var rows = [];
	var lines = csvText.match(/[^\r\n]+/g); // Separate lines
	for (var i = 0; i < lines.length; i++) {
		if (lines[i]) {
			var columns = lines[i].match(/,|"([^"]|"")*"|[^,]*/g); // Separate columns
			var fields = [];
			var field = '';
			for (var j = 0; j < columns.length - 1; j++) {
				if (columns[j] == ',') { // Found a column delimiter
					if (fields.length < fieldCount) { // Save field
						fields.push(field);
					}
					field = '';
				}
				else { // Remember field value
					field = columns[j].replace(/^"(.*)"$/, '$1').replace(/""/g, '"') || '';
				}
			}
			if (fields.length < fieldCount) { // Save final field
				fields.push(field);
			}
			if (fieldNames.length == 0) { // First line is headers
				fieldNames = fields;
				fieldCount = fields.length;
			}
			else {
				for (var j = fields.length; j < fieldCount; j++) { // Fill in missing fields
					fields.push('');
				}
				rows.push(fields);
			}
		}
	}
	return {fieldNames: fieldNames, rows: rows}; // Return extracted CSV data
}

/* Convert JavaScript CSV object into a HTML table.
   @param  csv  (object) the CSV object
   @return  (jQuery) the data in a table */
function csvToTable(csv) {
	var table = '<table><thead><tr>';
	for (var i = 0; i < csv.fieldNames.length; i++) {
		table += '<th>' + csv.fieldNames[i] + '</th>';
	}
	table += '</tr></thead><tbody>';
	for (var i = 0; i < csv.rows.length; i++) {
		table += '<tr>';
		for (var j = 0; j < csv.fieldNames.length; j++) {
			table += '<td>' + csv.rows[i][j] + '</td>';
		}
		table += '</tr>';
	}
	table += '</tbody></table>';
	return $(table);
}

/* Register converters. */
$.ajaxSetup({converters: {
	'text csv': textToCsv,
	'csv table': csvToTable
}});

})(jQuery);