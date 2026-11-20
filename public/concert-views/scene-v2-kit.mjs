import * as THREE from '../vendor/three.module.min.js';

function tagShared(resource) {
  resource.userData.shared = true;
  return resource;
}

function mergeWithVertexAO(parts) {
  let total = 0;
  for (const part of parts) {
    part.nonIndexed = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry;
    total += part.nonIndexed.attributes.position.count;
  }
  const positions = new Float32Array(total * 3);
  const normals = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  let offset = 0;
  for (const part of parts) {
    const g = part.nonIndexed;
    const pos = g.attributes.position;
    const norm = g.attributes.normal;
    for (let i = 0; i < pos.count; i++) {
      const idx = (offset + i) * 3;
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
      normals[idx] = norm.getX(i);
      normals[idx + 1] = norm.getY(i);
      normals[idx + 2] = norm.getZ(i);
      const ao = part.ao(x, y, z, norm.getY(i));
      colors[idx] = ao[0];
      colors[idx + 1] = ao[1];
      colors[idx + 2] = ao[2];
    }
    offset += pos.count;
    if (g !== part.geometry) g.dispose();
    part.geometry.dispose();
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  merged.computeBoundingSphere();
  return merged;
}

/**
 * Create sculpted arena chair BufferGeometry with baked Vertex AO.
 * Keeps the exact StagePeek coordinate convention: forward = +Z, back at -Z.
 */
export function createV2ChairGeometry(detail = 'near', { o2 = false } = {}) {
  const backHeight = o2 ? 0.28 : 0.38;
  const seatTopY = 0.31;
  const seatBotY = 0.225;

  if (detail === 'far') {
    const seat = new THREE.BoxGeometry(0.46, 0.085, 0.43).translate(0, 0.27, 0);
    const back = new THREE.BoxGeometry(0.46, backHeight, 0.085).translate(0, 0.29 + backHeight / 2, -0.19);
    const base = new THREE.BoxGeometry(0.065, 0.22, 0.22).translate(0, 0.11, -0.06);
    return mergeWithVertexAO([
      { geometry: seat, ao: (_x, y, z, ny) => { const v = THREE.MathUtils.clamp(0.72 + z * 0.38 + Math.max(0, ny) * 0.16, 0.58, 1.0); return [v, v, v]; } },
      { geometry: back, ao: (_x, y, _z, ny) => { const v = THREE.MathUtils.clamp(0.68 + (y - 0.3) * 0.72 + Math.max(0, ny) * 0.12, 0.58, 1.0); return [v, v, v]; } },
      { geometry: base, ao: () => [0.38, 0.40, 0.45] }
    ]);
  }

  // Sculpted padded cushion (Shape X -> world +Z via rotateY(-PI/2))
  const seatShape = new THREE.Shape();
  seatShape.moveTo(-0.19, seatBotY);
  seatShape.lineTo(0.17, seatBotY);
  seatShape.quadraticCurveTo(0.22, seatBotY, 0.22, seatTopY - 0.03);
  seatShape.quadraticCurveTo(0.22, seatTopY, 0.15, seatTopY);
  seatShape.lineTo(-0.17, seatTopY);
  seatShape.quadraticCurveTo(-0.21, seatTopY, -0.21, seatTopY - 0.04);
  seatShape.closePath();

  const cushion = new THREE.ExtrudeGeometry(seatShape, {
    depth: 0.42,
    steps: 1,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 2
  });
  cushion.translate(0, 0, -0.21);
  cushion.rotateY(-Math.PI / 2);

  // Curved contoured backrest
  const backShape = new THREE.Shape();
  backShape.moveTo(-0.20, -0.03);
  backShape.quadraticCurveTo(0, 0.03, 0.20, -0.03);
  backShape.lineTo(0.20, -0.085);
  backShape.quadraticCurveTo(0, -0.025, -0.20, -0.085);
  backShape.closePath();

  const backrest = new THREE.ExtrudeGeometry(backShape, {
    depth: backHeight,
    steps: 1,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.012,
    bevelSegments: 2
  });
  backrest.rotateX(-Math.PI / 2);
  backrest.rotateX(-0.11);
  backrest.translate(0, 0.30, -0.17);

  // Center stanchion + side bracket accents
  const stanchion = new THREE.BoxGeometry(0.065, 0.23, 0.22).translate(0, 0.115, -0.06);
  const leftBracket = new THREE.BoxGeometry(0.032, 0.22, 0.22).translate(-0.22, 0.21, -0.04);
  const rightBracket = new THREE.BoxGeometry(0.032, 0.22, 0.22).translate(0.22, 0.21, -0.04);

  return mergeWithVertexAO([
    { geometry: cushion, ao: (_x, y, z, ny) => { const v = THREE.MathUtils.clamp(0.68 + (z + 0.18) * 0.45 + Math.max(0, ny) * 0.16, 0.56, 1.0); return [v, v, v]; } },
    { geometry: backrest, ao: (_x, y, _z, ny) => { const v = THREE.MathUtils.clamp(0.64 + (y - 0.3) * 0.85 + Math.max(0, ny) * 0.12, 0.55, 1.0); return [v, v, v]; } },
    { geometry: stanchion, ao: () => [0.34, 0.36, 0.42] },
    { geometry: leftBracket, ao: () => [0.36, 0.38, 0.44] },
    { geometry: rightBracket, ao: () => [0.36, 0.38, 0.44] }
  ]);
}

/**
 * Seated audience silhouette for optional front-row sightline preview.
 */
export function createCrowdSilhouetteGeometry() {
  // Extend the torso into the cushion while preserving the sightline height.
  const torso = new THREE.CylinderGeometry(0.14, 0.18, 0.65, 8);
  torso.scale(1.2, 1, 0.65);
  torso.translate(0, 0.60, 0);

  const shoulders = new THREE.SphereGeometry(0.20, 8, 6);
  shoulders.scale(1.05, 0.65, 0.6);
  shoulders.translate(0, 0.92, 0);

  const head = new THREE.SphereGeometry(0.10, 8, 6);
  head.scale(0.92, 1.12, 0.98);
  head.translate(0, 1.14, 0.01);

  return mergeWithVertexAO([
    { geometry: torso, ao: () => [0.46, 0.48, 0.55] },
    { geometry: shoulders, ao: () => [0.56, 0.58, 0.65] },
    { geometry: head, ao: () => [0.68, 0.70, 0.76] }
  ]);
}

/**
 * Shared procedural textures and IBL environment for the v2 renderer.
 */
export function createSceneV2Assets(renderer) {
  // 1. Concrete tread/riser texture
  const cSize = 256;
  const cCanvas = document.createElement('canvas');
  cCanvas.width = cSize;
  cCanvas.height = cSize;
  const cCtx = cCanvas.getContext('2d');
  cCtx.fillStyle = '#d8dee8';
  cCtx.fillRect(0, 0, cSize, cSize);
  for (let i = 0; i < 3600; i++) {
    const x = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * cSize;
    const y = ((Math.sin(i * 78.233) * 19341.123) % 1 + 1) % 1 * cSize;
    const shade = 188 + (i % 34);
    cCtx.fillStyle = `rgba(${shade}, ${shade + 4}, ${shade + 10}, 0.25)`;
    cCtx.fillRect(x, y, 1.5, 1.5);
  }
  cCtx.strokeStyle = 'rgba(40, 50, 70, 0.16)';
  cCtx.lineWidth = 2;
  cCtx.beginPath();
  cCtx.moveTo(0, cSize * 0.5);
  cCtx.lineTo(cSize, cSize * 0.5);
  cCtx.moveTo(cSize * 0.5, 0);
  cCtx.lineTo(cSize * 0.5, cSize);
  cCtx.stroke();

  const concreteTex = tagShared(new THREE.CanvasTexture(cCanvas));
  concreteTex.wrapS = concreteTex.wrapT = THREE.RepeatWrapping;
  concreteTex.colorSpace = THREE.SRGBColorSpace;
  concreteTex.anisotropy = 4;

  // 2. Modular arena floor deck texture
  const fCanvas = document.createElement('canvas');
  fCanvas.width = cSize;
  fCanvas.height = cSize;
  const fCtx = fCanvas.getContext('2d');
  fCtx.fillStyle = '#dde4ef';
  fCtx.fillRect(0, 0, cSize, cSize);
  fCtx.strokeStyle = 'rgba(15, 22, 34, 0.16)';
  fCtx.lineWidth = 1.5;
  for (let i = 0; i <= cSize; i += 64) {
    fCtx.beginPath(); fCtx.moveTo(i, 0); fCtx.lineTo(i, cSize); fCtx.stroke();
    fCtx.beginPath(); fCtx.moveTo(0, i); fCtx.lineTo(cSize, i); fCtx.stroke();
  }
  const floorTex = tagShared(new THREE.CanvasTexture(fCanvas));
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.colorSpace = THREE.SRGBColorSpace;
  floorTex.repeat.set(16, 12);
  floorTex.anisotropy = 4;

  // Stripes follow mowing passes. Fine deterministic variation keeps the
  // field readable at pitch level without introducing a second ground plane.
  const turf = document.createElement('canvas');
  turf.width = turf.height = cSize;
  const grass = turf.getContext('2d');
  for (let i = 0; i < 12; i++) {
    grass.fillStyle = i % 2 ? '#42604b' : '#526d52';
    grass.fillRect(0, i * cSize / 12, cSize, cSize / 12 + 1);
  }
  for (let i = 0; i < 4400; i++) {
    grass.fillStyle = i % 3 ? '#283d2d2b' : '#aab58b36';
    grass.fillRect((Math.imul(i + 1, 59351) >>> 6) % cSize, (Math.imul(i + 1, 86413) >>> 9) % cSize, 1, 2);
  }
  const turfTex = tagShared(new THREE.CanvasTexture(turf));
  turfTex.colorSpace = THREE.SRGBColorSpace;
  turfTex.anisotropy = 8;

  // 3. Concert LED screen texture
  const sW = 512, sH = 256;
  const sCanvas = document.createElement('canvas');
  sCanvas.width = sW;
  sCanvas.height = sH;
  const sCtx = sCanvas.getContext('2d');
  const bg = sCtx.createLinearGradient(0, 0, sW, sH);
  bg.addColorStop(0, '#0a1328');
  bg.addColorStop(0.5, '#1d1646');
  bg.addColorStop(1, '#0d1828');
  sCtx.fillStyle = bg;
  sCtx.fillRect(0, 0, sW, sH);

  const glow = sCtx.createRadialGradient(sW * 0.5, sH * 0.58, 10, sW * 0.5, sH * 0.58, sW * 0.48);
  glow.addColorStop(0, 'rgba(255, 206, 132, 0.92)');
  glow.addColorStop(0.32, 'rgba(158, 108, 255, 0.62)');
  glow.addColorStop(0.7, 'rgba(42, 134, 214, 0.24)');
  glow.addColorStop(1, 'rgba(10, 14, 24, 0)');
  sCtx.fillStyle = glow;
  sCtx.fillRect(0, 0, sW, sH);

  const streak = sCtx.createLinearGradient(0, sH * 0.56, sW, sH * 0.56);
  streak.addColorStop(0, 'rgba(120,210,255,0)');
  streak.addColorStop(0.5, 'rgba(255,244,218,0.88)');
  streak.addColorStop(1, 'rgba(200,150,255,0)');
  sCtx.fillStyle = streak;
  sCtx.fillRect(0, sH * 0.54, sW, sH * 0.05);

  sCtx.strokeStyle = 'rgba(225, 238, 255, 0.22)';
  sCtx.lineWidth = 2;
  for (let r = 1; r <= 3; r++) {
    sCtx.beginPath();
    sCtx.arc(sW * 0.5, sH * 0.6, 34 * r, Math.PI, 0);
    sCtx.stroke();
  }
  sCtx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  for (let y = 0; y < sH; y += 4) sCtx.fillRect(0, y, sW, 1);
  for (let x = 0; x < sW; x += 6) sCtx.fillRect(x, 0, 1, sH);

  const screenTex = tagShared(new THREE.CanvasTexture(sCanvas));
  screenTex.colorSpace = THREE.SRGBColorSpace;

  // 4. Soft volumetric beam cone texture
  const bCanvas = document.createElement('canvas');
  bCanvas.width = 128;
  bCanvas.height = 256;
  const bCtx = bCanvas.getContext('2d');
  const vert = bCtx.createLinearGradient(0, 0, 0, 256);
  vert.addColorStop(0, 'rgba(255,255,255,0.75)');
  vert.addColorStop(0.3, 'rgba(255,255,255,0.34)');
  vert.addColorStop(1, 'rgba(255,255,255,0)');
  bCtx.fillStyle = vert;
  bCtx.fillRect(0, 0, 128, 256);
  const horiz = bCtx.createLinearGradient(0, 0, 128, 0);
  horiz.addColorStop(0, 'rgba(0,0,0,1)');
  horiz.addColorStop(0.25, 'rgba(0,0,0,0)');
  horiz.addColorStop(0.75, 'rgba(0,0,0,0)');
  horiz.addColorStop(1, 'rgba(0,0,0,1)');
  bCtx.globalCompositeOperation = 'destination-out';
  bCtx.fillStyle = horiz;
  bCtx.fillRect(0, 0, 128, 256);
  const beamTex = tagShared(new THREE.CanvasTexture(bCanvas));
  beamTex.colorSpace = THREE.SRGBColorSpace;

  // 5. Procedural IBL Environment Map
  let envRT = null;
  if (renderer && typeof THREE.PMREMGenerator === 'function') {
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color('#090e17');
      const panelGeo = new THREE.PlaneGeometry(18, 8);
      const panels = [
        [0, 14, -12, new THREE.Color(2.2, 1.9, 1.4)],
        [-16, 12, 8, new THREE.Color(0.95, 1.4, 2.2)],
        [16, 12, 8, new THREE.Color(1.3, 0.9, 2.0)]
      ];
      for (const [px, py, pz, col] of panels) {
        const m = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
        m.position.set(px, py, pz);
        m.lookAt(0, 0, 0);
        envScene.add(m);
      }
      envRT = pmrem.fromScene(envScene, 0.04);
      pmrem.dispose();
      panelGeo.dispose();
    } catch {
      envRT = null;
    }
  }

  return {
    concreteTex,
    floorTex,
    turfTex,
    screenTex,
    beamTex,
    envTexture: envRT?.texture || null,
    farChairGeo: tagShared(createV2ChairGeometry('far')),
    nearChairGeo: tagShared(createV2ChairGeometry('near')),
    o2FarChairGeo: tagShared(createV2ChairGeometry('far', { o2: true })),
    o2NearChairGeo: tagShared(createV2ChairGeometry('near', { o2: true })),
    crowdGeo: tagShared(createCrowdSilhouetteGeometry()),
    dispose() {
      concreteTex.dispose();
      floorTex.dispose();
      turfTex.dispose();
      screenTex.dispose();
      beamTex.dispose();
      envRT?.dispose();
      this.farChairGeo.dispose();
      this.nearChairGeo.dispose();
      this.o2FarChairGeo.dispose();
      this.o2NearChairGeo.dispose();
      this.crowdGeo.dispose();
    }
  };
}

/**
 * Add realistic performer silhouette with mic stand (replaces boxy stick figure).
 */
export function buildSilhouettePerformer(p, parent, { isEventOverlay = false } = {}) {
  const person = new THREE.Group();
  person.position.set(p[0], p[1], p[2]);
  person.rotation.y = Math.atan2(-p[0], -p[2]);
  person.userData.illustrative = true;
  parent.add(person);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: isEventOverlay ? '#3a2238' : '#1d2433',
    emissive: isEventOverlay ? '#7d2f52' : '#3a4a6b',
    emissiveIntensity: 0.35,
    roughness: 0.48
  });
  const metalMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.3, metalness: 0.85 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.155, 0.45, 6, 12), bodyMat);
  torso.position.y = 1.12;
  torso.scale.set(1.14, 1, 0.72);
  torso.castShadow = true;
  person.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 10), bodyMat);
  head.position.y = 1.63;
  head.scale.set(0.92, 1.12, 0.98);
  head.castShadow = true;
  person.add(head);

  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.045, 0.82, 8), bodyMat);
    leg.position.set(side * 0.095, 0.42, 0);
    leg.castShadow = true;
    person.add(leg);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.036, 0.56, 8), bodyMat);
    arm.position.set(side * 0.22, 1.05, 0.05);
    arm.rotation.z = side * 0.14;
    arm.rotation.x = side > 0 ? -0.35 : 0.1;
    person.add(arm);
  }

  const micPole = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 1.38, 8), metalMat);
  micPole.position.set(0.18, 0.69, 0.32);
  person.add(micPole);
  return person;
}

function addSpotlightHousing(cone, metal) {
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.18, .24, .42, 10), metal);
  lamp.position.y = .13;
  cone.add(lamp);
}

/**
 * Add concert truss portal, line arrays, and volumetric light cones over a stage box.
 */
export function addStageLightingAndTruss(rig, mainRect, center, size, assets, { centerStage = false, hasScreenBox = false, audienceCenter = null, ceilingY = null } = {}) {
  const w = size[0], h = size[1], d = size[2];
  if (w < 5 || d < 4) return;

  const trussMat = new THREE.MeshStandardMaterial({ color: '#1b212c', roughness: 0.45, metalness: 0.82 });
  const speakerMat = new THREE.MeshStandardMaterial({ color: '#10141c', roughness: 0.72, metalness: 0.3 });
  const trimMat = new THREE.MeshStandardMaterial({ color: '#78889e', roughness: 0.32, metalness: 0.84 });

  // Metallic stage deck edge trim
  const trim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.09, d + 0.08), trimMat);
  trim.position.set(center[0], center[1] + h / 2 - 0.06, center[2]);
  trim.rotation.y = mainRect?.angle || 0;
  rig.add(trim);

  const stageTopY = center[1] + h / 2;
  // Reserve space for the fixture housings above the light beams.
  const trussH = Math.min(13.5, Math.max(7.0, Math.max(w, d) * 0.52),
    ceilingY == null ? Infinity : ceilingY - stageTopY - (centerStage ? 1.65 : 1.3));
  if (trussH < 2.7) return;

  if (centerStage) {
    // 4-sided suspended concert rig with corner lighting pods, cables, and downward beams
    const spanX = w * 0.78, spanZ = d * 0.78;
    const grp = new THREE.Group();
    grp.position.set(center[0], stageTopY, center[2]);
    grp.rotation.y = mainRect?.angle || 0;

    for (const sx of [-spanX / 2, spanX / 2]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, spanZ + 0.38), trussMat);
      beam.position.set(sx, trussH, 0);
      grp.add(beam);
    }
    for (const sz of [-spanZ / 2, spanZ / 2]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(spanX + 0.38, 0.38, 0.38), trussMat);
      beam.position.set(0, trussH, sz);
      grp.add(beam);
    }
    // Inner cross truss + central lighting halo
    const crossX = new THREE.Mesh(new THREE.BoxGeometry(spanX * 0.9, 0.28, 0.28), trussMat);
    crossX.position.set(0, trussH, 0);
    grp.add(crossX);
    const crossZ = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, spanZ * 0.9), trussMat);
    crossZ.position.set(0, trussH, 0);
    grp.add(crossZ);

    // Slim corner steel rigging cables extending upward + corner line-array hangs
    const cableMat = new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.9, roughness: 0.3 });
    const cableLength = Math.min(10, ceilingY == null ? Infinity : ceilingY - stageTopY - trussH - .08);
    for (const sx of [-spanX / 2, spanX / 2]) {
      for (const sz of [-spanZ / 2, spanZ / 2]) {
        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, cableLength, 6), cableMat);
        cable.position.set(sx, trussH + cableLength / 2, sz);
        grp.add(cable);
        const pod = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.9), speakerMat);
        pod.position.set(sx * 0.92, trussH - 0.8, sz * 0.92);
        grp.add(pod);
      }
    }

    // 4 soft downward volumetric beams toward center stage
    const beamGeo = new THREE.ConeGeometry(Math.min(3.2, Math.min(w, d) * 0.22), trussH * 1.05, 16, 1, true);
    beamGeo.translate(0, -trussH * 0.525, 0);
    const beamColors = ['#8ec5ff', '#d8a6ff', '#ffd99e', '#7dd3fc'];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([cx, cz], i) => {
      const mat = new THREE.MeshBasicMaterial({
        map: assets.beamTex, color: beamColors[i], transparent: true, opacity: 0.16,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      });
      const cone = new THREE.Mesh(beamGeo, mat);
      cone.position.set(cx * spanX * 0.32, trussH - 0.1, cz * spanZ * 0.32);
      cone.lookAt(0, 0, 0);
      cone.rotateX(-Math.PI / 2);
      addSpotlightHousing(cone, speakerMat);
      grp.add(cone);
    });
    rig.add(grp);
  } else {
    // The origin can be at a stage edge in retained rectangular layouts.
    // Use their audience centre to choose the front edge of the display rig.
    const explicitAngle = mainRect?.angle;
    const inferFromSeats = audienceCenter && !Number.isFinite(explicitAngle);
    const dx = (inferFromSeats ? audienceCenter.x : 0) - center[0];
    const dz = (inferFromSeats ? audienceCenter.z : 0) - center[2];
    const zAxisStage = Math.abs(dz) >= Math.abs(dx);
    const span = (zAxisStage ? w : d) * 0.9;
    const depth = (zAxisStage ? d : w) * 0.82;
    const grp = new THREE.Group();
    grp.position.set(center[0], stageTopY, center[2]);
    // Local +Z faces the audience.
    const yaw = Number.isFinite(explicitAngle) && (audienceCenter || explicitAngle !== 0)
      ? explicitAngle
      : zAxisStage
        ? (dz >= 0 ? 0 : Math.PI)
        : (dx >= 0 ? Math.PI / 2 : -Math.PI / 2);
    grp.rotation.y = yaw;

    for (const sx of [-span / 2, span / 2]) {
      for (const sz of [-depth / 2, depth / 2]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.42, trussH, 0.42), trussMat);
        post.position.set(sx, trussH / 2, sz);
        post.castShadow = true;
        grp.add(post);
      }
      const sideBeam = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, depth), trussMat);
      sideBeam.position.set(sx, trussH, 0);
      grp.add(sideBeam);
    }
    for (const sz of [-depth / 2, 0, depth / 2]) {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(span + 0.4, 0.4, 0.4), trussMat);
      cross.position.set(0, trussH, sz);
      grp.add(cross);
    }

    const frontZ = depth / 2;
    const backZ = -depth / 2;

    // Add an LED backdrop screen inside the back truss when the layout didn't supply a screen box
    if (!hasScreenBox) {
      const scrW = span * 0.88;
      const scrH = Math.min(trussH * 0.72, Math.max(4.2, scrW * 0.40));
      const scrY = Math.min(trussH - scrH / 2 - 0.5, scrH / 2 + 0.75);
      const backFrame = new THREE.Mesh(new THREE.BoxGeometry(scrW + 0.4, scrH + 0.4, 0.35), trussMat);
      backFrame.position.set(0, scrY, backZ);
      backFrame.castShadow = true;
      grp.add(backFrame);

      const ledMat = new THREE.MeshStandardMaterial({
        map: assets.screenTex,
        emissiveMap: assets.screenTex,
        emissive: '#ffffff',
        emissiveIntensity: 1.05,
        roughness: 0.35
      });
      const ledPlane = new THREE.Mesh(new THREE.PlaneGeometry(scrW, scrH), ledMat);
      ledPlane.position.set(0, scrY, backZ + 0.2);
      grp.add(ledPlane);
    }

    for (const sx of [-span / 2 - 0.55, span / 2 + 0.55]) {
      for (let k = 0; k < 5; k++) {
        const sp = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.28, 0.55), speakerMat);
        sp.position.set(sx, trussH - 1.2 - k * 0.32, frontZ - k * k * 0.02);
        grp.add(sp);
      }
    }

    // Soft additive volumetric light beams
    const beamGeo = new THREE.ConeGeometry(Math.min(3.5, span * 0.16), trussH * 1.15, 16, 1, true);
    beamGeo.translate(0, -trussH * 0.575, 0);
    const beamColors = ['#8ec5ff', '#d8a6ff', '#ffd99e'];
    for (let i = 0; i < 4; i++) {
      const bx = -span * 0.33 + (span * 0.66 * i) / 3;
      const mat = new THREE.MeshBasicMaterial({
        map: assets.beamTex,
        color: beamColors[i % beamColors.length],
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const cone = new THREE.Mesh(beamGeo, mat);
      cone.position.set(bx, trussH - 0.1, frontZ * 0.65);
      cone.rotation.x = 0.26;
      cone.rotation.z = (i - 1.5) * 0.08;
      addSpotlightHousing(cone, speakerMat);
      grp.add(cone);
    }
    rig.add(grp);
  }
}

/**
 * Add subtle proscenium portal & warm acoustic backdrop for classical theatre / concert-hall stages.
 */
export function addTheatreProscenium(rig, footprint, base, top, wood, assets, ceilingY = null) {
  if (!footprint?.length) return;
  const xs = footprint.map((p) => p[0]);
  const zs = footprint.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minZ = Math.min(...zs), maxZ = Math.max(...zs);
  const w = maxX - minX;
  const wallH = Math.min(10.5, Math.max(6.0, w * 0.42),
    ceilingY == null ? Infinity : ceilingY - top - .7);
  if (wallH < 2.7) return;
  const cx = (minX + maxX) / 2;
  // Back edge is the edge further from the audience (+Z side usually has auditorium)
  const backZ = Math.abs(minZ) >= Math.abs(maxZ) ? minZ + 0.4 : maxZ - 0.4;
  const frontZ = Math.abs(minZ) >= Math.abs(maxZ) ? maxZ - 0.4 : minZ + 0.4;
  const dir = frontZ > backZ ? 1 : -1;

  const shellMat = new THREE.MeshStandardMaterial({
    color: wood ? '#5b3f2b' : '#242b3a',
    map: assets.concreteTex,
    roughness: 0.68,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const portalMat = new THREE.MeshStandardMaterial({
    color: wood ? '#332419' : '#1b202b',
    roughness: 0.52,
    metalness: 0.3
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: '#c9a468',
    emissive: '#4d3616',
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.72
  });

  // Acoustic rear wall + subtle vertical acoustic ribs + proscenium portal
  const rear = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, wallH, 0.35), shellMat);
  rear.position.set(cx, top + wallH / 2, backZ);
  rear.receiveShadow = true;
  rig.add(rear);

  const ribCount = 7;
  for (let i = 0; i < ribCount; i++) {
    const rx = minX + w * (0.14 + (0.72 * i) / (ribCount - 1));
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.22, wallH * 0.88, 0.45), portalMat);
    rib.position.set(rx, top + wallH / 2, backZ + dir * 0.12);
    rig.add(rib);
  }

  // Shells with an authored proscenium replace this frame while retaining the stage wash and backdrop.
  const frame = new THREE.Group();
  frame.userData.shellNode = 'shell_bowl_mass_proscenium';
  rig.add(frame);
  const archZ = backZ + dir * 0.55;
  for (const sx of [minX + w * 0.06, maxX - w * 0.06]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, wallH + 0.3, 0.85), portalMat);
    col.position.set(sx, top + (wallH + 0.3) / 2, archZ);
    frame.add(col);
  }
  const header = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 0.75, 0.9), portalMat);
  header.position.set(cx, top + wallH + 0.2, archZ);
  frame.add(header);
  const goldStrip = new THREE.Mesh(new THREE.BoxGeometry(w * 0.88, 0.14, 0.96), trimMat);
  goldStrip.position.set(cx, top + wallH - 0.14, archZ);
  frame.add(goldStrip);

  // Warm theatrical stage light so proscenium & rear shell catch grazing highlights
  const washLight = new THREE.PointLight('#ffdca8', 3.2, Math.max(28, w * 1.8), 1.15);
  washLight.position.set(cx, top + wallH * 0.72, archZ + dir * 2.4);
  rig.add(washLight);

  // Warm soft theatrical wash beams aimed onto stage deck
  const beamGeo = new THREE.ConeGeometry(Math.min(3.4, w * 0.16), wallH * 1.05, 16, 1, true);
  beamGeo.translate(0, -wallH * 0.525, 0);
  for (let i = 0; i < 3; i++) {
    const bx = cx + (i - 1) * (w * 0.22);
    const mat = new THREE.MeshBasicMaterial({
      map: assets.beamTex, color: '#ffe4ba', transparent: true, opacity: 0.24,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    const cone = new THREE.Mesh(beamGeo, mat);
    cone.position.set(bx, top + wallH - 0.2, archZ + dir * 0.5);
    cone.rotation.x = -dir * 0.31;
    addSpotlightHousing(cone, portalMat);
    rig.add(cone);
  }
}

/**
 * Add architectural stairs LED nosing strips & upper gallery glass balustrades for source-display bowls.
 */
export function decorateBowlDisplay(world, display, _assets) {
  if (!display) return;
  // 1. Subtle amber LED nosing strips along aisle half-steps
  if (display.aisleSteps?.length) {
    const stripPts = [];
    for (const step of display.aisleSteps) {
      const t = step.tread;
      if (!t || t.length < 4) continue;
      const a = t[0], b = t[1], c = t[2], d = t[3];
      const f = 0.14;
      stripPts.push(
        a[0], a[1] + 0.008, a[2],
        b[0], b[1] + 0.008, b[2],
        b[0] + (c[0] - b[0]) * f, b[1] + 0.008, b[2] + (c[2] - b[2]) * f,
        a[0], a[1] + 0.008, a[2],
        b[0] + (c[0] - b[0]) * f, b[1] + 0.008, b[2] + (c[2] - b[2]) * f,
        a[0] + (d[0] - a[0]) * f, a[1] + 0.008, a[2] + (d[2] - a[2]) * f
      );
    }
    if (stripPts.length) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(stripPts, 3));
      geo.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        emissive: '#d97706',
        emissiveIntensity: 0.9,
        roughness: 0.35,
        side: THREE.DoubleSide,
        // The strips already sit above the treads. A slope-based offset at a
        // grazing angle can pull the light through an opaque exterior wall.
        polygonOffset: true,
        polygonOffsetUnits: -2
      });
      world.add(new THREE.Mesh(geo, mat));
    }
  }

  // 2. Tempered glass balustrade along front of elevated banks / gallery fascias
  const glassFaces = [];
  const railSegments = [];
  if (display.gallery?.fascias?.length) {
    for (const f of display.gallery.fascias) {
      if (!f || f.length < 4) continue;
      const a = f[3], b = f[2];
      const yTop = Math.max(a[1], b[1]);
      if (yTop < 1.5) continue;
      const h = 0.85;
      glassFaces.push(
        a[0], yTop, a[2], b[0], yTop, b[2], b[0], yTop + h, b[2],
        a[0], yTop, a[2], b[0], yTop + h, b[2], a[0], yTop + h, a[2]
      );
      railSegments.push([[a[0], yTop + h + 0.02, a[2]], [b[0], yTop + h + 0.02, b[2]]]);
    }
  } else if (display.banks?.length) {
    for (const bank of display.banks) {
      const frontRow = bank.rows?.[0]?.front;
      if (!frontRow || frontRow.length < 2) continue;
      const y = bank.rows[0].y;
      if (y < 2.2) continue;
      const h = 0.82;
      for (let i = 1; i < frontRow.length; i++) {
        const a = frontRow[i - 1], b = frontRow[i];
        glassFaces.push(
          a[0], y, a[2], b[0], y, b[2], b[0], y + h, b[2],
          a[0], y, a[2], b[0], y + h, b[2], a[0], y + h, a[2]
        );
        railSegments.push([[a[0], y + h + 0.02, a[2]], [b[0], y + h + 0.02, b[2]]]);
      }
    }
  }

  if (glassFaces.length) {
    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute('position', new THREE.Float32BufferAttribute(glassFaces, 3));
    gGeo.computeVertexNormals();
    const gMat = new THREE.MeshStandardMaterial({
      color: '#9ec5e8',
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.25,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const glass = new THREE.Mesh(gGeo, gMat);
    glass.userData.shellNode = 'shell_balustrades';
    world.add(glass);
  }
  if (railSegments.length) {
    const railInst = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.05, 0.05, 1),
      new THREE.MeshStandardMaterial({ color: '#9fb0c4', roughness: 0.3, metalness: 0.85 }),
      railSegments.length
    );
    const dummy = new THREE.Object3D();
    railSegments.forEach(([a, b], i) => {
      const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
      const len = va.distanceTo(vb);
      dummy.position.copy(va).lerp(vb, 0.5);
      dummy.lookAt(vb);
      dummy.scale.set(1, 1, Math.max(0.01, len + 0.02));
      dummy.updateMatrix();
      railInst.setMatrixAt(i, dummy.matrix);
    });
    railInst.instanceMatrix.needsUpdate = true;
    railInst.userData.shellNode = 'shell_balustrades';
    world.add(railInst);
  }
}

/**
 * Add front glass balustrades and stair accent strips for generic/parametric venues.
 */
export function decorateParametricBowl(world, venue, sectionPointFn, halfAngleFn, rowCountFn = null) {
  if (!venue?.sections?.length || !venue.tiers?.length) return;
  const glassFaces = [];
  const railSegments = [];
  const stripPts = [];

  for (const section of venue.sections) {
    if (section.block) continue;
    const tierData = venue.tiers[section.tier];
    if (!tierData) continue;
    const half = halfAngleFn(venue, section);
    const yBase = tierData[2] ?? 0;

    // Front glass balustrade on elevated tiers (tier > 0 or elevated base)
    if (section.tier > 0 || yBase > 1.8) {
      const segs = 6;
      const h = 0.82;
      for (let i = 0; i < segs; i++) {
        const la = -0.95 + (1.9 * i) / segs;
        const lb = -0.95 + (1.9 * (i + 1)) / segs;
        const a = sectionPointFn(venue, section, 0.02, la, half);
        const b = sectionPointFn(venue, section, 0.02, lb, half);
        glassFaces.push(
          a[0], a[1], a[2], b[0], b[1], b[2], b[0], b[1] + h, b[2],
          a[0], a[1], a[2], b[0], b[1] + h, b[2], a[0], a[1] + h, a[2]
        );
        railSegments.push([[a[0], a[1] + h + 0.02, a[2]], [b[0], b[1] + h + 0.02, b[2]]]);
      }
    }

    // Subtle aisle boundary strip aligned with actual row count
    const rows = rowCountFn ? rowCountFn(venue, section) : 10;
    for (let r = 0; r < rows; r++) {
      const t0 = r / rows;
      const t1 = (r + 0.10) / rows;
      const p0 = sectionPointFn(venue, section, t0, -0.985, half);
      const p1 = sectionPointFn(venue, section, t0, -0.935, half);
      const p2 = sectionPointFn(venue, section, t1, -0.935, half);
      const p3 = sectionPointFn(venue, section, t1, -0.985, half);
      stripPts.push(
        p0[0], p0[1] - 0.012, p0[2], p1[0], p1[1] - 0.012, p1[2], p2[0], p2[1] - 0.012, p2[2],
        p0[0], p0[1] - 0.012, p0[2], p2[0], p2[1] - 0.012, p2[2], p3[0], p3[1] - 0.012, p3[2]
      );
    }
  }

  if (glassFaces.length) {
    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute('position', new THREE.Float32BufferAttribute(glassFaces, 3));
    gGeo.computeVertexNormals();
    const glass = new THREE.Mesh(gGeo, new THREE.MeshStandardMaterial({
      color: '#9ec5e8', transparent: true, opacity: 0.18, roughness: 0.1, metalness: 0.25, depthWrite: false, side: THREE.DoubleSide
    }));
    glass.userData.shellNode = 'shell_balustrades';
    world.add(glass);
  }
  if (railSegments.length) {
    const railInst = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.05, 0.05, 1),
      new THREE.MeshStandardMaterial({ color: '#9fb0c4', roughness: 0.3, metalness: 0.85 }),
      railSegments.length
    );
    const dummy = new THREE.Object3D();
    railSegments.forEach(([a, b], i) => {
      const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
      dummy.position.copy(va).lerp(vb, 0.5);
      dummy.lookAt(vb);
      dummy.scale.set(1, 1, Math.max(0.01, va.distanceTo(vb) + 0.02));
      dummy.updateMatrix();
      railInst.setMatrixAt(i, dummy.matrix);
    });
    railInst.instanceMatrix.needsUpdate = true;
    railInst.userData.shellNode = 'shell_balustrades';
    world.add(railInst);
  }
  if (stripPts.length) {
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.Float32BufferAttribute(stripPts, 3));
    sGeo.computeVertexNormals();
    world.add(new THREE.Mesh(sGeo, new THREE.MeshStandardMaterial({
      color: '#f59e0b', emissive: '#d97706', emissiveIntensity: 0.65, roughness: 0.4, side: THREE.DoubleSide
    })));
  }
}

/**
 * Add steel truss corner posts on event equipment polygons (FOH / delay towers).
 */
export function decorateEquipmentShape(shape, parent) {
  if (!shape?.polygon?.length || !shape.height) return;
  const xs = shape.polygon.map((p) => p[0]);
  const zs = shape.polygon.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minZ = Math.min(...zs), maxZ = Math.max(...zs);
  const trussMat = new THREE.MeshStandardMaterial({ color: '#1b222c', roughness: 0.45, metalness: 0.8 });
  const h = Math.max(shape.height, 2.4);
  for (const x of [minX + 0.15, maxX - 0.15]) {
    for (const z of [minZ + 0.15, maxZ - 0.15]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.18), trussMat);
      post.position.set(x, h / 2, z);
      post.castShadow = true;
      parent.add(post);
    }
  }
}
