const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const colorPalette = document.querySelectorAll('.colorBox');
const pixelSize = 10; // Pixel size for the canvas
let currentColor = '#000000'; // Default color
let isDrawing = false;

// Set up the canvas grid
function drawGrid() {
    for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = 0; y < canvas.height; y += pixelSize) {
            ctx.strokeRect(x, y, pixelSize, pixelSize);
        }
    }
}

// Activate a color from the palette
colorPalette.forEach(colorBox => {
    colorBox.addEventListener('click', function() {
        currentColor = this.getAttribute('data-color');
    });
});

// Start drawing when the mouse is pressed
canvas.addEventListener('mousedown', function() {
    isDrawing = true;
});

// Stop drawing when the mouse is released
canvas.addEventListener('mouseup', function() {
    isDrawing = false;
});

// Handle the drawing on the canvas
canvas.addEventListener('mousemove', function(event) {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / pixelSize) * pixelSize;
        const y = Math.floor((event.clientY - rect.top) / pixelSize) * pixelSize;

        // Draw the pixel
        ctx.fillStyle = currentColor;
        ctx.fillRect(x, y, pixelSize, pixelSize);

        // Save the pixel data
        savePixelState(x, y, currentColor);
    }
});

// Save pixel state to localStorage
function savePixelState(x, y, color) {
    let pixelData = JSON.parse(localStorage.getItem('pixelData')) || {};
    pixelData[`${x},${y}`] = color;
    localStorage.setItem('pixelData', JSON.stringify(pixelData));
}

// Load saved pixels when the page loads
function loadPixelState() {
    let pixelData = JSON.parse(localStorage.getItem('pixelData')) || {};
    for (let key in pixelData) {
        const [x, y] = key.split(',').map(Number);
        ctx.fillStyle = pixelData[key];
        ctx.fillRect(x, y, pixelSize, pixelSize);
    }
}

// Initialize the grid and load any saved pixels
drawGrid();
loadPixelState();
