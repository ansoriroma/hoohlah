document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sendRequest').addEventListener('click', () => {
        // Send a message to the background script to perform the request
        chrome.runtime.sendMessage({ action: 'sendRequest' }, (response) => {
            // Check if response is defined and handle it properly
            if (response) {
                if (response.error) {
                    alert(`Error: ${response.error}`);
                } else if (response.data) {
                    alert(response.data); // Display the formatted count result
                } else {
                    alert('Unexpected response format.');
                }
            } else {
                alert('No response received.');
            }
        });
    });
});
