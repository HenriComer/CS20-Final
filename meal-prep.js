document.getElementById('meal-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const MongoClient = require('mongodb').MongoClient;
    const userEmail = document.getElementById('email').value;
    const mealType = document.getElementById('meal-type').value;
    let apiUrl = '';

    const currDate = new Date();
    const day = String(currDate.getDate()).padStart(2, '0');
    const month = String(currDate.getMonth() + 1).padStart(2, '0');
    const year = String(currDate.getFullYear()).slice(-2);

    const formattedDate = `${month}/${day}/${year}`;
    console.log(formattedDate);

    const uri = 'mongodb+srv://connorg2404:Tusd2026@cs20-hw13.be1nl.mongodb.net/?retryWrites=true&w=majority&appName=CS20-HW13';
    client = new MongoClient(uri);
	theQuery = {email: userEmail};
	await client.connect();
	var dbo = client.db("HECA");
	var coll = dbo.collection('users');
	coll.find(theQuery).toArray(async function(err, items) {
	    if (err) {
		    console.log("Please register");
	    } 
	    else {
		    await collection.updateOne({lastMeal: mealType}, {lastMealDate: formattedDate});
	    }  
	})

    client.close();

    // Adjust the API URL based on the user's selection
    if (mealType === 'highCarbs') {
        apiUrl = `https://api.spoonacular.com/recipes/findByNutrients?minCarbs=80&apiKey=fa837a168b164740b4473024d2607764`;
    } else if (mealType === 'highProtein') {
        apiUrl = `https://api.spoonacular.com/recipes/findByNutrients?minProtein=40&apiKey=fa837a168b164740b4473024d2607764`;
    } else if (mealType === 'lowCalories') {
        apiUrl = `https://api.spoonacular.com/recipes/findByNutrients?maxCalories=600&apiKey=fa837a168b164740b4473024d2607764`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch meal data.');

        const data = await response.json();

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

        // Create structured HTML output
        const mealTips = data.map(meal => `
            <div class="result-item">
                <h3>${meal.title}</h3>
                <p><strong>Calories:</strong> ${meal.calories}</p>
                <p><strong>Protein:</strong> ${meal.protein}</p>
                <p><strong>Carbs:</strong> ${meal.carbs}</p>
                <p><strong>Fat:</strong> ${meal.fat}</p>
            </div>
        `).join('');

        document.getElementById('meal-tips').innerHTML = `
            <h2>Your Meal Options:</h2>
            <div class="results-container">
                ${mealTips}
            </div>
        `;
    } catch (error) {
        document.getElementById('meal-tips').innerHTML = `
            <p>Error: Unable to fetch meal data. Please try again later.</p>
        `;
        console.error(error);
    }
});
