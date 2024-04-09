import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
const loader = new GLTFLoader();

loader.load(
  "./mustang/scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Animation loop to render the scene every frame  this is done using requestAnimationFrame function
//This function runs 60 times per second and updates the scene
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();
