var router = require("./router.js");
// Problem: We need a simple way to look at a user's badge count and JS points from a web browser
// Solution: Use Node.js to perform the profile look ups and serve our template via HTTP

// Create a web server
var http = require("http");
http.createServer(function(request, response) {
	router.css(request, response);
	router.home(request, response);
	router.user(request, response);
	router.png(request, response);
}).listen(1337, "127.0.0.1");
console.log("Server running at http://127.0.0.1:1337");
