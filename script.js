console.clear();

/* SETUP */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.z = 600;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* LIGHTS */
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 0, 600);
scene.add(pointLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

/* CONTROLS */
const controls = new THREE.OrbitControls(camera, renderer.domElement);

/* HEART PARTICLES */
const path = document.querySelector("#heart-path");
const length = path.getTotalLength();
const vertices = [];
for (let i = 0; i < length; i += 0.5) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);
  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;
  vertices.push(vector);
}
const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
const material = new THREE.PointsMaterial({ color: 0xee5282, blending: THREE.AdditiveBlending, size: 3 });
const particles = new THREE.Points(geometry, material);
particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;
scene.add(particles);

/* PARTICLE ANIMATION */
const tl = gsap.timeline({ repeat: -1, yoyo: true });
vertices.forEach((vector, i) => {
  tl.from(vector, {
    x: 600/2,
    y: -552/2,
    z: 0,
    ease: "power2.inOut",
    duration: gsap.utils.random(2, 5)
  }, i * 0.002);
});
gsap.fromTo(scene.rotation, { y: -0.2 }, {
  y: 0.2, repeat: -1, yoyo: true, ease: 'power2.inOut', duration: 3
});

/* TEXT INSIDE HEART */
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  const textGeometry = new THREE.TextGeometry('Закие', {
    font: font,
    size: 80,
    height: 12,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 2,
    bevelOffset: 0,
    bevelSegments: 3
  });
  textGeometry.computeBoundingBox();
  const bbox = textGeometry.boundingBox;
  const textWidth = bbox.max.x - bbox.min.x;
  const textHeight = bbox.max.y - bbox.min.y;
  const textMesh = new THREE.Mesh(
    textGeometry,
    new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 })
  );
  textMesh.position.x = -textWidth / 2 - 600 / 2;
  textMesh.position.y = -textHeight / 2 + 552 / 2;
  textMesh.position.z = 35;
  scene.add(textMesh);
});

/* RENDERING */
function render() {
  requestAnimationFrame(render);
  geometry.setFromPoints(vertices);
  renderer.render(scene, camera);
}
render();

/* RESIZE */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});