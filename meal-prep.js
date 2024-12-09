document.getElementById('diet-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const dietType = document.getElementById('diet-type').value;
    const allergies = document.getElementById('allergies').value;

    const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?diet=${dietType}&excludeIngredients=${allergies}&apiKey=YOUR_API_KEY`);
    const data = await response.json();

    const dietTips = data.items ? data.items.map(item => `<p>${item.title}</p>`).join('') : "<p>No tips found. Please try different preferences.</p>";

    document.getElementById('diet-tips').innerHTML = `<h2>Your Diet Tips:</h2> ${dietTips}`;
});
