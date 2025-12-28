import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('model');

/* SCÉNA */
const scene = new THREE.Scene();

/* KAMERA */
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.set(0, 0, 4);

/* RENDERER */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

/* SVĚTLA */
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

/* MODEL */
let model;

const loader = new GLTFLoader();
loader.load(
  '/img/model.glb', // upravte cestu podle reality
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1.2, 1.2, 1.2);
    scene.add(model);
  }
);

/* INTERAKCE MYŠI */
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
});

/* ANIMACE */
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += (mouseX * 0.5 - model.rotation.y) * 0.05;
    model.rotation.x += (-mouseY * 0.5 - model.rotation.x) * 0.05;
  }

  renderer.render(scene, camera);
}

animate();

/* RESIZE */
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});