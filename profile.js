var http = require('http');
var url = require('url');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

document.getElementById('workout-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const userEmail = document.getElementById('email').value;
    const uri = 'mongodb+srv://connorg2404:Tusd2026@cs20-hw13.be1nl.mongodb.net/?retryWrites=true&w=majority&appName=CS20-HW13';

    try {
        const response = await fetch(uri, {
            method: 'GET',
        });
        const mongoClient = await response.json();
        
        const data = await response.json();
        document.getElementById('username').value = data.username;
        document.getElementById('lastMeal').value = data.lastMeal;
        document.getElementById('lastMealDate').value = data.lastMealDate;
        document.getElementById('lastExercise').value = data.lastExercise;
        document.getElementById('lastWorkoutDate').value = data.lastWorkoutDate;
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
})