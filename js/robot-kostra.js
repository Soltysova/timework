// ================= IMPORTY =================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ================= KONTEJNER =================
const container = document.getElementById('model');
if (!container) {
    console.error('Nenalezen kontejner #model');
}

// ================= ROBOT REFERENCE =================
let robot = {
    leva: { ruka: null, loket: null, zapesti: null, dlan: null },
    prava: { ruka: null, loket: null, zapesti: null, dlan: null },
    hlava: null,
    krk: null
};

// ================= MYŠ =================
let mouseX = 0;
let mouseY = 0;

// ================= SCÉNA =================
const scene = new THREE.Scene();

// ================= VELIKOSTI =================
const getSize = () => ({
    width: container.clientWidth,
    height: container.clientHeight
});

const { width, height } = getSize();

// ================= KAMERA =================
const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    100
);
camera.position.set(0, 1.4, 3.2);

// ================= RENDERER =================
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// ================= SVĚTLA =================
scene.add(new THREE.AmbientLight(0xffffff, 1.1));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// ================= CONTROLS =================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

// ================= MYŠ NAD MODELEM =================
container.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
});

// ================= NAČTENÍ MODELU =================
const loader = new GLTFLoader();

loader.load(
    './img/robot-kostra.glb',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // --- MAPOVÁNÍ ---
        robot.leva.ruka    = model.getObjectByName('lruka');
        robot.leva.loket   = model.getObjectByName('lloket');
        robot.leva.zapesti = model.getObjectByName('lzapesti');
        robot.leva.dlan    = model.getObjectByName('ldlan');

        robot.prava.ruka    = model.getObjectByName('rruka');
        robot.prava.loket   = model.getObjectByName('rloket');
        robot.prava.zapesti = model.getObjectByName('rzapesti');
        robot.prava.dlan    = model.getObjectByName('rdlan');

        robot.hlava = model.getObjectByName('hlava');
        robot.krk   = model.getObjectByName('krk');

        // --- CENTROVÁNÍ MODELU ---
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDim * 1.6;

        controls.target.set(0, size.y * 0.45, 0);
        controls.update();

        console.log('Robot úspěšně načten');
    },
    undefined,
    (error) => {
        console.error('Chyba při načítání modelu:', error);
    }
);

// ================= RESIZE =================
window.addEventListener('resize', () => {
    const { width, height } = getSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// ================= ANIMACE =================
function animate() {
    requestAnimationFrame(animate);

    if (robot.hlava) {
        const targetY = mouseX * 0.8;
        const targetX = -mouseY * 0.5;

        robot.hlava.rotation.y += (targetY - robot.hlava.rotation.y) * 0.1;
        robot.hlava.rotation.x += (targetX - robot.hlava.rotation.x) * 0.1;

        if (robot.krk) {
            robot.krk.rotation.y += (targetY * 0.4 - robot.krk.rotation.y) * 0.1;
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
