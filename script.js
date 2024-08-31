document.addEventListener('DOMContentLoaded', function() {
    // ... (previous code remains the same)

    createButton.addEventListener('click', () => {
        createButton.disabled = true;
        progressContainer.style.display = 'block';
        createVideo();
    });

    async function createVideo() {
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch('http://127.0.0.1:5000', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Server response was not ok');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.style.display = 'inline-block';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the video');
        } finally {
            createButton.disabled = false;
            progressBar.style.width = '100%';
            progressBar.textContent = '100%';
        }
    }
});
