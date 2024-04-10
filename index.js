import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// This is used to show the dat.gui in the browser
import * as dat from "dat.gui";
import nebula from "./assets/nebula.webp";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const mastangUrl = new URL("./mustang/scene.gltf", import.meta.url);
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

spotLight.angle = 0.2;

scene.add(spotLight);
const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xffffff, 0, 200);
// scene.fog = new THREE.FogExp2(0xffffff, 0.01);

const assetLoader = new GLTFLoader();
assetLoader.load(
  mastangUrl.href,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0);
  },
  undefined,
  (error) => {}
);

// This is used to show the dat.gui in the browser this is used to change the color of the sphere and show the wireframe of the sphere
const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0.5,
  intensity: 100000,
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
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 100000, 500000);

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
box2.name = "theBox";
// This is used to store a 2d point x,y
const mousePosition = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
// Raycaster is used to detect the objects between source and the camera
const raycaster = new THREE.Raycaster();
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshStandardMaterial({
  color: "white",
  wireframe: true,
  // side: THREE.DoubleSide,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] += 10 * Math.random();
plane2.geometry.attributes.position.needsUpdate = true;

const sphere2Geometry = new THREE.SphereGeometry(4);

const vShader = `
    void main(){
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
    }
`;
const fShader = `
    void main(){
      gl_FragColor=vec4(0.5,0.5,1.0,1.0);
    }
`;
const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: vShader,
  fragmentShader: fShader,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);
// The animate function is called 60 times per second and time is passed as an argument
function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;
  step += options.speed;
  sphere.position.y = 20 * Math.abs(Math.sin(step));
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  spotLight.angle = options.angle;
  // Setting the source as the mouse position and the camera
  raycaster.setFromCamera(mousePosition, camera);
  // Find the intersection objects
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    // Change the color of the sphere if the sphere is intersected
    if (intersects[i].object.id === sphere.id) {
      intersects[i].object.material.color.set(0xff0000);
    }
    // Change the color of the box if the box is intersected
    if (intersects[i].object.name === "theBox") {
      intersects[i].object.rotation.x = time / 1000;
      intersects[i].object.rotation.y = time / 1000;
    }
  }
  plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
  plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
  plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
  const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
  plane2.geometry.attributes.position.array[lastPointZ] += 10 * Math.random();
  plane2.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
