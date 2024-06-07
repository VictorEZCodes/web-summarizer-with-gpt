document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('urlForm');
    const urlInput = document.getElementById('urlInput');
    const summaryOutput = document.getElementById('summaryOutput');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const url = urlInput.value;

        summaryOutput.textContent = 'Loading...';

        fetch('/summarize', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                summaryOutput.textContent = data.summary || 'Error: Could not get a summary.';
            })
            .catch(error => {
                console.error('Error:', error);
                summaryOutput.textContent = 'Error: Could not connect to the server.';
            });
    });
});
