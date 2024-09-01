// ... (previous code remains the same)

async function createVideo() {
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    try {
        console.log('Loading FFmpeg...');
        await ffmpeg.load();
        console.log('FFmpeg loaded successfully');

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            console.log(`Processing image ${i + 1}/${selectedFiles.length}`);
            const arrayBuffer = await file.arrayBuffer();
            ffmpeg.FS('writeFile', `image_${i}.jpg`, new Uint8Array(arrayBuffer));
            updateProgress((i + 1) / selectedFiles.length * 50);
        }

        console.log('Running FFmpeg command...');
        await ffmpeg.run('-framerate', '1/5', '-i', 'image_%d.jpg', '-c:v', 'libx264', '-r', '30', '-pix_fmt', 'yuv420p', 'output.mp4');
        console.log('FFmpeg command completed');

        updateProgress(75);

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);

        downloadLink.href = videoUrl;
        downloadLink.style.display = 'inline-block';
        updateProgress(100);
        console.log('Video created successfully');
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
        alert(`An error occurred while creating the video: ${error.message}`);
    } finally {
        createButton.disabled = false;
    }
}

// ... (rest of the code remains the same)
