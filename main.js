import './style.css';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xfc8047 );

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(25, 25, 0);
camera.up.set(0, 1, 0);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// HDR
const rgbeLoader = new RGBELoader();
rgbeLoader.load('hdri/HDR_multi_nebulae.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularRefractionMapping;
  scene.background = texture;
});

// Ambient Light
const ambiLight = new THREE.AmbientLight(0x606060, 2.5); // soft white light
scene.add(ambiLight);

const objects = [];

// Father
const father = new THREE.Object3D();
scene.add(father);
objects.push(father);

// Sphere
const radius = 1.5;
const widthSegments = 100;
const heightSegments = 100;
const sphereGeometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments
);

// Center light point
const color = 0xff0000;
const intensity = 300;
const light = new THREE.PointLight(color, intensity);
light.castShadow = true;
father.add(light);

// Optimized shadows
light.shadow.mapSize.width = 256; // Default is 512
light.shadow.mapSize.height = 256; // Default is 512
light.shadow.camera.near = 0.5; // Default is 0.5
light.shadow.camera.far = 50; // Default is 500

// Eye Center Star
let eye = null;
loadModel(
  "models/eye_blend/eye_blend.gltf",
  eye,
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0.05, 0.05, 0.05),
  father,
  false
);

const textureLoader = new THREE.TextureLoader();
// Texture planet one
const p1AlbedoTexture = textureLoader.load("textures/rusty_metal_02/rusty_metal_02_diff_2k.png")
const p1NormalTexture = textureLoader.load("textures/rusty_metal_02/rusty_metal_02_nor_gl_2k.png")
const p1DisplacementTexture = textureLoader.load("textures/rusty_metal_02/rusty_metal_02_disp_2k.png")
// Texture planet two
const p2AlbedoTexture = textureLoader.load("textures/mud_cracked_dry_03/mud_cracked_dry_03_diff_2k.png")
const p2NormalTexture = textureLoader.load("textures/mud_cracked_dry_03/mud_cracked_dry_03_nor_gl_2k.png")
const p2DisplacementTexture = textureLoader.load("textures/mud_cracked_dry_03/mud_cracked_dry_03_disp_2k.png")

// Planet One
const planetOneOrbit = new THREE.Object3D();
planetOneOrbit.position.x = 10;
father.add(planetOneOrbit);
objects.push(planetOneOrbit);

const planetOneMaterial = new THREE.MeshStandardMaterial({
  map: p1AlbedoTexture,
  normalMap: p1NormalTexture,
  displacementMap: p1DisplacementTexture,
  displacementScale: 0.5
});
const planetOne = new THREE.Mesh(sphereGeometry, planetOneMaterial);
planetOne.castShadow = true;
planetOne.receiveShadow = true;
planetOneOrbit.add(planetOne);

// Satellite One
const satelitOrbit = new THREE.Object3D();
satelitOrbit.position.x = 3;
planetOneOrbit.add(satelitOrbit);
objects.push(satelitOrbit);

const satelitMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  // emissive: 0x222222,
});
const satelit = new THREE.Mesh(sphereGeometry, satelitMaterial);
satelit.castShadow = true;
satelit.receiveShadow = true;
satelit.scale.set(0.5, 0.5, 0.5);
satelitOrbit.add(satelit);

// Planet Two
const planetTwoOrbit = new THREE.Object3D();
planetTwoOrbit.position.x = -10;
planetTwoOrbit.position.z = 15;
father.add(planetTwoOrbit);
objects.push(planetTwoOrbit);

const planetTwoMaterial = new THREE.MeshStandardMaterial({
  map: p2AlbedoTexture,
  normalMap: p2NormalTexture,
  displacementMap: p2DisplacementTexture,
  displacementScale: 0.5
});
const planetTwo = new THREE.Mesh(sphereGeometry, planetTwoMaterial);
planetTwo.castShadow = true;
planetTwo.receiveShadow = true;
planetTwoOrbit.add(planetTwo);

// Satellite Two
const satelitTwoOrbit = new THREE.Object3D();
satelitTwoOrbit.position.x = -3;
planetTwoOrbit.add(satelitTwoOrbit);
objects.push(satelitTwoOrbit);

const satelitTwoMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  // emissive: 0x222222,
});
const satelitTwo = new THREE.Mesh(sphereGeometry, satelitTwoMaterial);
satelitTwo.castShadow = true;
satelitTwo.receiveShadow = true;
satelitTwo.scale.set(0.5, 0.5, 0.5);
satelitTwoOrbit.add(satelitTwo);

// Jack O' Lantern Planet
const jackOrbit = new THREE.Object3D();
jackOrbit.position.z = 10;
jackOrbit.position.x = 10;
father.add(jackOrbit);
objects.push(jackOrbit);

let jackPlanet = null;
loadModel(
  "models/jack-o-lantern_02/jack-o-lantern_02.gltf",
  jackPlanet,
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(20, 20, 20),
  jackOrbit
);
// jackPlanet.castShadow = true;
// jackPlanet.receiveShadow = true;

// Ghost One Satellite
const ghostOrbit = new THREE.Object3D();
ghostOrbit.position.x = 5;
jackOrbit.add(ghostOrbit);
objects.push(ghostOrbit);

let ghost = null;
loadModel(
  "models/ghost/ghost.gltf",
  ghost,
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(2, 2, 2),
  ghostOrbit
);
// ghost.castShadow = true;
// ghost.receiveShadow = true;

// Ghost Two Satellite
const ghostOrbit2 = new THREE.Object3D();
ghostOrbit2.position.z = 4;
jackOrbit.add(ghostOrbit2);
objects.push(ghostOrbit2);

let ghost2 = null;
loadModel(
  "models/ghost/ghost.gltf",
  ghost2,
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1.5, 1.5, 1.5),
  ghostOrbit2
);
// ghost2.castShadow = true;
// ghost2.receiveShadow = true;

// Boo Planet
const booOrbit = new THREE.Object3D();
booOrbit.position.z = -10;
booOrbit.position.x = -10;
booOrbit.position.y = -10;
father.add(booOrbit);
objects.push(booOrbit);

let boo = null;
loadModel(
  "models/boo/boo.gltf",
  boo,
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(5, 5, 5),
  booOrbit
);


// Animation Loop
let time = Date.now();
function animate() {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  objects.forEach((obj) => {
    if (obj != null)
      obj.rotation.y += 0.0001 * deltaTime;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();


function loadModel(path, object3d, position, scale, systemToAdd, castShadows = true) {
  //Carregam el fitxer
  const modelLoader = new GLTFLoader();
  modelLoader.load(
    path,
    function (gltf) {
      object3d = gltf.scene;
      object3d.position.set(position.x, position.y, position.z);
      object3d.scale.set(scale.x, scale.y, scale.z);
      systemToAdd.add(object3d);

      // Traverse through all children of the loaded model
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = castShadows; // Enable shadow casting
          child.receiveShadow = castShadows; // Enable shadow receiving
        }
      });
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );
}
