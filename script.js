document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const selectButton = document.getElementById('selectButton');
    const imageList = document.getElementById('imageList');
    const createButton = document.getElementById('createButton');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const downloadLink = document.getElementById('downloadLink');
    let selectedFiles = [];

    selectButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        selectedFiles = selectedFiles.concat(files.slice(0, 100 - selectedFiles.length));
        displayImages();
        createButton.disabled = selectedFiles.length === 0;
    });

    function displayImages() {
        // ... (previous displayImages function remains the same)
    }

    // ... (previous drag and drop functionality remains the same)

    createButton.addEventListener('click', () => {
        createButton.disabled = true;
        progressContainer.style.display = 'block';
        createVideo();
    });

    async function createVideo() {
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ log: true });

        try {
            await ffmpeg.load();

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const arrayBuffer = await file.arrayBuffer();
                ffmpeg.FS('writeFile', `image_${i}.jpg`, new Uint8Array(arrayBuffer));
                updateProgress((i + 1) / selectedFiles.length * 50);
            }

            await ffmpeg.run('-framerate', '1/5', '-i', 'image_%d.jpg', '-c:v', 'libx264', '-r', '30', '-pix_fmt', 'yuv420p', 'output.mp4');
            updateProgress(75);

            const data = ffmpeg.FS('readFile', 'output.mp4');
            const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(videoBlob);

            downloadLink.href = videoUrl;
            downloadLink.style.display = 'inline-block';
            updateProgress(100);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the video');
        } finally {
            createButton.disabled = false;
        }
    }

    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${Math.round(percent)}%`;
    }
});
