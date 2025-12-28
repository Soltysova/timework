// js/modul.js
throw new Error('TEST – toto je správný modul.js');

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

console.log('modul.js se načetl');

const container = document.getElementById('model');
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
  loader.load(
    'img/model.glb',
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      head = model.getObjectByName('Head');
    },
    undefined,
    (err) => console.error('Chyba při načítání modelu:', err)
  );

  document.addEventListener('mousemove', (e) => {
    if (!head) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    head.rotation.y = x * 0.4;
  });

  window.addEventListener('resize', () => {
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
