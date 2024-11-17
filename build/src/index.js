import { mat4 } from 'gl-matrix';
import { initScene } from './scene.js';
import { createPerfumeBottle } from './perfume.js';
import { createBookshelf } from './bookshelf.js';
import { createFloor } from './floor.js';

let animationId;
let isAnimating = false;
let startTime = null;
const ANIMATION_DURATION = 5000; // 5 seconds

function main() {
    const canvas = document.querySelector('#glCanvas');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: true });

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Initialize scene with models
    const scene = initScene(gl);
    const perfume = createPerfumeBottle(gl);
    const bookshelf = createBookshelf(gl);
    const floor = createFloor(gl);

    // Set initial positions
    perfume.position = [0.5, 0.35, 2]; // Adjusted start position slightly lower
    bookshelf.position = [0, 0, -2]; // Bookshelf position
    floor.position = [0, -1, 0]; // Floor position below everything

    // Add models to scene
    scene.addModel(floor);
    scene.addModel(bookshelf);
    scene.addModel(perfume);

    function renderLoop() {
        scene.render();
        requestAnimationFrame(renderLoop);
    }

    // Animation controls
    const toggleButton = document.getElementById('toggleAnimation');
    toggleButton.addEventListener('click', () => {
        isAnimating = !isAnimating;
        toggleButton.textContent = isAnimating ? 'Stop Animation' : 'Start Animation';
        
        if (isAnimating) {
            startTime = performance.now();
            updateAnimation(performance.now());
        }
    });

    function updateAnimation(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

        if (progress < 1) {
            // Easing function for smooth movement
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            // Move perfume bottle to the middle shelf
            const startZ = 2;
            const endZ = -2.0; // Move further into the shelf
            const startY = 0.; // Starting lower
            const endY = 0.16; // Keep Y position constant for middle shelf
            
            const z = startZ - (easeProgress * (startZ - endZ));
            const y = startY - (easeProgress * (startY - endY));
            
            // Maintain x position for proper shelf alignment
            perfume.position[0] = 0.5;
            perfume.position[1] = y;
            perfume.position[2] = z;
            
            // Smooth rotation during movement
            perfume.rotation = easeProgress * Math.PI * 2;

            if (isAnimating) {
                requestAnimationFrame(updateAnimation);
            }
        } else {
            isAnimating = false;
            toggleButton.textContent = 'Start Animation';
            // Ensure final position is exact
            perfume.position = [0.5, 0.16, -2.0];
            perfume.rotation = Math.PI * 2;
        }
    }

    // Start continuous render loop
    renderLoop();
}

// Start the application
main();