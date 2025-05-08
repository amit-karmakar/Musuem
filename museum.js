import * as THREE from 'three';

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);  // Initial camera position

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures
const statueTexture = new THREE.TextureLoader().load('texture/statue4.png');
const paintingTexture1 = new THREE.TextureLoader().load('texture/painting.jpg');
const paintingTexture2 = new THREE.TextureLoader().load('texture/painting2.png');
const paintingTexture3 = new THREE.TextureLoader().load('texture/painting3.jpg');
const paintingTexture4 = new THREE.TextureLoader().load('texture/painting4.jpg');
const paintingTexture5 = new THREE.TextureLoader().load('texture/painting5.jpg');
const paintingTexture6 = new THREE.TextureLoader().load('texture/painting6.jpg');
const paintingTexture7 = new THREE.TextureLoader().load('texture/painting7.jpg');
const paintingTexture8 = new THREE.TextureLoader().load('texture/painting8.jpg');
const paintingTexture9 = new THREE.TextureLoader().load('texture/painting9.jpg');
const wallTexture = new THREE.TextureLoader().load('texture/sidewall.jpg');
const roomTexture = new THREE.TextureLoader().load('texture/room-ceiling.jpg');
const floorTexture = new THREE.TextureLoader().load('texture/floortiles.jpg'); // Floor texture

// Create room (walls, floor, ceiling)
const roomGeometry = new THREE.BoxGeometry(10, 5, 10);
const roomMaterials = [
    new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.BackSide }), // Right
    new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.BackSide }), // Left
    new THREE.MeshBasicMaterial({ map: roomTexture, side: THREE.BackSide }), // Ceiling
    new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.BackSide }),  // Floor (added texture)
    new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.BackSide }), // Front
    new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.BackSide })  // Back
];
const room = new THREE.Mesh(roomGeometry, roomMaterials);
scene.add(room);

// Create statue
const statueGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
const statueMaterial = new THREE.MeshBasicMaterial({ map: statueTexture });
const statue = new THREE.Mesh(statueGeometry, statueMaterial);
statue.position.set(0, 1.5, 0); 
scene.add(statue);

// Create a painting (perfectly centered on the front wall)
const paintingGeometry = new THREE.PlaneGeometry(1.5, 2.2);  // Reduced size
const paintingMaterial = new THREE.MeshBasicMaterial({ map: paintingTexture1 });

// Centered painting position
const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
painting.position.set(-4, .75, -4.9);  // Centered on front wall
scene.add(painting);

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 10);
light.position.set(0, 5, 5);
scene.add(light);

// Spotlight for statue
const spotlight = new THREE.SpotLight(0xffffff, 1, 10);
spotlight.position.set(2, 3, 2);
spotlight.target = statue;
scene.add(spotlight);

// Store all painting textures in an array
const paintingTextures = [
    paintingTexture1, paintingTexture2, paintingTexture3, paintingTexture4, 
    paintingTexture5, paintingTexture6, paintingTexture7, paintingTexture8, paintingTexture9
];

let paintingIndex = 0; // Track which painting is shown

// Mouse click to change painting texture one by one
window.addEventListener('click', () => {
    paintingIndex = (paintingIndex + 1) % paintingTextures.length; // Loop through textures
    painting.material.map = paintingTextures[paintingIndex];
    painting.material.needsUpdate = true; // Ensure the update is applied
});

// Zoom In/Out with Mouse Scroll (restricted)
let zoomSpeed = 0.1;
let minZoom = 3;  
let maxZoom = 6;  

window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0 && camera.position.z < maxZoom) {
        camera.position.z += zoomSpeed;
    } else if (event.deltaY < 0 && camera.position.z > minZoom) {
        camera.position.z -= zoomSpeed;
    }
});

// Keyboard interaction to move camera (restricted within bounds)
let cameraSpeed = 0.1;

const bounds = {
    minX: -4,
    maxX: 4,
    minZ: -4,
    maxZ: 4,
    minY: 1,  
    maxY: 5   
};

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (camera.position.z > bounds.minZ) camera.position.z -= cameraSpeed; 
            break;
        case 'ArrowDown':
            if (camera.position.z < bounds.maxZ) camera.position.z += cameraSpeed; 
            break;
        case 'ArrowLeft':
            if (camera.position.x > bounds.minX) camera.position.x -= cameraSpeed; 
            break;
        case 'ArrowRight':
            if (camera.position.x < bounds.maxX) camera.position.x += cameraSpeed; 
            break;
    }
    // Keep camera within vertical bounds
    camera.position.y = Math.max(bounds.minY, Math.min(bounds.maxY, camera.position.y));
});

// Spotlight animation (move around the statue)
let spotlightAngle = 0;
function moveSpotlight() {
    spotlightAngle += 0.01;
    spotlight.position.x = 4 * Math.cos(spotlightAngle);
    spotlight.position.z = 4 * Math.sin(spotlightAngle);
    spotlight.target.updateMatrixWorld();
}

// Statue movement (rotation + slight side movement)
let statueAngle = 0;
function moveStatue() {
    statue.rotation.y += 0.005;  // Slow rotation
    statueAngle += 0.02;
    statue.position.x = Math.sin(statueAngle) * 0.2;  // Slight side-to-side movement
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    moveSpotlight();
    moveStatue();

    renderer.render(scene, camera);
}

animate();




















