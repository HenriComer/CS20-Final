// Packages/Dependencies
var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
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

    } else if (path === "/registerAccount") {
        var query = urlObj.query;
        var newEmail = query.email;
        var userName = query.name;

        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db('HECA');
            const collection = db.collection('users');

            let dbQuery = {email: newEmail};
            console.log(newEmail);
            console.log(userName);

            const results = await collection.find(dbQuery).toArray();
            if (results.length === 1) {
                readHTMLFile(res, "wrongEmail.html");
            } else {
                await db.collection('users').insertOne({name: userName, email: newEmail, lastWorkout: "None", lastWorkoutDate: "None", lastMeal: "None", lastMealDate: "None"});
                readHTMLFile(res, "index.html");
            }
        } catch (error) {
            console.error('Error processing request:', error.message);
        // Close the client (database) once we're done
        } finally {
            client.close();
        }
    } else if (path === "/generateWorkout") {
        readHTMLFile(res, "exercise.html");
        var query = urlObj.query;
        var userEmail = query.email;
        var muscle = query.muscle;

        const currDate = new Date();
        const day = String(currDate.getDate()).padStart(2, '0');
        const month = String(currDate.getMonth() + 1).padStart(2, '0');
        const year = String(currDate.getFullYear()).slice(-2);

        const formattedDate = `${month}/${day}/${year}`;

        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db('HECA');
            const collection = db.collection('users');

            let dbQuery = {email: userEmail};
            console.log(userEmail);
            console.log(muscle);

            const results = await collection.find(dbQuery).toArray();
            if (results.length === 0) {
                console.log("Please register");
            } else {
                await db.collection('users').updateOne({email: userEmail}, {$set: { lastWorkout: muscle, lastWorkoutDate: formattedDate } });
                // API URL with the user's selection
                const apiUrl = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`;

                try {
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'X-Api-Key': 'uJ+0/vWSN0uVmLutNI6F7w==JXyf1UVpze0BshDA',
                        },
                    });

                    if (!response.ok) throw new Error('Failed to fetch workout data.');

                    const data = await response.json();

                    while (data.length < 3) {
                        data.push({
                            name: 'Sample Exercise',
                            muscle: 'N/A',
                            difficulty: 'N/A',
                            instructions: 'N/A',
                        });
                    }

                    // Create structured HTML output
                    const workoutTips = data.map(exercise => `
                        <div class="result-item">
                            <h3>${exercise.name}</h3>
                            <p><strong>Muscle:</strong> ${exercise.muscle}</p>
                            <p><strong>Difficulty:</strong> ${exercise.difficulty}</p>
                            <p><strong>Instructions:</strong> ${exercise.instructions}</p>
                        </div>
                    `).join('');

                    res.write(`
                        <h2>Your Workout Options:</h2>
                        <div class="results-container">
                            ${workoutTips}
                        </div>
                    `);
                } catch (error) {
                    res.write(`
                        <p style="color: red;">Error: Unable to fetch workout data. Please try again later.</p>
                    `);
                    console.error(error);
                }
            }
        // Catch any error in processing a request
        } catch (error) {
            console.error('Error processing request:', error.message);
        // Close the client (database) once we're done
        } finally {
            client.close();
        }
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

