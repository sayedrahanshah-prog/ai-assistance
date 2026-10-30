/**
 * Procedural 3D Virtual Human Character Rig
 * Built using Three.js PBR standards without external 404 dependencies.
 */

import * as THREE from 'three';
import { CharacterGender, CharacterOutfit } from '../../types/agent';

export interface HumanJoints {
  root: THREE.Group;
  pedestal: THREE.Group;
  body: THREE.Group;
  pelvis: THREE.Mesh;
  spine: THREE.Group;
  torso: THREE.Mesh;
  chestArmor?: THREE.Mesh;
  neck: THREE.Mesh;
  head: THREE.Group;
  face: THREE.Mesh;
  hair: THREE.Mesh;
  eyeLeft: THREE.Mesh;
  eyeRight: THREE.Mesh;
  mouth: THREE.Mesh;
  leftArm: {
    shoulder: THREE.Group;
    upper: THREE.Mesh;
    elbow: THREE.Group;
    forearm: THREE.Mesh;
    hand: THREE.Mesh;
  };
  rightArm: {
    shoulder: THREE.Group;
    upper: THREE.Mesh;
    elbow: THREE.Group;
    forearm: THREE.Mesh;
    hand: THREE.Mesh;
    laser: THREE.Mesh;
  };
  leftLeg: {
    hip: THREE.Group;
    thigh: THREE.Mesh;
    knee: THREE.Group;
    shin: THREE.Mesh;
    foot: THREE.Mesh;
  };
  rightLeg: {
    hip: THREE.Group;
    thigh: THREE.Mesh;
    knee: THREE.Group;
    shin: THREE.Mesh;
    foot: THREE.Mesh;
  };
}

export function createProceduralHuman(
  gender: CharacterGender = 'female',
  outfit: CharacterOutfit = 'cyber_suit',
  hologramGlow: boolean = true
): { group: THREE.Group; joints: HumanJoints; materials: Record<string, THREE.Material> } {
  const root = new THREE.Group();
  root.name = 'VirtualHumanRoot';

  // 1. Procedural Materials Library
  // Generate procedural woven/carbon fabric canvas texture
  const fabricCanvas = document.createElement('canvas');
  fabricCanvas.width = 128;
  fabricCanvas.height = 128;
  const ctx = fabricCanvas.getContext('2d')!;
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 128; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
    ctx.stroke();
  }
  const fabricTexture = new THREE.CanvasTexture(fabricCanvas);
  fabricTexture.wrapS = THREE.RepeatWrapping;
  fabricTexture.wrapT = THREE.RepeatWrapping;
  fabricTexture.repeat.set(4, 4);
  fabricTexture.colorSpace = THREE.SRGBColorSpace;

  // Outfit color palletes
  let suitColor = 0x0f172a; // dark slate
  let armorColor = 0x1e293b;
  let accentEmissive = 0x06b6d4; // cyan
  let metalnessVal = 0.85;
  let roughnessVal = 0.25;

  if (outfit === 'executive_formal') {
    suitColor = 0x18181b;
    armorColor = 0x27272a;
    accentEmissive = 0x38bdf8;
    metalnessVal = 0.2;
    roughnessVal = 0.65;
  } else if (outfit === 'tactical_ops') {
    suitColor = 0x09090b;
    armorColor = 0x18181b;
    accentEmissive = 0xf59e0b; // amber
    metalnessVal = 0.9;
    roughnessVal = 0.35;
  } else if (outfit === 'casual_tech') {
    suitColor = 0x1e1b4b;
    armorColor = 0x312e81;
    accentEmissive = 0xa855f7; // purple
    metalnessVal = 0.3;
    roughnessVal = 0.5;
  }

  const materials: Record<string, THREE.Material> = {
    skin: new THREE.MeshStandardMaterial({
      color: gender === 'female' ? 0xf0c8ae : 0xd8ad93,
      roughness: 0.55,
      metalness: 0.05,
    }),
    suit: new THREE.MeshStandardMaterial({
      map: fabricTexture,
      color: suitColor,
      roughness: roughnessVal,
      metalness: metalnessVal,
    }),
    armor: new THREE.MeshStandardMaterial({
      color: armorColor,
      roughness: 0.18,
      metalness: 0.92,
    }),
    glowAccent: new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: accentEmissive,
      emissiveIntensity: hologramGlow ? 1.6 : 0.4,
      roughness: 0.2,
      metalness: 0.8,
    }),
    eyes: new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.9,
    }),
    mouth: new THREE.MeshStandardMaterial({
      color: 0xbe123c,
      roughness: 0.7,
      metalness: 0.1,
    }),
    hair: new THREE.MeshStandardMaterial({
      color: gender === 'female' ? 0x1e1b4b : 0x172554,
      roughness: 0.45,
      metalness: 0.3,
    }),
    laser: new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.85,
    }),
    hologramRing: new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      wireframe: true,
    }),
    shadow: new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    }),
  };

  // 2. Base Holographic Pedestal & Ground Contact Shadow
  const pedestal = new THREE.Group();
  pedestal.name = 'Pedestal';

  // Ground shadow disc
  const shadowGeo = new THREE.CircleGeometry(0.85, 32);
  const shadowMesh = new THREE.Mesh(shadowGeo, materials.shadow);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.01;
  pedestal.add(shadowMesh);

  // Hologram outer ring
  const ringGeo = new THREE.RingGeometry(0.75, 0.95, 32);
  const ringMesh = new THREE.Mesh(ringGeo, materials.hologramRing);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = 0.03;
  pedestal.add(ringMesh);

  // Hologram inner pulse disc
  const innerRingGeo = new THREE.RingGeometry(0.3, 0.4, 24);
  const innerRingMesh = new THREE.Mesh(innerRingGeo, materials.glowAccent);
  innerRingMesh.rotation.x = -Math.PI / 2;
  innerRingMesh.position.y = 0.04;
  pedestal.add(innerRingMesh);

  root.add(pedestal);

  // 3. Humanoid Body Hierarchy
  const body = new THREE.Group();
  body.name = 'HumanoidBody';
  body.position.y = 0.95; // Ground clearance for feet
  root.add(body);

  // Proportions adjustments
  const shoulderWidth = gender === 'female' ? 0.38 : 0.48;
  const waistWidth = gender === 'female' ? 0.22 : 0.28;
  const hipWidth = gender === 'female' ? 0.32 : 0.30;

  // Pelvis / Hips
  const pelvisGeo = new THREE.CylinderGeometry(waistWidth, hipWidth, 0.22, 16);
  const pelvis = new THREE.Mesh(pelvisGeo, materials.suit);
  pelvis.castShadow = true;
  body.add(pelvis);

  // Spine & Torso Group
  const spine = new THREE.Group();
  spine.position.y = 0.12;
  body.add(spine);

  // Torso / Ribcage
  const torsoGeo = new THREE.CylinderGeometry(shoulderWidth * 0.85, waistWidth, 0.44, 16);
  const torso = new THREE.Mesh(torsoGeo, materials.suit);
  torso.position.y = 0.22;
  torso.castShadow = true;
  spine.add(torso);

  // Chest Armor / Accent Plate
  const chestArmorGeo = new THREE.BoxGeometry(shoulderWidth * 0.72, 0.28, 0.16);
  const chestArmor = new THREE.Mesh(chestArmorGeo, materials.armor);
  chestArmor.position.set(0, 0.26, 0.06);
  spine.add(chestArmor);

  // Power Core / Chest Reactor
  const coreGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16);
  const coreMesh = new THREE.Mesh(coreGeo, materials.glowAccent);
  coreMesh.rotation.x = Math.PI / 2;
  coreMesh.position.set(0, 0.28, 0.145);
  spine.add(coreMesh);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.12, 16);
  const neck = new THREE.Mesh(neckGeo, materials.skin);
  neck.position.y = 0.48;
  neck.castShadow = true;
  spine.add(neck);

  // Head Group
  const head = new THREE.Group();
  head.position.y = 0.58;
  spine.add(head);

  // Face / Cranium
  const faceGeo = new THREE.SphereGeometry(0.14, 24, 24);
  faceGeo.scale(0.9, 1.15, 1.0);
  const face = new THREE.Mesh(faceGeo, materials.skin);
  face.castShadow = true;
  head.add(face);

  // Stylized Hair / Cyber Headgear
  const hairGeo = new THREE.SphereGeometry(0.155, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
  hairGeo.scale(0.95, 1.1, 1.05);
  const hair = new THREE.Mesh(hairGeo, materials.hair);
  hair.position.set(0, 0.04, -0.02);
  head.add(hair);

  // Additional Cyber Headset / Visor piece
  const headsetGeo = new THREE.TorusGeometry(0.145, 0.015, 8, 24, Math.PI);
  const headset = new THREE.Mesh(headsetGeo, materials.armor);
  headset.rotation.x = -0.2;
  headset.position.set(0, 0.02, 0.04);
  head.add(headset);

  // Eyes (Left & Right)
  const eyeGeo = new THREE.SphereGeometry(0.022, 12, 12);
  const eyeLeft = new THREE.Mesh(eyeGeo, materials.eyes);
  eyeLeft.position.set(-0.045, 0.02, 0.12);
  head.add(eyeLeft);

  const eyeRight = new THREE.Mesh(eyeGeo, materials.eyes);
  eyeRight.position.set(0.045, 0.02, 0.12);
  head.add(eyeRight);

  // Mouth / Viseme Lip
  const mouthGeo = new THREE.BoxGeometry(0.05, 0.015, 0.01);
  const mouth = new THREE.Mesh(mouthGeo, materials.mouth);
  mouth.position.set(0, -0.065, 0.125);
  head.add(mouth);

  // 4. Arms (Left & Right with Shoulders, Elbows, Hands, Pointer)
  function createArm(isRight: boolean) {
    const sign = isRight ? 1 : -1;
    const shoulder = new THREE.Group();
    shoulder.position.set(sign * (shoulderWidth * 0.5 + 0.02), 0.4, 0);
    spine.add(shoulder);

    // Shoulder Pad / Pauldron
    const pauldronGeo = new THREE.SphereGeometry(0.075, 12, 12);
    const pauldron = new THREE.Mesh(pauldronGeo, materials.armor);
    shoulder.add(pauldron);

    // Upper Arm
    const upperGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.28, 12);
    const upper = new THREE.Mesh(upperGeo, materials.suit);
    upper.position.y = -0.14;
    shoulder.add(upper);

    // Elbow Joint Group
    const elbow = new THREE.Group();
    elbow.position.y = -0.28;
    shoulder.add(elbow);

    // Forearm
    const forearmGeo = new THREE.CylinderGeometry(0.038, 0.032, 0.26, 12);
    const forearm = new THREE.Mesh(forearmGeo, materials.armor);
    forearm.position.y = -0.13;
    elbow.add(forearm);

    // Hand
    const handGeo = new THREE.BoxGeometry(0.05, 0.07, 0.03);
    const hand = new THREE.Mesh(handGeo, materials.skin);
    hand.position.y = -0.28;
    elbow.add(hand);

    let laserMesh: THREE.Mesh | null = null;
    if (isRight) {
      // Interactive Pointer Laser Beam (activated during screen pointing)
      const laserGeo = new THREE.CylinderGeometry(0.005, 0.005, 2.2, 8);
      laserGeo.rotateX(Math.PI / 2);
      laserGeo.translate(0, 0, 1.1);
      laserMesh = new THREE.Mesh(laserGeo, materials.laser);
      laserMesh.position.set(0, -0.02, 0.04);
      laserMesh.visible = false;
      hand.add(laserMesh);
    }

    return { shoulder, upper, elbow, forearm, hand, laser: laserMesh as THREE.Mesh };
  }

  const leftArm = createArm(false);
  const rightArm = createArm(true);

  // 5. Legs (Left & Right with Hips, Knees, Feet)
  function createLeg(isRight: boolean) {
    const sign = isRight ? 1 : -1;
    const hip = new THREE.Group();
    hip.position.set(sign * (hipWidth * 0.35), -0.1, 0);
    body.add(hip);

    // Thigh
    const thighGeo = new THREE.CylinderGeometry(0.065, 0.05, 0.42, 14);
    const thigh = new THREE.Mesh(thighGeo, materials.suit);
    thigh.position.y = -0.21;
    hip.add(thigh);

    // Knee Joint Group
    const knee = new THREE.Group();
    knee.position.y = -0.42;
    hip.add(knee);

    // Shin
    const shinGeo = new THREE.CylinderGeometry(0.048, 0.04, 0.42, 14);
    const shin = new THREE.Mesh(shinGeo, materials.armor);
    shin.position.y = -0.21;
    knee.add(shin);

    // Foot / Boot
    const footGeo = new THREE.BoxGeometry(0.08, 0.07, 0.18);
    const foot = new THREE.Mesh(footGeo, materials.armor);
    foot.position.set(0, -0.43, 0.04);
    knee.add(foot);

    return { hip, thigh, knee, shin, foot };
  }

  const leftLeg = createLeg(false);
  const rightLeg = createLeg(true);

  const joints: HumanJoints = {
    root,
    pedestal,
    body,
    pelvis,
    spine,
    torso,
    chestArmor,
    neck,
    head,
    face,
    hair,
    eyeLeft,
    eyeRight,
    mouth,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
  };

  return { group: root, joints, materials };
}
