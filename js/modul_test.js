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

  /* --- VÝPOČET ROZMĚRŮ --- */
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  /* --- VYCENTROVÁNÍ MODELU --- */
  model.position.sub(center);

  /* --- NASTAVENÍ KAMERY PODLE MODELU --- */
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  cameraZ *= 1.5; // rezerva
  camera.po
