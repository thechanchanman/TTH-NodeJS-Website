var fs = require("fs");

function mergeValues(values, content) {
	// Cycle over the keys of the values
	for (var key in values) {
		// Replace all {{key}} with the value from the values object
		content = content.replace("{{" + key + "}}", values[key]);
	}
	//return merged content
	return content;
}

// Function that handles the reading of files and merge in values
function view(templateName, values, response) {
	// Read from template files
	var fileContents = fs.readFileSync("./views/" + templateName + ".html", {encoding: "utf8"});
	// Insert values in to the content
	fileContents = mergeValues(values, fileContents);
	// Write out the contents to the response
	response.write(fileContents);
}

module.exports.view = view;
