// ================= IMPORTY =================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

let { width, height } = getSize();

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

// ================= POHYB MYŠI – VARIANTA A =================
window.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX = (event.clientX - centerX) / (rect.width / 2);
    mouseY = -(event.clientY - centerY) / (rect.height / 2);

    mouseX = THREE.MathUtils.clamp(mouseX, -1, 1);
    mouseY = THREE.MathUtils.clamp(mouseY, -1, 1);
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

        // ✅ JEMNÝ OFFSET PRO HERO LAYOUT
        model.position.x -= size.x * 0.12; // doleva
        model.position.y += size.y * 0.08; // nahoru

        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDim * 1.6;

        console.log('Robot úspěšně načten');
    },
    undefined,
    (error) => {
        console.error('Chyba při načítání modelu:', error);
    }
);

// ================= RESIZE =================
window.addEventListener('resize', () => {
    ({ width, height } = getSize());
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// ================= ANIMACE =================
function animate() {
    requestAnimationFrame(animate);

    if (robot.hlava) {
        const headMaxY = 0.6;
        const headMaxX = 0.35;

        const targetY = THREE.MathUtils.clamp(mouseX * 0.8, -headMaxY, headMaxY);
        const targetX = THREE.MathUtils.clamp(-mouseY * 0.5, -headMaxX, headMaxX);

        robot.hlava.rotation.y += (targetY - robot.hlava.rotation.y) * 0.08;
        robot.hlava.rotation.x += (targetX - robot.hlava.rotation.x) * 0.08;

        if (robot.krk) {
            robot.krk.rotation.y += (targetY * 0.4 - robot.krk.rotation.y) * 0.08;
        }
    }

    renderer.render(scene, camera);
}

animate();
