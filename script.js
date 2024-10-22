const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const pixels = {};

// Create 20,000 pixels
for (let i = 0; i < 20000; i++) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.dataset.index = i;
    pixel.style.backgroundColor = '#fff'; // default color
    pixel.addEventListener('click', handlePixelClick);
    pixel.addEventListener('touchstart', handlePixelClick); // Handle touch events
    canvas.appendChild(pixel);
}

// Function to handle pixel clicks
function handlePixelClick(event) {
    const pixel = event.target;
    const color = colorPicker.value;
    pixel.style.backgroundColor = color;

    // Save pixel color to backend
    fetch('/update-pixel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: pixel.dataset.index, color })
    });
}

// Load existing pixel colors
fetch('/pixels')
    .then(response => response.json())
    .then(data => {
        data.forEach(pixel => {
            const pixelDiv = canvas.children[pixel.index];
            pixelDiv.style.backgroundColor = pixel.color;
        });
    });
