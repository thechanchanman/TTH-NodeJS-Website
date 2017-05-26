var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");

var commonHeaders = {"Content-Type": "text/html"};

// Handle HTTP route GET / and POST i.e. Home
function home(request, response){
	if (request.url === "/") {
		if (request.method.toLowerCase() === "get") {
			// If it's a GET request
			response.writeHead(200, commonHeaders);
			renderer.view("header", {}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		} else {
			// If it's a POST request
				// Get the POST data from the body
				request.on("data", function(postBody) {
					// Extract the username
					var query = querystring.parse(postBody.toString("utf8"));
					// Redirect to /:username
					response.writeHead(303, {"Location": "/" + query.username});
					response.end();
				});

		}
	}
}
// Handle HTTP route GET /:username i.e. /chalkers
function user(request, response) {
	var username = request.url.replace("/", "");
	if (username.length > 0 && request.url.indexOf(".css") === -1 && request.url.indexOf(".png") === -1) {
		response.writeHead(200, commonHeaders);
		renderer.view("header", {}, response);

		// Get JSON from Treehouse
		var studentProfile = new Profile(username);
		// On "end"
		studentProfile.on("end", function(profileJSON){
			// Show profile

			// Store all the relative values
			var values = {
				avatarUrl: profileJSON.gravatar_url,
				username: profileJSON.profile_name,
				badges: profileJSON.badges.length,
				jsPoints: profileJSON.points.JavaScript
			};

			renderer.view("profile", values, response);
			renderer.view("footer", {}, response);
			response.end();
		});
		// On "error"
		studentProfile.on("error", function(error){
			// Show error
			renderer.view("error", {errorMessage: error.message}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		});
	}
}

// Handle CSS
function css(request, response) {
	if (request.url.indexOf(".css") !== -1) {
		var filename = request.url.replace("/", "");
		response.writeHead(200, {'Content-Type' : 'text/css'});
		renderer.styles(filename, response);
		response.end();
	}
}

// Handle png images
function png(request, response) {
	if (request.url.indexOf(".png") !== -1) {
		var filename = request.url.replace("/", "");
		response.writeHead(200, {'Content-Type' : 'image/png'});
		renderer.image(filename, response);
		response.end();
	}
}

module.exports.home = home;
module.exports.user = user;
module.exports.css = css;
module.exports.png = png;
