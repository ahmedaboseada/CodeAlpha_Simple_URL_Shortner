document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const urlInput = document.querySelector('#url');
    const resultDiv = document.querySelector('#result');
    const shortUrlElement = document.querySelector('#shortUrl');
    const successMessage = document.querySelector('#success-message');
    const copyButton = document.querySelector('#result button:first-child');
    const closeButton = document.querySelector('#result button:last-child');

    form.addEventListener('submit', async event => {
        event.preventDefault();

        // Validate input
        if (!urlInput.value.trim()) {
            alert('Please enter a URL');
            return;
        }

        try {
            // Use relative path to ensure it works regardless of domain
            const response = await fetch('/short/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originalUrl: urlInput.value })
            });

            const data = await response.json();

            if (response.ok) {
                // Display the short URL returned from the server
                shortUrlElement.href = data.url;
                shortUrlElement.textContent = data.url;
                successMessage.textContent = data.message;
                resultDiv.classList.remove('hidden');
                resultDiv.style.display = 'block';
            } else {
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        }
    });

    copyButton.addEventListener('click', () => {
        const textArea = document.createElement('textarea');
        const url = shortUrlElement.href;

        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('Copy');
        textArea.remove();

        // Show copy confirmation
        const originalText = copyButton.textContent;
        copyButton.textContent = "Copied!";
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 1500);
    });

    closeButton.addEventListener('click', () => {
        resultDiv.classList.add('hidden');
        resultDiv.style.display = 'none';
        urlInput.value = '';
    });
});
