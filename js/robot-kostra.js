import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Detekce mobilu - pokud je okno užší než 768px, JS se ukončí a šetří výkon
if (window.innerWidth <= 768) {
    console.log("Mobilní režim: 3D model deaktivován.");
} else {
    initThreeJS();
}

function initThreeJS() {
    const container = document.getElementById('model');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    let headBone = null;
    let mouseX = 0;
    let mouseY = 0;

    const loader = new GLTFLoader();
    loader.load(
        'img/robot-kostra.glb', 
        (gltf) => {
            const model = gltf.scene;
            model.traverse((object) => {
                if (object.isBone && object.name === 'hlava') {
                    headBone = object;
                    headBone.rotation.order = 'YXZ'; 
                }
            });
            
            model.rotation.y = Math.PI; 
            const scaleValue = 2.5;
            model.scale.set(scaleValue, scaleValue, scaleValue);
            model.position.y = -2.2;

            scene.add(model);
        },
        undefined,
        (error) => console.error('Chyba při načítání:', error)
    );

    camera.position.z = 4;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (headBone) {
            const targetRY = mouseX * 1.2;
            headBone.rotation.y += (targetRY - headBone.rotation.y) * 0.1;
            const targetRZ = -mouseY * 0.8;
            headBone.rotation.z += (targetRZ - headBone.rotation.z) * 0.1;
        }
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
}
