const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const colorPalette = document.querySelectorAll('.colorBox');
const colorPicker = document.getElementById('colorPicker');
const pixelSize = 1; // Each pixel is 1x1 pixels
let currentColor = '#000000'; // Default color
let isDrawing = false;

// Set up the canvas to fill the entire screen
function setCanvasSize() {
    canvas.width = window.innerWidth; // Full width of the screen
    canvas.height = window.innerHeight; // Full height of the screen
}

// Set up the canvas grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF"; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Activate a color from the palette
colorPalette.forEach(colorBox => {
    colorBox.addEventListener('click', function() {
        currentColor = this.getAttribute('data-color');
    });
});

// Activate color from color picker
colorPicker.addEventListener('input', function() {
    currentColor = this.value;
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
        const x = Math.floor((event.clientX - rect.left) / pixelSize);
        const y = Math.floor((event.clientY - rect.top) / pixelSize);

        // Draw the pixel
        ctx.fillStyle = currentColor;
        ctx.fillRect(x, y, pixelSize, pixelSize);

        // Save the pixel data
        savePixelState(x, y, currentColor);
    }
});

// Handle touch events for mobile support
canvas.addEventListener('touchstart', function(event) {
    event.preventDefault(); // Prevent scrolling
    isDrawing = true;
    handleTouch(event);
});

canvas.addEventListener('touchend', function() {
    isDrawing = false;
});

canvas.addEventListener('touchmove', function(event) {
    if (isDrawing) {
        handleTouch(event);
    }
});

// Handle drawing on touch devices
function handleTouch(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = Math.floor((touch.clientX - rect.left) / pixelSize);
    const y = Math.floor((touch.clientY - rect.top) / pixelSize);

    // Draw the pixel
    ctx.fillStyle = currentColor;
    ctx.fillRect(x, y, pixelSize, pixelSize);

    // Save the pixel data
    savePixelState(x, y, currentColor);
}

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

// Initialize the canvas size and load the state
setCanvasSize();
drawGrid();
loadPixelState();

// Update canvas size on window resize
window.addEventListener('resize', () => {
    setCanvasSize();
    loadPixelState(); // Re-load saved pixels after resize
});
