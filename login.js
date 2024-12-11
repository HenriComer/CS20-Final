var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

document.getElementById('loginForm').addEventListener('submit', async function (e) {

    const uri = 'mongodb+srv://connorg2404:Tusd2026@cs20-hw13.be1nl.mongodb.net/?retryWrites=true&w=majority&appName=CS20-HW13';
    const client = new MongoClient(uri);

    await client.connect();
    const db = client.db('HECA');
    const collection = db.collection('users');

    var userEmail = document.getElementById('email').value;
    let dbQuery = {email: userEmail};

    const results = await collection.find(dbQuery).toArray();

    if (results.length === 0) {
        console.log("Please register");
    } else {
        results.forEach((result) => {
            var userPassword = document.getElementById('password').value;
            if (userPassword === result.password) {
                res.writeHead(302, { Location: `/profile.html?email=${userEmail}` });
                res.end();
            }
        });
    }
});