const loginFormHandler = async (event) => {
    event.preventDefault();

    // Collect values from the login form
    const userName = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (userName && password) {
        // Send a POST request to the API endpoint
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ userName, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            //document.location.replace('/notes');
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
};

document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);

