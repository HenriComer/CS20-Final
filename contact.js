document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simulate sending the message (in a real app, you would send this data to a server)
    document.getElementById('form-response').innerHTML = `
        <p>Thank you, ${name}. Your message has been sent. We'll get back to you at ${email} soon!</p>
    `;

    // Clear the form
    document.getElementById('contact-form').reset();
});
