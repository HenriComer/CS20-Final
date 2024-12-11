// Packages/Dependencies
var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
// var port = process.env.PORT || 3000;
var port = 8080;

// MongoDB connection URI
const uri = 'mongodb+srv://connorg2404:Tusd2026@cs20-hw13.be1nl.mongodb.net/?retryWrites=true&w=majority&appName=CS20-HW13';

// Create the server
http.createServer(async function (req, res) {
    var urlObj = url.parse(req.url, true);
    var path = urlObj.pathname;

    if (path === "/" || path.startsWith("/index.html")) {
        readHTMLFile(res, "index.html");

    } else if (path.startsWith("/meal-prep.html")) {
        readHTMLFile(res, "meal-prep.html");

    } else if (path.startsWith("/exercise.html")) {
        readHTMLFile(res, "exercise.html");

    } else if (path.startsWith("/contact.html")) {
        readHTMLFile(res, "contact.html");

    } else if (path.startsWith("/profile.html")) {
        readHTMLFile(res, "profile.html");

    } else if (path.startsWith("/register.html")) {
        readHTMLFile(res, "register.html");

    } else if (path === "/styles.css") {
        fs.readFile("styles.css", function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("CSS file not found.");
                res.end();
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
    } else if (path === "/meal-prep.js") {
        readCodeFile(res, "meal-prep.js");

    } else if (path === "/contact.js") {
        readCodeFile(res, "contact.js");

    } else if (path === "/exercise.js") {
        readCodeFile(res, "exercise.js");
        
    } else if (path.startsWith("/Images/")) {
        fs.readFile("." + path, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("Image file not found.");
                res.end();
                return;
            }
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.write(data);
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write("Page not found.");
        res.end();
    }
}).listen(port);

function readHTMLFile(res, fileName) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write("Error loading the file.");
            res.end();
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    }); 
}

function readCodeFile(res, fileName) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write("JavaScript file not found.");
            res.end();
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.write(data);
        res.end();
    });
}

console.log("Server running on localhost:" + port);

