// Packages/Dependencies
var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

document.getElementById('workout-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const userEmail = document.getElementById('email').value;
    const muscle = document.getElementById('muscle').value;

    // Get the current date
    const currDate = new Date();
    const day = String(currDate.getDate()).padStart(2, '0');
    const month = String(currDate.getMonth() + 1).padStart(2, '0');
    const year = String(currDate.getFullYear()).slice(-2);

    const formattedDate = `${month}/${day}/${year}`;
    console.log('Formatted Date:', formattedDate);

    // MongoDB connection using fetch API
    const uri = 'mongodb+srv://connorg2404:Tusd2026@cs20-hw13.be1nl.mongodb.net/?retryWrites=true&w=majority&appName=CS20-HW13';

    try {
        const response = await fetch(uri, {
            method: 'POST', // Assuming MongoDB server accepts POST requests for connection
        });
        const mongoClient = await response.json();

        if (mongoClient) {
            const db = mongoClient.db("HECA");
            const usersCollection = db.collection('users');
            const theQuery = { email: userEmail };

            const user = await usersCollection.findOne(theQuery);
            if (user) {
                await usersCollection.updateOne(
                    { email: userEmail },
                    { $set: { lastWorkout: muscle, lastWorkoutDate: formattedDate } }
                );
                console.log('User updated:', user);
            } else {
                console.log("Please register");
            }
        } else {
            console.log("Failed to connect to MongoDB");
        }
    } catch (err) {
        console.error("Database error: ", err);
    }

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

        document.getElementById('workout-tips').innerHTML = `
            <h2>Your Workout Options:</h2>
            <div class="results-container">
                ${workoutTips}
            </div>
        `;
    } catch (error) {
        document.getElementById('workout-tips').innerHTML = `
            <p style="color: red;">Error: Unable to fetch workout data. Please try again later.</p>
        `;
        console.error(error);
    }
});