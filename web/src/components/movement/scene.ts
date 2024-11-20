import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addMessageListener, SocketData } from "../../utils/socket";

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

// Initialize variables
const curvePoints: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1, 1, 1),
  new THREE.Vector3(2, 0, -1),
];
const maxPoints = 50; // Maximum points to keep on the curve
const tubeRadius = 0.2; // Thickness of the tube
let tubeMesh: THREE.Mesh | null = null;

// Add an environment map with error handling
const bounds = { x: 5, y: 5, z: 5 }; // Half-dimensions of the bounding box
let envTexture: THREE.CubeTexture | null = null;

try {
  envTexture = new THREE.CubeTextureLoader()
    .setPath("https://threejs.org/examples/textures/cube/Bridge2/")
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
}

// Add initial curve
updateTube();

let lastPoint = new THREE.Vector3(0, 0, 0);
let lastSpeed = new THREE.Vector3(0, 0, 0);
function addPoint(data: SocketData) {
  const sensor = data.value;

  if (
    Math.abs(sensor.accelarationX) < 0.5 &&
    Math.abs(sensor.accelarationY) < 1.5 &&
    Math.abs(sensor.accelarationZ) < 0.3
  ) {
    return;
  }

  console.log(sensor);

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
  updateTube();
}

addMessageListener(addPoint);

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
const light = new THREE.PointLight(0xffffff, 1, 50);
light.position.set(5, 5, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls for interactivity
  updateCamera();
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
