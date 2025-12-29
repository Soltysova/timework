import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 1. Nastavení rendereru
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff);

// 2. Scéna a kamera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 2.5);
camera.lookAt(scene.position);

// 3. Osvětlení
const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(0, 20, 20);
scene.add(light);

const aLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(aLight);

// 4. Proměnné pro sledování myši a kost hlavy
let head; // Sedmá proměnná pro kost hlavy
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// 5. Načtení modelu (pouze jednou!)
const loader = new GLTFLoader();
loader.load('/img/robot.glb', function (glb) {
  const model = glb.scene;
  scene.add(model);
  model.position.y -= 1;

  // Přiřazení kosti hlavy podle jména v modelu
  head = model.getObjectByName('hlava');
});

// 6. Logika pohybu myši
window.addEventListener('mousemove', function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  
  raycaster.setFromCamera(mousePosition, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);

  // Otáčení hlavy směrem k průsečíku s fixní Z hloubkou (hodnota 2)
  if (head) {
    head.lookAt(intersectionPoint.x, intersectionPoint.y, 2);
  }
});

// 7. Animační smyčka
function animate(time) {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// 8. Responzivita okna
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
