import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('model');

/* SCÉNA */
const scene = new THREE.Scene();

/* KAMERA */
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.01,
  1000
);

/* RENDERER */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

/* SVĚTLA */
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

/* DEBUG – můžete zakomentovat */
// scene.add(new THREE.AxesHelper(2));
// scene.add(new THREE.GridHelper(10, 10));

/* MODEL */
let model;

const loader = new GLTFLoader();
loader.load('/img/model.glb', (gltf) => {

  model = gltf.scene;
  scene.add(model);

  // DEBUG: pomocné objekty
  scene.add(new THREE.AxesHelper(5));

  // 1) tvrdé nastavení pozice a měřítka
  model.position.set(0, 0, 0);
  model.scale.set(1, 1, 1);

  // 2) box + info
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  console.log('SIZE:', size);
  console.log('CENTER:', center);

  // 3) extrémně konzervativní kamera
  camera.position.set(0, 0, 10);
  camera.near = 0.001;
  camera.far = 10000;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

});

