document.getElementById('workout-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const muscle = document.getElementById('muscle').value;

    // API URL with the user's selection
    const apiUrl = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Api-Key': 'uJ+0/vWSN0uVmLutNI6F7w==JXyf1UVpze0BshDA', // Replace with your actual API key
            },
        });

        if (!response.ok) throw new Error('Failed to fetch workout data.');

        const data = await response.json();

        // Ensure at least three results for consistent layout
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
