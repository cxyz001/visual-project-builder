import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BELTS, BELT_TOP, BOX_SIZE, parcelPosition, robotPosition, truckPosition } from './logistics-layout';

export default function LogisticsScene({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const pause = useRef(paused);
  const markers = useRef<(HTMLAnchorElement | null)[]>([]);
  const [failed, setFailed] = useState(false);
  useEffect(() => { pause.current = paused; }, [paused]);
  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0xeaf2fa, 1);
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', '可拖动旋转、滚轮缩放的三维物流模型');
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    scene.environmentIntensity = .55;
    room.dispose(); pmrem.dispose();
    scene.fog = new THREE.Fog(0xeaf2fa, 45, 85);
    const camera = new THREE.OrthographicCamera(-22, 22, 14, -14, .1, 150);
    camera.position.set(26, 24, 30);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true; controls.enablePan = false;
    controls.minZoom = .65; controls.maxZoom = 2;
    controls.maxPolarAngle = Math.PI / 2.3;
    const mats = new Map<string, THREE.MeshStandardMaterial>();
    function material(color: string) {
      if (!mats.has(color)) mats.set(color, new THREE.MeshStandardMaterial({ color, roughness: color === '#b9cbd9' ? .28 : .48, metalness: color === '#b9cbd9' ? .7 : .12 }));
      return mats.get(color)!;
    }
    function block(parent: THREE.Object3D, size: [number, number, number], pos: [number, number, number], color: string) {
      const radius = Math.min(...size) * .12;
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, Math.min(radius, .08)), material(color));
      mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    }
    function cylinder(parent: THREE.Object3D, r: number, length: number, pos: [number, number, number], color: string) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, length, 32), material(color));
      mesh.rotation.z = Math.PI / 2; mesh.position.set(...pos); mesh.castShadow = true; parent.add(mesh); return mesh;
    }
    function carton(parent: THREE.Object3D, size = BOX_SIZE) {
      const group = new THREE.Group(); parent.add(group);
      block(group, [size, size, size], [0, 0, 0], '#bd8d59');
      block(group, [size * .14, .012, size + .01], [0, size / 2 + .006, 0], '#e5c493');
      block(group, [.17, .16, .012], [size * .2, .02, size / 2 + .008], '#f6eee0');
      for (let i = 0; i < 7; i++) block(group, [.008, .065, .014], [size * .1 + i * .015, .02, size / 2 + .016], '#544737');
      block(group, [.012, size * .7, .012], [-size / 2 + .03, 0, size / 2 + .008], '#a77b50');
      return group;
    }
    scene.add(new THREE.HemisphereLight(0xe7f5ff, 0xa2b5c7, 1.7));
    const sun = new THREE.DirectionalLight(0xfff6e9, 3); sun.position.set(-8, 24, 15); sun.castShadow = true;
    sun.shadow.blurSamples = 12;
    sun.shadow.radius = 4;
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -23, right: 23, top: 23, bottom: -23 });
    sun.shadow.normalBias = .035; scene.add(sun);
    block(scene, [37, .25, 30], [0, -.16, 0], '#dce7ef');
    const grid = new THREE.GridHelper(36, 36, '#d4e0e9', '#d4e0e9'); grid.position.y = -.02; scene.add(grid);
    block(scene, [25, 5.8, .3], [-1, 2.9, -7], '#eef4f8');
    block(scene, [.3, 4.8, 15], [-12, 2.4, .3], '#e9f0f6');
    // Architectural details from the reference: roof ribs, dock seals and blue trim.
    block(scene, [25.4, .22, 3], [-1, 5.85, -8.3], '#f3f7fb');
    for (let x = -13; x <= 11; x += 2) block(scene, [.09, .08, 2.9], [x, 6, -8.3], '#d6e1eb');
    block(scene, [25, .16, .08], [-1, .35, -6.8], '#1679ce');
    for (let x = -11; x < 12; x += 1.2) block(scene, [.035, 5.6, .025], [x, 2.9, -6.82], '#dce6ef');
    for (const x of [5, 9.5]) {
      block(scene, [3.1, 3.7, .12], [x, 1.85, -6.78], '#253c55');
      block(scene, [2.5, 2.9, .13], [x, 1.45, -6.68], '#4b6175');
      for (const side of [-1, 1]) block(scene, [.24, 3.9, .32], [x + side * 1.55, 1.95, -6.5], '#324d68');
      block(scene, [3.4, .25, .35], [x, 3.9, -6.5], '#324d68');
      block(scene, [3.5, .3, .14], [x, 4.38, -6.74], '#698299');
      for (let y = .3; y < 3; y += .23) block(scene, [2.5, .018, .025], [x, y, -6.59], '#8396a6');
      block(scene, [.15, .3, .14], [x + 1.95, 1.5, -6.6], '#45cfbd');
      for (const side of [-1, 1]) block(scene, [.14, 1.2, .2], [x + side * 1.55, .6, -6.5], '#efbc4d');
    }
    for (const x of [-9.8, -7]) for (const z of [-4.5, -1.5, 1.5, 4.5]) {
      for (const dx of [-.95, .95]) for (const dz of [-1.2, 1.2]) block(scene, [.09, 4.8, .09], [x + dx, 2.4, z + dz], '#1879c9');
      for (const y of [.28, 1.85, 3.42]) {
        for (const side of [-1, 1]) block(scene, [.1, .18, 2.65], [x + side, y, z], '#146cb8');
        block(scene, [2.1, .12, 2.6], [x, y, z], '#4d9cdc');
        for (const dz of [-.65, .55]) {
          for (const dx of [-.42, .42]) {
            const c = carton(scene, .76); c.position.set(x + dx, y + .51, z + dz);
          }
          for (const dx of [-.65, 0, .65]) block(scene, [.12, .13, 1.05], [x + dx, y + .14, z + dz], '#c9ac83');
        }
      }
    }
    // Low cutaway partition and automated storage mast, as in the reference video.
    block(scene, [.18, 1.3, 14], [-5.65, .65, .3], '#edf4fa');
    block(scene, [.22, .09, 14], [-5.65, 1.34, .3], '#ffffff');
    const mast = new THREE.Group(); scene.add(mast);
    for (const x of [-6.15, -5.85]) block(mast, [.09, 5.3, .17], [x, 2.65, -2], '#657c91');
    block(mast, [.65, .25, .85], [-6, .2, -2], '#2679be');
    const lift = new THREE.Group(); mast.add(lift);
    block(lift, [.85, .12, .85], [-6, 0, -2], '#b8ccd9');
    const liftedCargo = carton(lift, .7); liftedCargo.position.set(-6, .42, -2);
    for (const x of [3.35, 6.65, 7.85, 11.15]) {
      for (let z = -5; z < 10; z += .8) block(scene, [.045, .012, .35], [x, .025, z], '#7d8e9d');
    }
    const rollers: THREE.Mesh[] = [];
    const parcels: { group: THREE.Group; lane: number; offset: number }[] = [];
    BELTS.forEach((belt, lane) => {
      const length = belt.end - belt.start;
      for (const side of [-1, 1]) {
        block(scene, [.12, .23, length + .3], [belt.x + side * .57, 1.05, (belt.start + belt.end) / 2], '#187cce');
        for (let z = belt.start; z <= belt.end; z += 2) block(scene, [.12, .9, .12], [belt.x + side * .48, .45, z], '#5289b1');
      }
      for (let z = belt.start; z <= belt.end; z += .22) rollers.push(cylinder(scene, .09, 1.05, [belt.x, BELT_TOP - .09, z], '#b9cbd9'));
      for (let i = 0; i < 6; i++) parcels.push({ group: carton(scene), lane, offset: i / 6 });
      // Inspection portal, with a clear opening around the parcel envelope.
      for (const side of [-1, 1]) block(scene, [.24, 2.5, .65], [belt.x + side * .8, 1.25, -3.8], '#f5f8fc');
      block(scene, [1.84, .3, .65], [belt.x, 2.65, -3.8], '#f5f8fc');
      block(scene, [1.3, .08, .4], [belt.x, 2.45, -3.8], '#47c8fb');
      block(scene, [.2, .34, .06], [belt.x + .81, 1.85, -3.44], '#247fba');
    });
    for (const x of [-5.1, -3.1]) block(scene, [.035, .012, 11], [x, .01, .5], '#70baca');
    const robot = new THREE.Group(); scene.add(robot);
    block(robot, [1.05, .28, 1.15], [0, .38, 0], '#1679ce');
    block(robot, [1, .19, 1.08], [0, .59, 0], '#f0f6fc');
    block(robot, [.8, .03, .9], [0, .7, 0], '#283d50');
    block(robot, [.65, .05, .02], [0, .42, .59], '#50e0f1');
    block(robot, [.38, .13, .04], [0, .56, .6], '#1e3447');
    for (const x of [-.39, .39]) cylinder(robot, .06, .03, [x, .55, .57], '#78e6ee');
    for (const x of [-.46, .46]) block(robot, [.04, .04, .75], [x, .7, 0], '#56c8ec');
    for (const x of [-.5, .5]) for (const z of [-.35, .35]) cylinder(robot, .18, .09, [x, .2, z], '#273748');
    const cargo = carton(robot, .65); cargo.position.y = 1.04;
    const trucks = [5, 9.5].map((x, i) => {
      const group = new THREE.Group(); scene.add(group);
      block(group, [2.25, .28, 6.8], [0, .72, 0], '#30455a');
      block(group, [2.28, 2.25, 4.9], [0, 2.08, -1], '#087bda');
      block(group, [2.3, .08, 4.95], [0, 3.24, -1], '#48adf1');
      for (const side of [-1, 1]) for (let z = -3.3; z < 1.4; z += .22) block(group, [.035, 2.12, .055], [side * 1.155, 2.08, z], '#1389df');
      block(group, [2.25, 1.85, 1.75], [0, 1.85, 2.45], '#f4f8fc');
      block(group, [2.18, .32, 1.6], [0, 2.88, 2.35], '#e5eef6');
      block(group, [2.08, .16, 1.45], [0, 3.1, 2.3], '#f6f9fc');
      block(group, [2, .65, .035], [0, 2.3, 3.34], '#294c68');
      for (const side of [-1, 1]) {
        block(group, [.025, .65, .95], [side * 1.135, 2.3, 2.45], '#305a77');
        block(group, [.23, .35, .15], [side * 1.3, 2.2, 2.9], '#c6d6e4');
        block(group, [.42, .16, .06], [side * .78, 1.3, 3.35], '#fff2bc');
      }
      block(group, [1.35, .42, .04], [0, 1.55, 3.35], '#344c61');
      for (let y = 1.4; y < 1.76; y += .09) block(group, [1.3, .025, .06], [0, y, 3.38], '#9cabb7');
      for (const x of [-.5, .5]) {
        const wiper = block(group, [.035, .35, .025], [x, 2.2, 3.37], '#142e43'); wiper.rotation.z = -.35;
      }
      for (const side of [-1, 1]) {
        block(group, [.04, .04, .29], [side * 1.16, 1.96, 2.08], '#7d8f9e');
        block(group, [.28, .09, .8], [side * 1.15, .88, 2.15], '#a9bac7');
        block(group, [.04, .04, 4.7], [side * 1.18, .95, -1], '#e2edf5');
        for (const z of [-2.7, -.5, 1]) block(group, [.045, .11, .14], [side * 1.19, 1.02, z], '#ffbe60');
      }
      block(group, [2.3, .16, .15], [0, .99, 3.38], '#bdccd8');
      const wheels: THREE.Group[] = [];
      for (const z of [-2.65, -1.65, 2.5]) for (const side of [-1, 1]) {
        const wheel = new THREE.Group(); wheel.position.set(side * 1.13, .47, z); group.add(wheel);
        cylinder(wheel, .47, .28, [0, 0, 0], '#233342');
        cylinder(wheel, .25, .3, [0, 0, 0], '#b9cbd9');
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) cylinder(wheel, .025, .32, [0, Math.sin(angle) * .17, Math.cos(angle) * .17], '#5b7183');
        block(wheel, [.32, .065, .4], [0, 0, 0], '#667e91'); wheels.push(wheel);
      }
      for (const side of [-1, 1]) block(scene, [.04, .01, 18], [x + side * 1.65, .02, 2.5], '#e4b85c');
      return { group, wheels, x, offset: i * 16, previous: truckPosition(i * 16) };
    });
    const clock = new THREE.Clock(); let elapsed = 0; let frame = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function animate() {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), .05);
      if (!pause.current && !reduced.matches && !document.hidden) elapsed += dt;
      for (const parcel of parcels) {
        const p = parcelPosition(parcel.lane, (elapsed / 18 + parcel.offset) % 1); parcel.group.position.set(p.x, p.y, p.z);
      }
      for (const roller of rollers) roller.rotation.x = elapsed * 3;
      lift.position.y = .5 + (1 - Math.cos(elapsed * .32)) * 1.7;
      const p = robotPosition(elapsed); robot.position.set(p.x, p.y, p.z); robot.rotation.y = p.heading;
      for (const truck of trucks) {
        const z = truckPosition(elapsed + truck.offset); truck.group.position.set(truck.x, 0, z);
        const distance = z - truck.previous; for (const wheel of truck.wheels) wheel.rotation.x += distance / .47; truck.previous = z;
      }
      controls.update(); renderer.render(scene, camera);
      const anchors = [new THREE.Vector3(-7, 4.8, -1), new THREE.Vector3(9.5, 3.5, truckPosition(elapsed + 16)), new THREE.Vector3(.4, 2, 2), new THREE.Vector3(p.x, 1.7, p.z)];
      anchors.forEach((anchor, i) => {
        const el = markers.current[i]; if (!el) return;
        anchor.project(camera);
        el.style.transform = 'translate(' + ((anchor.x + 1) * container.clientWidth / 2) + 'px,' + ((1 - anchor.y) * container.clientHeight / 2) + 'px)';
        el.style.visibility = Math.abs(anchor.x) > .95 || Math.abs(anchor.y) > .85 ? 'hidden' : 'visible';
      });
    }
    const resize = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h);
      const span = w < 700 ? 19 : 13.5;
      camera.left = -span * w / h; camera.right = span * w / h;
      camera.top = span; camera.bottom = -span; camera.updateProjectionMatrix();
    }); resize.observe(container); animate();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); controls.dispose();
      scene.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      mats.forEach(m => m.dispose()); grid.geometry.dispose();
      const gm = grid.material; if (Array.isArray(gm)) gm.forEach(m => m.dispose()); else gm.dispose();
      environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="logistics-webgl absolute inset-0">
    {[{ to: '/racks', code: 'STORAGE / A-03', label: '智能货架', tone: '#38bdb5' }, { to: '/trucks', code: 'TRANSPORT / 01', label: '运输卡车', tone: '#4288e9' }, { to: '/parcel', code: 'PARCEL / BX-8472', label: '传送带货箱', tone: '#d7a34b' }, { to: '/racks', code: 'ROBOT / AGV-07', label: '搬运机器人', tone: '#8d79c8' }].map((item, i) => <Link key={item.code} to={item.to} ref={el => { markers.current[i] = el; }} className="world-hotspot" style={{ visibility: 'hidden' }}><span className="world-hotspot-dot" style={{ background: item.tone }} /><span className="world-hotspot-card"><small>{item.code}</small><strong>{item.label}</strong><span aria-hidden="true">↗</span></span></Link>)}
    {failed && <p className="absolute left-1/2 top-1/2 rounded-xl bg-white p-4 text-sm">三维场景需要浏览器启用 WebGL / 硬件加速。</p>}
  </div>;
}
