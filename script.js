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
        imageList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('thumbnail');
                img.setAttribute('draggable', true);
                img.addEventListener('dragstart', drag);
                imageList.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    function drag(event) {
        event.dataTransfer.setData('text/plain', event.target.src);
    }

    imageList.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    imageList.addEventListener('drop', (event) => {
        event.preventDefault();
        const draggedSrc = event.dataTransfer.getData('text');
        const draggedElement = document.querySelector(`[src="${draggedSrc}"]`);
        const dropTarget = event.target.closest('.thumbnail');
        if (dropTarget && draggedElement !== dropTarget) {
            const draggedIndex = Array.from(imageList.children).indexOf(draggedElement);
            const dropIndex = Array.from(imageList.children).indexOf(dropTarget);
            if (draggedIndex < dropIndex) {
                dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
            } else {
                dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
            }
            [selectedFiles[draggedIndex], selectedFiles[dropIndex]] = [selectedFiles[dropIndex], selectedFiles[draggedIndex]];
        }
    });

    createButton.addEventListener('click', () => {
        createButton.disabled = true;
        progressContainer.style.display = 'block';
        simulateVideoCreation();
    });

    function simulateVideoCreation() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                downloadLink.style.display = 'inline-block';
                createButton.disabled = false;
            }
        }, 500);
    }
});