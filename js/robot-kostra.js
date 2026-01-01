import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Nastavení scény, kamery a rendereru
const container = document.getElementById('model');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// 2. Osvětlení
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Proměnné pro interakci
let headBone = null;
let mouseX = 0;
let mouseY = 0;

// 3. Načtení modelu
const loader = new GLTFLoader();
loader.load(
    'img/robot-kostra.glb', 
    (gltf) => {
        const model = gltf.scene;

        // Prohledání kostí a nalezení hlavy
        model.traverse((object) => {
            if (object.isBone && object.name === 'hlava') {
                headBone = object;
                // Nastavení pořadí rotací pro stabilitu
                headBone.rotation.order = 'YXZ'; 
            }
        });
        
        // Základní transformace modelu
        model.rotation.y = Math.PI; 
        
        // ZVĚTŠENÍ MODELU: Nastaveno na 3
        const scaleValue = 3;
        model.scale.set(scaleValue, scaleValue, scaleValue);
        
        // ÚPRAVA POZICE: Sníženo na -2.7, aby postava správně seděla v záběru
        model.position.y = -2.7;

        scene.add(model);
        console.log("Model načten, zvětšen na 3 a vycentrován.");
    },
    undefined,
    (error) => console.error('Chyba při načítání:', error)
);

// Pozice kamery
camera.position.z = 4;

// Sledování pohybu myši
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// 4. Animační smyčka
function animate() {
    requestAnimationFrame(animate);

    if (headBone) {
        // Horizontální rotace (Osa Y)
        const targetRY = mouseX * 1.2;
        headBone.rotation.y += (targetRY - headBone.rotation.y) * 0.1;

        // Vertikální rotace (Osa Z)
        const targetRZ = -mouseY * 0.8;
        headBone.rotation.z += (targetRZ - headBone.rotation.z) * 0.1;
    }

    renderer.render(scene, camera);
}

// 5. Přizpůsobení při změně velikosti okna
window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

animate();
