import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// This is used to show the dat.gui in the browser
import * as dat from "dat.gui";
import nebula from "./assets/nebula.webp";
const renderer = new THREE.WebGLRenderer();

// This is used to show the shadow of the objects
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// There are two types of camera in Three.js: PerspectiveCamera and OrthographicCamera
// PerspectiveCamera is the most common one and it is used to create a 3D scene
// OrthographicCamera is used to create 2D scenes this have left, right, top, bottom there is no near and far properties because not matter how far or near it looks same

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// The OrbitControls is used to move the camera around the scene
const orbit = new OrbitControls(camera, renderer.domElement);

// 5 is the length of the axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// Initial position of the camera is (0, 0, 0) so we need to move the camera back to see the axes
camera.position.set(-100, 30, 30);
// Update the orbit controls to move the camera to the new position
orbit.update();
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff, 100000);

spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;

// default
spotLight.angle = 0.2;
spotLight.target = sphere;
scene.add(spotLight);
const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xffffff, 0, 200);
// scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// This is used to show the dat.gui in the browser this is used to change the color of the sphere and show the wireframe of the sphere
const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
};
// This is used to change the color of the sphere by changing the color in the dat.gui
gui.addColor(options, "sphereColor").onChange((color) => {
  sphere.material.color.set(color);
});
// This is used to show the wireframe of the sphere by changing the wireframe in the dat.gui
gui.add(options, "wireframe").onChange((wireframe) => {
  sphere.material.wireframe = wireframe;
});
gui.add(options, "speed", 0, 0.1);

let step = 0;
// This is used to show the fog in the scene
// scene.fog = new THREE.Fog(0x000000, 10, 50);
// scene.fog = new THREE.FogExp2(0x000000, 0.1);

renderer.setClearColor(0x0ffeaa00);
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(nebula);
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshStandardMaterial({
  // color: 0x00ff00,
  map: textureLoader.load(nebula),
});
const box2MultiMaterial = [
  new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
  new THREE.MeshStandardMaterial({ color: 0xff0000 }),
  new THREE.MeshStandardMaterial({ color: 0x0000ff }),
  new THREE.MeshStandardMaterial({ color: 0xff00ff }),
  new THREE.MeshStandardMaterial({ color: 0xffff00 }),
  new THREE.MeshStandardMaterial({ color: 0x00ffff }),
];
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);
// The animate function is called 60 times per second and time is passed as an argument
function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;
  step += options.speed;
  sphere.position.y = 20 * Math.abs(Math.sin(step));
  // spotLight.penumbra = 0.5 + Math.sin(step) * 0.5;
  // spotLight.intensity = 1;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
