import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Odstraňte tento řádek, jakmile uvidíte, že se v konzoli nezobrazuje chyba importu
console.log('modul.js: Importy proběhly úspěšně.');

const container = document.getElementById('model');

// Kontrola, zda kontejner existuje, aby kód nespadl
if (!container) {
    console.error('Chyba: Element s id="model" nebyl nalezen.');
} else {
    const isMobile = window.innerWidth < 768;

    /* ================= MOBILE FALLBACK ================= */
    if (isMobile) {
        const img = document.createElement('img');
        img.src = 'img/model_static.png';
        img.alt = 'Sedící postava';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        container.appendChild(img);
    }

    /* ================= THREE.JS ================= */
    if (!isMobile) {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            35,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        );
        camera.position.set(0, 1.4, 3);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));

        const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
        keyLight.position.set(2, 4, 2);
        scene.add(keyLight);

        let head = null;

        const loader = new GLTFLoader();
        // Cesta k modelu musí být relativní k index.html nebo absolutní
        loader.load(
            'img/model.glb',
            (gltf) => {
                const model = gltf.scene;
                scene.add(model);
                // Najde objekt "Head" v hierarchii modelu pro interakci
                head = model.getObjectByName('Head');
                console.log('Model úspěšně načten');
            },
            undefined,
            (err) => console.error('Chyba při načítání modelu .glb:', err)
        );

        document.addEventListener('mousemove', (e) => {
            if (!head) return;
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            // Jemné otáčení hlavy podle myši
            head.rotation.y = x * 0.4;
        });

        window.addEventListener('resize', () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        animate();
    }
}