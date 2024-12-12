// Packages/Dependencies
var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
var fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 3000;
// var port = 8080;

// MongoDB connection URI
const uri = 'mongodb+srv://connorg2404:Tusd2026@cs20-hw13.be1nl.mongodb.net/?retryWrites=true&w=majority&appName=CS20-HW13';

// Create the server
http.createServer(async function (req, res) {
    var urlObj = url.parse(req.url, true);
    var path = urlObj.pathname;

    // Path to index.html
    if (path === "/" || path.startsWith("/index.html")) {
        readHTMLFile(res, "index.html");
    // Path to meal-prep
    } else if (path.startsWith("/meal-prep.html")) {
        readHTMLFile(res, "meal-prep.html");
    // Path to exercise.html
    } else if (path.startsWith("/exercise.html")) {
        readHTMLFile(res, "exercise.html");
    // Path to contact.html
    } else if (path.startsWith("/contact.html")) {
        readHTMLFile(res, "contact.html");
    // Path to profile
    } else if (path.startsWith("/profile.html")) {
        readHTMLFile(res, "profile.html");
    // Path to register
    } else if (path.startsWith("/register.html")) {
        readHTMLFile(res, "register.html");
    // Path to style
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
    // Path to contact
    } else if (path === "/contact.js") {
        readCodeFile(res, "contact.js");
    // Path to generateMeal
    } else if (path === "/generateMeal") {
        var query = urlObj.query;
        var userEmail = query.email;
        var userMeal = query.mealType;

        // Set the date for database entry
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
            console.log(userMeal);

            const results = await collection.find(dbQuery).toArray();
            // Check for valid email address entry
            if (results.length === 0) {
                readHTMLFile(res, "wrongMeal.html");
            } else {
                await db.collection('users').updateOne({email: userEmail}, {$set: { lastMeal: userMeal, lastMealDate: formattedDate } });

                // Get and display results
                apiUrl = `https://api.spoonacular.com/recipes/findByNutrients?minCarbs=80&apiKey=fa837a168b164740b4473024d2607764`;
                const results = await fetch(apiUrl);
                const data = await results.json();

                // Handle cases where fewer than three results are returned
                while (data.length < 3) {
                    data.push({
                        title: 'Sample Meal',
                        calories: 'N/A',
                        protein: 'N/A',
                        carbs: 'N/A',
                        fat: 'N/A',
                    });
                }
                
                // Set variables to output to user
                const mealTips = data.map(meal => `
                    <div class="result-item" style="border: solid #d72638; text-align: center; background-color: #f4e7de;">
                        <h3>${meal.title}</h3>
                        <p><strong>Calories:</strong> ${meal.calories}</p>
                        <p><strong>Protein:</strong> ${meal.protein}</p>
                        <p><strong>Carbs:</strong> ${meal.carbs}</p>
                        <p><strong>Fat:</strong> ${meal.fat}</p>
                    </div>
                `).join('');

                res.write('<h1 style="text-align: center;">Meal suggestions</h1>');
                res.write(mealTips);
                res.write('<div class="to-home" style="text-align: center; font-size: 30px;"><a href="/">Back to Home</a></div>');
                res.end();
            }
        } catch (error) {
            console.error('Error processing request:', error.message);
        // Close the client (database) once we're done
        } finally {
            client.close();
        }
    } else if (path === "/showProfile") {
        var query = urlObj.query;
        var newEmail = query.email;

        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db('HECA');
            const collection = db.collection('users');

            let dbQuery = {email: newEmail};
            console.log(newEmail);

            const results = await collection.find(dbQuery).toArray();

            // Check for valid email address and display user information
            if (results.length === 0) {
                readHTMLFile(res, "noEmail.html");
            } else {
                res.write('<h1 style="text-align: center; font-size: 40px"> Profile </h1>');
                results.forEach(function(result) {
                    res.write('<div class="info" style="border: solid #d72638; text-align: center; background-color: #f4e7de; font-size: 20px">');
                    res.write('<p> Name: '+ result.name + '</p>');
                    res.write('<p> Email: '+ result.email + '</p>');
                    res.write('<p> Last Workout: '+ result.lastWorkout + '</p>');
                    res.write('<p> Last Workout Date: '+ result.lastWorkoutDate + '</p>');
                    res.write('<p> Last Meal: '+ result.lastMeal + '</p>');
                    res.write('<p> Last Meal Date: '+ result.lastMealDate + '</p>');
                    res.write('</div>');
                    res.write('<div class="to-home" style="text-align: center; font-size: 24px;"><a href="/">Back to Home</a></div>');
                });
            }
        } catch (error) {
            console.error('Error processing request:', error.message);
        // Close the client (database) once we're done
        } finally {
            client.close();
        }
    // Path to registerAccount
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
                readHTMLFile(res, "accountCreated.html");
            }
        } catch (error) {
            console.error('Error processing request:', error.message);
        // Close the client (database) once we're done
        } finally {
            client.close();
        }
    // Path to generateWorkout
    } else if (path === "/generateWorkout") {
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
                readHTMLFile(res, "wrongWorkout.html");
            } else {
                await db.collection('users').updateOne({email: userEmail}, {$set: { lastWorkout: muscle, lastWorkoutDate: formattedDate } });
                
                apiExerciseUrl = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`;
                const exerciseResults = await fetch(apiExerciseUrl, {
                    method: 'GET',
                    headers: {
                        'X-Api-Key': 'uJ+0/vWSN0uVmLutNI6F7w==JXyf1UVpze0BshDA',
                    },
                });
        
                if (!exerciseResults.ok) throw new Error('Failed to fetch workout data.');

                const exerciseData = await exerciseResults.json();

                // Handle cases where fewer than three results are returned
                while (exerciseData.length < 3) {
                    exerciseData.push({
                        name: 'Sample Exercise',
                        muscle: 'N/A',
                        difficulty: 'N/A',
                        instructions: 'N/A',
                    });
                }

                console.log(exerciseData.length);;
                
                // Set variables to output to user
                const workoutTips = exerciseData.map(exercise => `
                    <div class="result-item" style="border: solid #d72638; text-align: center; background-color: #f4e7de;">
                        <h3>${exercise.name}</h3>
                        <p><strong>Muscle:</strong> ${exercise.muscle}</p>
                        <p><strong>Difficulty:</strong> ${exercise.difficulty}</p>
                        <p><strong>Instructions:</strong> ${exercise.instructions}</p>
                    </div>
                `).join('');

                res.write('<h1 style="text-align: center;">Workout suggestions</h1>');
                res.write(workoutTips);
                res.write('<div class="to-home" style="text-align: center; font-size: 30px;"><a href="/">Back to Home</a></div>');
                res.end();
            } 
            
        } catch (error) {
            console.error('Error processing request:', error.message);
        // Close the client (database) once we're done
        } finally {
            client.close();
        }
    // Path to Images
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

// Function to read from HTML files
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

// Function to read from Node.js files
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

