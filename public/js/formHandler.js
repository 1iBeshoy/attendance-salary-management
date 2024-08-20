document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(form);
            const formObject = {};

            // Convert FormData to JSON
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            const endpoint = form.getAttribute('action'); // Get the form's action attribute to determine the API endpoint
            const method = form.getAttribute('method') || 'POST'; // Get the form's method or default to POST

            fetch(endpoint, {
                method: method.toUpperCase(),
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            }).then(res => {
                res.json().then((res) => {
                    if(res.success) {
                        window.location.href = "/employees";
                    } else {
                        alert(res.message);
                    }
                })
            }).catch(error => {
                console.error('Form submission error:', error);
            });
        });
    });
});