
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as ASTRO from 'astronomy-engine';

const obsv = new ASTRO.Observer(31.7781, 35.2355, 750);

// --- 1. Basic configuration ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky color

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(-80, 220, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 2. Activating shadow ---
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxDistance = 1000;
controls.minDistance = 60;
controls.maxPolarAngle = Math.PI / 2 - 0.1;

// --- 3. Scene objects definition ---

// Ground
const groundGeometry = new THREE.PlaneGeometry(200, 300);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate ground to be horizontal
ground.receiveShadow = true;
scene.add(ground);

// Buildings
const buildings = [
  { x: 0, z: -15, h: 100, w: 100, d: 30 }, // האולם
  { x: 0, z: -65, h: 100, w: 70, d: 70 }, // ההיכל

  // מדרגות ההיכל
  { x: 0, z: 2, h: 6, w: 20, d: 4 },
  { x: 0, z: 2.5, h: 5.5, w: 21, d: 5 },
  { x: 0, z: 3, h: 5, w: 22, d: 6 },
  { x: 0, z: 4.5, h: 4.5, w: 23, d: 9 },
  { x: 0, z: 5, h: 4, w: 24, d: 10 },
  { x: 0, z: 5.5, h: 3.5, w: 25, d: 11 },
  { x: 0, z: 7, h: 3, w: 26, d: 14 },
  { x: 0, z: 7.5, h: 2.5, w: 27, d: 15 },
  { x: 0, z: 8, h: 2, w: 28, d: 16 },
  { x: 0, z: 9.5, h: 1.5, w: 29, d: 19 },
  { x: 0, z: 10, h: 1, w: 30, d: 20 },
  { x: 0, z: 10.5, h: 0.5, w: 31, d: 21 },

  // המזבח
  { x: -8 + 15, z: 38, h: 1, w: 2, d: 32 },
  { x: -8 + 0, z: 53, h: 1, w: 32, d: 2 },
  { x: -8 + 0, z: 38, h: 6, w: 30, d: 30 },
  { x: -8 + 0, z: 38, h: 9, w: 28, d: 28 },
  { x: -8 + 13.5, z: 24.5, h: 10, w: 1, d: 1 },
  { x: -8 + -13.5, z: 24.5, h: 10, w: 1, d: 1 },
  { x: -8 + 13.5, z: 51.5, h: 10, w: 1, d: 1 },
  { x: -8 + -13.5, z: 51.5, h: 10, w: 1, d: 1 },

  // חומות העזרה
  { x: -68.5, z: -17.5, h: 23, w: 2, d: 187 },
  { x: 68.5, z: -17.5, h: 23, w: 2, d: 187 },
  { x: 0, z: 77, h: 23, w: 135 + 4, d: 2 },
  { x: 0, z: -112, h: 23, w: 135 + 4, d: 2 },
];

const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
buildings.forEach(b => {
  const buildingGeometry = new THREE.BoxGeometry(b.w, b.h, b.d);
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(b.x, b.h / 2, b.z); // Object position is center of cubic, thus y is half of height
  building.castShadow = true;
  building.receiveShadow = true;
  scene.add(building);
});

// הכבש
const wedgeGeometry = new THREE.BoxGeometry(32, 18, 16);
const pos = wedgeGeometry.attributes.position;
for (let i = 0; i < pos.count; i++) {
  if (pos.getX(i) < 0 && pos.getY(i) > 0) pos.setY(i, 0); // change Y-coord by condition
  if (pos.getY(i) < 0) pos.setY(i, 0)
}

wedgeGeometry.computeVertexNormals();
const wedge = new THREE.Mesh(wedgeGeometry, buildingMaterial);
wedge.position.set(-38, 0, 38);
wedge.castShadow = true;
wedge.receiveShadow = true;
scene.add(wedge);

// פתחו של אולם
const gateGeometry = new THREE.PlaneGeometry(20, 40);
const gateMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, side: THREE.DoubleSide });
const gate = new THREE.Mesh(gateGeometry, gateMaterial);
gate.receiveShadow = true;
gate.position.z = 0.1
gate.position.y = 26
scene.add(gate);

// הטבעות
const material = new THREE.LineBasicMaterial({
  color: 0x0000ff,
});

const points = [
  new THREE.Vector3(16, .1, 22),
  new THREE.Vector3(16 + 24, .1, 22),
  new THREE.Vector3(16 + 24, .1, 22 + 32),
  new THREE.Vector3(16, .1, 22 + 32),
  new THREE.Vector3(16, .1, 22),
  new THREE.Vector3(16 + 6, .1, 22),
  new THREE.Vector3(16 + 6, .1, 22 + 32),
  new THREE.Vector3(16 + 12, .1, 22 + 32),
  new THREE.Vector3(16 + 12, .1, 22),
  new THREE.Vector3(16 + 18, .1, 22),
  new THREE.Vector3(16 + 18, .1, 22 + 32),
  new THREE.Vector3(16 + 24, .1, 22 + 32),
  new THREE.Vector3(16 + 24, .1, 22 + 32 * 5 / 6),
  new THREE.Vector3(16, .1, 22 + 32 * 5 / 6),
  new THREE.Vector3(16, .1, 22 + 32 * 4 / 6),
  new THREE.Vector3(16 + 24, .1, 22 + 32 * 4 / 6),
  new THREE.Vector3(16 + 24, .1, 22 + 32 * 3 / 6),
  new THREE.Vector3(16, .1, 22 + 32 * 3 / 6),
  new THREE.Vector3(16, .1, 22 + 32 * 2 / 6),
  new THREE.Vector3(16 + 24, .1, 22 + 32 * 2 / 6),
  new THREE.Vector3(16 + 24, .1, 22 + 32 * 1 / 6),
  new THREE.Vector3(16, .1, 22 + 32 * 1 / 6),
];

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry, material);
scene.add(line);



// --- 4. light definition ---

const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x999999, 0.9);
scene.add(hemisphereLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(50, 80, 30);
sunLight.castShadow = true;
scene.add(sunLight);

sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;

const shadowCameraSize = 300;
sunLight.shadow.camera.left = -shadowCameraSize;
sunLight.shadow.camera.right = shadowCameraSize;
sunLight.shadow.camera.top = shadowCameraSize;
sunLight.shadow.camera.bottom = -shadowCameraSize;

// --- 5. updating sun and UI ---
const datePicker = document.getElementById('date-picker');
const timeSlider = document.getElementById('time-slider');
const timeLabel = document.getElementById('time-label');
const hourLabel = document.getElementById('hour-label');

datePicker.value = `2025-12-21`;

function updateSunPosition() {
  const time = parseFloat(timeSlider.value);
  const date = new Date(datePicker.value);

  const sunrise = ASTRO.SearchRiseSet(ASTRO.Body.Sun, obsv, +1, date, 1);
  const sunset = ASTRO.SearchRiseSet(ASTRO.Body.Sun, obsv, -1, date, 1);
  const dayLength = sunset.date - sunrise.date;

  date.setTime(sunrise.date.getTime() + dayLength / 12 * time);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  timeLabel.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  hourLabel.textContent = time;

  const equator = ASTRO.Equator(ASTRO.Body.Sun, date, obsv, true, true);
  const horizon = ASTRO.Horizon(date, obsv, equator.ra, equator.dec, 'normal');
  console.log(horizon.azimuth, horizon.altitude, time)

  const sunDistance = 150;

  const azimuthRad = THREE.MathUtils.degToRad(horizon.azimuth + 90);
  const altitudeRad = THREE.MathUtils.degToRad(horizon.altitude);

  const y = sunDistance * Math.sin(altitudeRad);

  const projectedRadius = sunDistance * Math.cos(altitudeRad);
  const x = projectedRadius * Math.sin(azimuthRad);
  const z = projectedRadius * -Math.cos(azimuthRad);

  sunLight.position.set(x, y, z);
  sunLight.target.position.set(0, 0, 0);

  // If sun goes down the horizon, turn off light
  if (sunLight.position.y < 0) {
    sunLight.position.y = 0;
    sunLight.intensity = 0;
  } else {
    sunLight.intensity = 2.5;
  }

  sunLight.target.position.set(0, 0, 0);
  scene.add(sunLight.target);
}

datePicker.addEventListener('input', updateSunPosition);
timeSlider.addEventListener('input', updateSunPosition);

updateSunPosition();

// --- 6. Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Required for 'enableDamping'
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

// setTimeout(() => {
//   setInterval(() => {
//     const date = new Date(datePicker.value);
//     date.setDate(date.getDate() + 1);
//     datePicker.value = date.toISOString().slice(0,10);
//     updateSunPosition();
//   }, 100);
// }, 5000);
