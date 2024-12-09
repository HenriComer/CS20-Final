document.getElementById('workout-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const workoutType = document.getElementById('workout-type').value;
    const intensity = document.getElementById('intensity').value;

    const response = await fetch(`https://workoutapi.example.com/exercises?goal=${workoutType}&intensity=${intensity}&apiKey=YOUR_API_KEY`);
    const data = await response.json();

    const workoutTips = data.tips ? data.tips.map(tip => `<p>${tip}</p>`).join('') : "<p>No tips found. Please try different preferences.</p>";

    document.getElementById('workout-tips').innerHTML = `<h2>Your Workout Tips:</h2> ${workoutTips}`;
});
