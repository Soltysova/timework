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

    // 1. Centrování modelu v boxu
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);

    // 2. Najdi kost hlavy (název "hlava" dle tvého zadání)
    head = model.getObjectByName('hlava');

    // Pomocná funkce pro rotaci
    const setRot = (name, x, z = 0) => {
      const obj = model.getObjectByName(name);
      if (obj) {
        obj.rotation.x = x;
        obj.rotation.z = z;
      }
    };

    // 3. RUCE U TĚLA (nastavení rotací na 0 zajistí, že paže visí dolů)
    // Pravá ruka
    setRot('RightArm_51', 0);
    setRot('RightForeArm_50', 0);
    
    // Levá ruka
    setRot('LeftArm_27', 0);
    setRot('LeftForeArm_26', 0);

    // Prsty (ponechány v přirozené, lehce pokrčené poloze)
    setRot('RightHandThumb1_32', -0.2);
    setRot('RightHandThumb2_31', 0.3);
    setRot('RightHandThumb3_30', 0.3);
    setRot('RightHandIndex1_36', 0.2);
    setRot('RightHandIndex2_35', 0.3);
    setRot('RightHandIndex3_34', 0.3);
    setRot('RightHandMiddle1_40', 0.2);
    setRot('RightHandMiddle2_39', 0.3);
    setRot('RightHandMiddle3_38', 0.3);
    setRot('RightHandRing1_44', 0.2);
    setRot('RightHandRing2_43', 0.3);
    setRot('RightHandRing3_42', 0.3);
    setRot('RightHandPinky1_48', 0.2);
    setRot('RightHandPinky2_47', 0.3);
    setRot('RightHandPinky3_46', 0.3);

    setRot('LeftHandThumb1_8', -0.2, 0.5);
    setRot('LeftHandThumb2_7', 0.3);
    setRot('LeftHandThumb3_6', 0.3);
    setRot('LeftHandIndex1_12', 0.2);
    setRot('LeftHandIndex2_11', 0.3);
    setRot('LeftHandIndex3_10', 0.3);
    setRot('LeftHandMiddle1_16', 0.2);
    setRot('LeftHandMiddle2_15', 0.3);
    setRot('LeftHandMiddle3_14', 0.3);
    setRot('LeftHandRing1_20', 0.2);
    setRot('LeftHandRing2_19', 0.3);
    setRot('LeftHandRing3_18', 0.3);
    setRot('LeftHandPinky1_24', 0.2);
    setRot('LeftHandPinky2_23', 0.3);
    setRot('LeftHandPinky3_22', 0.3);

    if (!head) console.warn('Kost "hlava" nebyla nalezena');
  },
  undefined,
  (err) => console.error(err)
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

  // Otáčení pouze hlavy
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

/* RESIZE */
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
