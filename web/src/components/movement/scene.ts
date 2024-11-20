import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SocketData } from "../../utils/types";
import { addListener } from "../../utils/events";

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);

// Add controls for user interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls
controls.dampingFactor = 0.1;
controls.enableZoom = true;

// Initialize variables
const curvePoints: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0.1),
  new THREE.Vector3(0, 0.1, 0),
];

const maxPoints = 50; // Maximum points to keep on the curve
const tubeRadius = 0.2; // Thickness of the tube
let tubeMesh: THREE.Mesh | null = null;

// Add an environment map with error handling
const bounds = { x: 5, y: 5, z: 5 }; // Half-dimensions of the bounding box
let envTexture: THREE.CubeTexture | null = null;

try {
  envTexture = new THREE.CubeTextureLoader()
    .setPath("/texture/")
    .load(
      ["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"],
      () => console.log("Environment texture loaded successfully."),
      undefined,
      () => console.error("Failed to load environment texture.")
    );
  scene.background = envTexture;
} catch (error) {
  console.error("Error loading environment texture:", error);
}

// Function to create and update the tube geometry
const blockGeometry = new THREE.BoxGeometry(2, 1, 0.5); // Dimensions of the block
const blockMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff, // Yellow color for visibility
});

const headBlock = new THREE.Mesh(blockGeometry, blockMaterial);
scene.add(headBlock);

function updateTube() {
  const curve = new THREE.CatmullRomCurve3(curvePoints, false);

  // Optimize geometry resolution based on the number of points
  const tubeSegments = Math.min(150, curvePoints.length * 3);

  const tubeGeometry = new THREE.TubeGeometry(
    curve,
    tubeSegments,
    tubeRadius,
    16,
    false
  );

  // Create a reflective material
  const tubeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff8800,
    metalness: 0.8,
    roughness: 0.2,
    envMap: envTexture || null,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
  });

  // If a tubeMesh already exists, dispose of its geometry and replace
  if (tubeMesh) {
    tubeMesh.geometry.dispose();
    if ((tubeMesh.material as THREE.Material).dispose) {
      (tubeMesh.material as THREE.Material).dispose();
    }
    scene.remove(tubeMesh);
  }

  // Create a new tube mesh
  tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(tubeMesh);

  // Update or create the head block
  if (curvePoints.length > 0) {
    const headPosition = curvePoints[curvePoints.length - 1];
    // Position the block at the head of the path
    headBlock.position.copy(headPosition);
  }
}

// Add initial curve
updateTube();

let lastPoint = new THREE.Vector3(0, 0, 0);
let lastSpeed = new THREE.Vector3(0, 0, 0);
function addPoint(data: SocketData) {
  const sensor = data.value;
  sensor.accelarationX =
    Math.abs(sensor.accelarationX) < 0.5 ? 0 : sensor.accelarationX;
  sensor.accelarationY =
    Math.abs(sensor.accelarationY) < 0.5 ? 0 : sensor.accelarationY;
  sensor.accelarationZ =
    Math.abs(sensor.accelarationZ) < 0.5 ? 0 : sensor.accelarationZ;
  if (
    sensor.accelarationX === 0 &&
    sensor.accelarationY === 0 &&
    sensor.accelarationZ === 0
  ) {
    lastSpeed = new THREE.Vector3(0, 0, 0);
    return;
  }

  const interVal = sensor.interval / 1000;
  const newPoint = new THREE.Vector3(
    lastPoint.x +
      lastSpeed.x * interVal +
      0.5 * sensor.accelarationX * interVal * interVal,
    lastPoint.y +
      lastSpeed.y * interVal +
      0.5 * sensor.accelarationY * interVal * interVal,
    lastPoint.z +
      lastSpeed.z * interVal +
      0.5 * sensor.accelarationZ * interVal * interVal
  );
  lastPoint = newPoint;
  lastSpeed = new THREE.Vector3(
    lastSpeed.x + sensor.accelarationX * interVal,
    lastSpeed.y + sensor.accelarationY * interVal,
    lastSpeed.z + sensor.accelarationZ * interVal
  );

  curvePoints.push(newPoint);

  // Limit the number of points to avoid performance issues
  if (curvePoints.length > maxPoints) {
    curvePoints.shift();
  }

  // Update the tube geometry with the new points
  try {
    updateTube();
  } catch (error) {
    // eslint-disable-next-line no-debugger
    debugger;
  }

  // Adjust block tilt based on gyroscope data
  if (sensor.gyroX > 0.5 || sensor.gyroY > 0.5 || sensor.gyroZ > 0.5) {
    headBlock.rotation.set(
      sensor.gyroX * Math.PI, // Convert to radians for Three.js
      sensor.gyroY * Math.PI,
      sensor.gyroZ * Math.PI
    );
  }
}

addListener("sensorData", addPoint);

// Smooth camera adjustments
function updateCamera() {
  if (curvePoints.length > 0) {
    const lastPoint = curvePoints[curvePoints.length - 1]; // Line head

    // Offset to keep the line head visible
    const offsetDistance = 10; // Distance of the camera from the line head
    const zoomDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
      camera.quaternion
    ); // Camera's current view direction
    const targetPosition = lastPoint
      .clone()
      .add(zoomDirection.multiplyScalar(-offsetDistance)); // Move in zoom direction

    // Smoothly move the camera to the target position
    camera.position.lerp(targetPosition, 0.1);

    // Smoothly rotate to look at the last point
    camera.lookAt(lastPoint);

    // Optional: Stabilize roll by ensuring the camera's up vector is correct
    camera.up.lerp(new THREE.Vector3(0, 1, 0), 0.1);
  }
}

// Add lighting
const light = new THREE.PointLight(0xffffff, 2, 100); // Increased intensity and range
light.position.set(5, 5, 10);
scene.add(light);

// Add ambient light with higher intensity
const ambientLight = new THREE.AmbientLight(0x606060, 1.5); // Increased intensity
scene.add(ambientLight);

// Add a hemisphere light for natural ambient effect
const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 1.0); // Sky and ground colors
hemisphereLight.position.set(0, 50, 0);
scene.add(hemisphereLight);

// Optional: Add a directional light for strong directional shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

let isRunning = false;

addListener("startRecording", () => {
  isRunning = true;
});

addListener("stopRecording", () => {
  isRunning = false;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls for interactivity
  if (isRunning) {
    updateCamera();
  }
  renderer.render(scene, camera);
}
animate();

// Export function for dynamic resizing
export const getDomElement = (width: number, height: number) => {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  bounds.x = width / 2;
  bounds.y = height / 2;
  bounds.z = Math.sqrt(width * width + height * height) / 2;
  return renderer.domElement;
};

export const resetTrace = () => {
  curvePoints.splice(3, curvePoints.length);
  lastPoint = new THREE.Vector3(0, 0, 0);
  lastSpeed = new THREE.Vector3(0, 0, 0);
  updateTube();
};
