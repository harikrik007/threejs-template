import * as THREE from 'three';

// ── Renderer ──────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ── Scene & Camera ────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe64a19);
scene.fog = new THREE.Fog(0xe64a19, 8, 20);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// ── Cube ──────────────────────────────────────────────────
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({
  color: 0xff7043,
  emissive: 0xbf360c,
  emissiveIntensity: 0.3,
  roughness: 0.25,
  metalness: 0.7,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Wireframe overlay
const wireMat = new THREE.MeshBasicMaterial({
  color: 0xff8a65,
  wireframe: true,
  transparent: true,
  opacity: 0.18,
});
cube.add(new THREE.Mesh(geometry, wireMat));

// ── Lights ────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xff7043, 0.6));

const keyLight = new THREE.DirectionalLight(0xfff3e0, 1.8);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xff3d00, 1.2);
rimLight.position.set(-5, -3, -5);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xffab91, 2, 10);
fillLight.position.set(0, 3, 2);
scene.add(fillLight);

// ── Particles ─────────────────────────────────────────────
const positions = new Float32Array(120 * 3).map(() => (Math.random() - 0.5) * 16);
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
  color: 0xffccbc, size: 0.04, transparent: true, opacity: 0.5,
}));
scene.add(particles);

// ── Title UI ──────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@300&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { overflow: hidden; }
  canvas { display: block; position: fixed; top: 0; left: 0; }
  #title-wrapper {
    position: fixed; bottom: 10vh; width: 100%;
    display: flex; flex-direction: column; align-items: center;
    z-index: 10; pointer-events: none;
  }
  #title {
    font-family: 'Orbitron', sans-serif; font-weight: 900;
    font-size: clamp(1.8rem, 5vw, 4rem);
    color: #fff3ee; letter-spacing: 0.12em; text-transform: uppercase;
    text-shadow: 0 0 30px rgba(255,120,60,0.7), 0 0 60px rgba(255,80,20,0.4), 0 2px 0 rgba(0,0,0,0.3);
    animation: flicker 4s infinite;
  }
  #subtitle {
    font-family: 'Rajdhani', sans-serif; font-weight: 300;
    font-size: clamp(0.8rem, 2vw, 1.2rem);
    letter-spacing: 0.5em; color: rgba(255,220,200,0.65);
    text-transform: uppercase; margin-top: 0.5rem;
  }
  .divider {
    width: 120px; height: 1px; margin: 0.8rem auto 0;
    background: linear-gradient(90deg, transparent, rgba(255,200,160,0.6), transparent);
  }
  @keyframes flicker {
    0%, 95%, 100% { opacity: 1; }
    96% { opacity: 0.85; } 97% { opacity: 1; } 98% { opacity: 0.9; }
  }
`;
document.head.appendChild(style);

const ui = document.createElement('div');
ui.id = 'title-wrapper';
ui.innerHTML = `
  <div id="title">AgentBaba</div>
  <div class="divider"></div>
  <div id="subtitle">Gaming Sandbox</div>
`;
document.body.appendChild(ui);

// ── Mouse Parallax ────────────────────────────────────────
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ── Resize ────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── Animate ───────────────────────────────────────────────
let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.01;

  cube.rotation.x += 0.005;
  cube.rotation.y += 0.008;
  cube.position.y = Math.sin(t * 0.8) * 0.15;

  camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  particles.rotation.y += 0.0008;
  renderer.render(scene, camera);
}
animate();