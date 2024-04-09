import * as THREE from "three";

// To render the scene, we need a camera and a renderer
// Scene
const scene = new THREE.Scene();
//Camera
const camera = new THREE.PerspectiveCamera(
  // Field of view
  75,
  // Aspect ratio
  window.innerWidth / window.innerHeight,
  // Near clipping plane the camera cannot see before this
  0.1,
  // Far clipping plane the camera cannot see beyond this
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer();
// Set the size of the renderer to the size of the window
renderer.setSize(window.innerWidth, window.innerHeight);
// Add the renderer to the document
document.body.appendChild(renderer.domElement);
// Set the position of the camera
const geometry = new THREE.BoxGeometry(1, 1, 1);
// Create a material this is how the object will look like this is used for the color
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// Create a mesh this takes the material and applies to the geometry
const cube = new THREE.Mesh(geometry, material);
// Add the cube to the scene
scene.add(cube);
// Set the position of the camera
camera.position.z = 5;

// Animation loop to render the scene every frame  this is done using requestAnimationFrame function
//This function runs 60 times per second and updates the scene
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
