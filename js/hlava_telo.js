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
camera.position.set(0, 0, 5); 

/* RENDERER */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

/* SVĚTLA */
scene.add(new THREE.AmbientLight(0xffffff, 1.2)); 

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

/* MODELY */
let headModel; // Celý model hlavy
let bodyModel; // Celý model těla

const loader = new GLTFLoader();

// --- NAČTENÍ TĚLA ROBOTA ---
loader.load(
  'img/robot_body.glb', 
  (gltf) => {
    bodyModel = gltf.scene;

    // Centrování těla
    const box = new THREE.Box3().setFromObject(bodyModel);
    box.getCenter(bodyModel.position).multiplyScalar(-1);
    
    // POSUNUTÍ MODELU DOLEVA A DOLŮ (nastav si hodnoty dle potřeby)
    bodyModel.position.x = -1.2;
    bodyModel.position.y = -0.5;

    bodyModel.scale.set(1.5, 1.5, 1.5);
    scene.add(bodyModel);
  },
  undefined,
  (error) => console.error("Chyba načítání těla:", error)
);

// --- NAČTENÍ HLAVY ROBOTA ---
loader.load(
  'img/head.glb', 
  (gltf) => {
    headModel = gltf.scene;

    // Centrování modelu hlavy (pro vlastní pivot point)
    const box = new THREE.Box3().setFromObject(headModel);
    box.getCenter(headModel.position).multiplyScalar(-1);

    // POSUNUTÍ HLAVY NAD TĚLO ROBOTA
    // Tyto hodnoty musíš doladit tak, aby hlava seděla na krku
    headModel.position.x = -1.2; 
    headModel.position.y = 1.0; 
    
    headModel.scale.set(1.5, 1.5, 1.5);
    scene.add(headModel);
  },
  undefined,
  (error) => console.error("Chyba načítání hlavy:", error)
);


/* INTERAKCE MYŠI */
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
const intersection = new THREE.Vector3();

window.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
});

/* ANIMACE */
function animate() {
  requestAnimationFrame(animate);

  // Otáčení POUZE modelu hlavy
  if (headModel) {
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersection);

    const target = new THREE.Vector3(
      intersection.x,
      intersection.y,
      headModel.getWorldPosition(new THREE.Vector3()).z
    );

    headModel.lookAt(target);
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
