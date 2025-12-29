import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
camera.position.set(0, 0, 5); // Mírně dál pro jistotu

/* RENDERER */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

/* SVĚTLA */
scene.add(new THREE.AmbientLight(0xffffff, 1.2)); // Zvýšená intenzita

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

/* MODEL */
let model;
const loader = new GLTFLoader();
loader.load(
  'img/robot.glb', // Zkontrolujte, zda nemáte na začátku lomítko navíc
  (gltf) => {
    model = gltf.scene;

    // --- CENTROVÁNÍ MODELU ---
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x += (model.position.x - center.x);
    model.position.y += (model.position.y - center.y);
    model.position.z += (model.position.z - center.z);
    // -------------------------

    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);
  },
  undefined,
  (error) => console.error("Chyba načítání:", error)
);

/* INTERAKCE MYŠI */
let mouseX = 0;
let mouseY = 0;

// Posloucháme pohyb myši na celém okně, ale počítáme relativně ke středu containeru
window.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  // Výpočet relativně ke středu kontejneru
  mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
});

/* ANIMACE */
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    // Plynulé otáčení podle myši
    model.rotation.y += (mouseX * 0.8 - model.rotation.y) * 0.05;
    model.rotation.x += (-mouseY * 0.8 - model.rotation.x) * 0.05;
  }

  renderer.render(scene, camera);
}
animate();

/* RESIZE FIX */
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});