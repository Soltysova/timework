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

/* MODEL */
let head; 

const loader = new GLTFLoader();
loader.load(
  'img/robot.glb', 
  (gltf) => {
    const model = gltf.scene;

    // --- CENTROVÁNÍ MODELU STANDARDNÍ METODOU ---
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    // ------------------------------------------

    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);

    head = model.getObjectByName('hlava');

    const setRot = (name, x, y = 0, z = 0) => {
      const obj = model.getObjectByName(name);
      if (obj) {
        obj.rotation.x = x;
        obj.rotation.y = y;
        obj.rotation.z = z;
      }
    };

    // NASTAVENÍ POZICE RUKOU (Snad už správně dolů)
    setRot('rrameno', Math.PI / 2); // 90 stupňů dolů
    setRot('rruka', 0); 
    setRot('rloket', 0); 
    setRot('rzapesti', 0);
    setRot('rdlan', 0);

    setRot('lrameno', Math.PI / 2); // 90 stupňů dolů
    setRot('lruka', 0);
    setRot('lloket', 0);
    setRot('lzapesti', 0);
    setRot('ldlan', 0);

    setRot('rprst', 0.2); 
    setRot('lprst', 0.2);

    if (!head) console.warn('Kost "hlava" nebyla nalezena');
  },
  undefined,
  (error) => console.error("Chyba načítání:", error)
);

/* INTERAKCE MYŠI */
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Plane(new THREE.Vector3(0, 0, 1), -2));
const intersection = new THREE.Vector3();

window.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
});

/* ANIMACE */
function animate() {
  requestAnimationFrame(animate);

  if (head) {
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersection);

    const target = new THREE.Vector3(
      intersection.x,
      intersection.y,
      head.getWorldPosition(new THREE.Vector3()).z
    );

    head.lookAt(target);
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
