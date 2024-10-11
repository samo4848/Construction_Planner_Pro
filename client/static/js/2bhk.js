import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/RGBELoader.js';
import * as dat from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16.1/dist/lil-gui.esm.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const gui=new dat.GUI();

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Load GLTF model
const loader = new GLTFLoader();
loader.load('/client/static/models/2bhk_house/scene.gltf',
    function (gltf) {
        scene.add(gltf.scene);
        gltf.scene.scale.set(0.5, 0.5, 0.5);

        const modelFolder = gui.addFolder('Model');
        modelFolder.add(gltf.scene.scale, 'x', 0, 5).step(0.1).name('Scale X');
        modelFolder.add(gltf.scene.scale, 'y', 0, 5).step(0.1).name('Scale Y');
        modelFolder.add(gltf.scene.scale, 'z', 0, 5).step(0.1).name('Scale Z');

        const cameraFolder = gui.addFolder('Camera');
        cameraFolder.add(camera.position, 'z', 1, 50).step(0.1).name('Zoom');

        const viewFolder = gui.addFolder('Views');
        viewFolder.add({
          TopView: function() {
            camera.position.set(0, 5, 0);
            camera.rotation.set(Math.PI / 2, 0, 0);
          }
        }, 'TopView').name('Top View');
        
        viewFolder.add({
          FrontView: function() {
            camera.position.set(0, 0, 5);
            camera.rotation.set(0, 0, 0);
          }
        }, 'FrontView').name('Front View');
        
        viewFolder.add({
          SideView: function() {
            camera.position.set(10, 0, 0);
            camera.rotation.set(0, Math.PI / 2, 0);
          }
        }, 'SideView').name('Side View');
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

const rgbeLoader = new RGBELoader();
rgbeLoader.load('/client/static/images/image1.hdr',(environmentMap) =>
{
    environmentMap.mapping=THREE.EquirectangularReflectionMapping
    scene.background=environmentMap
    scene.environment=environmentMap
})



// Lighting
const directionalLight = new THREE.DirectionalLight(0x00fffc, 7);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.position.set(1, 0, 25);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 2);
scene.add(hemisphereLight);
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );



// Camera position
camera.position.x = 20;
camera.position.z = 25;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
    controls.update();
    renderer.render(scene, camera);
}

console.log('Script loaded successfully!');