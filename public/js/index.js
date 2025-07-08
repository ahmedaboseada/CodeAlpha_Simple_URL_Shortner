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

        try {
            // The API endpoint remains the same
            const response = await fetch('/short/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originalUrl: urlInput.value })
            });

            const data = await response.json();

            if (response.ok) {
                // URL will already be in the correct format from the server
                shortUrlElement.href = data.url;
                shortUrlElement.textContent = data.url;
                successMessage.textContent = data.message;
                resultDiv.classList.remove('hidden');
                resultDiv.style.display = 'block';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
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
