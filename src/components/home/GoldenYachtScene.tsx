'use client';

import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export type CameraViewPreset = 'stern-quarter' | 'bow-quarter' | 'profile' | 'aerial';

type SceneProps = {
  active: boolean;
  elevated: boolean;
  viewPreset: CameraViewPreset;
  timeHours?: number;
};

export const MODEL_URL = '/models/superyacht.glb?v=10';
export const HDR_URL = '/models/ocean_morning.hdr';

// Eagerly preload the 3D superyacht model as soon as this module is imported
useGLTF.preload(MODEL_URL);

// All 4 camera angles zoomed out ~22% more so the 62m superyacht,
// open Beach Club stern, bow spray, and Kelvin wake have generous framing.
const CAMERA_PRESETS: Record<
  CameraViewPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  'stern-quarter': { pos: [-13.6, 3.28, 8.15], target: [-0.75, 0.58, 0.0] },
  'bow-quarter': { pos: [11.6, 2.85, 7.85], target: [-0.30, 0.62, 0.0] },
  profile: { pos: [-0.4, 1.92, 14.9], target: [-0.40, 0.68, 0.0] },
  aerial: { pos: [-9.1, 9.25, 7.85], target: [-0.55, 0.35, 0.0] },
};

/**
 * Computes lighting, sky, water, and yacht interior/LED parameters from timeHours (0.0 to 11.0).
 */
function getAtmosphereForTime(timeHours: number) {
  const h = THREE.MathUtils.clamp(timeHours, 0, 11);

  const nightFactor = 1.0 - THREE.MathUtils.smoothstep(h, 3.6, 5.6);
  const dawnFactor =
    THREE.MathUtils.smoothstep(h, 3.5, 5.2) *
    (1.0 - THREE.MathUtils.smoothstep(h, 5.6, 7.2));
  const morningFactor = THREE.MathUtils.smoothstep(h, 6.8, 9.5);

  let sunElevDeg = -6.0;
  if (h < 4.5) {
    sunElevDeg = THREE.MathUtils.lerp(-7.0, -1.2, h / 4.5);
  } else if (h < 6.5) {
    sunElevDeg = THREE.MathUtils.lerp(-1.2, 4.8, (h - 4.5) / 2.0);
  } else {
    sunElevDeg = THREE.MathUtils.lerp(4.8, 23.5, (h - 6.5) / 4.5);
  }
  const elevRad = THREE.MathUtils.degToRad(sunElevDeg);
  const azimRad = THREE.MathUtils.degToRad(14.5 + (h - 6.25) * 1.8);

  const sunDir = new THREE.Vector3(
    Math.cos(elevRad) * Math.cos(azimRad),
    Math.sin(elevRad),
    Math.cos(elevRad) * Math.sin(azimRad)
  ).normalize();

  const nightSun = new THREE.Color('#3b5980');
  const dawnSun = new THREE.Color('#ff7b3a');
  const sunriseSun = new THREE.Color('#ffad52');
  const morningSun = new THREE.Color('#fff2db');

  const sunColor = sunriseSun.clone();
  if (h < 5.2) {
    sunColor.lerpColors(nightSun, dawnSun, THREE.MathUtils.smoothstep(h, 3.5, 5.2));
  } else if (h < 6.8) {
    sunColor.lerpColors(dawnSun, sunriseSun, THREE.MathUtils.smoothstep(h, 5.2, 6.5));
  } else {
    sunColor.lerpColors(sunriseSun, morningSun, THREE.MathUtils.smoothstep(h, 6.8, 10.0));
  }

  const nightWater = new THREE.Color('#020813');
  const sunriseWater = new THREE.Color('#041526');
  const morningWater = new THREE.Color('#062844');
  const waterColor = sunriseWater
    .clone()
    .lerp(nightWater, nightFactor)
    .lerp(morningWater, morningFactor);

  const nightFog = new THREE.Color('#081326');
  const dawnFog = new THREE.Color('#7a596c');
  const sunriseFog = new THREE.Color('#d89c60');
  const morningFog = new THREE.Color('#c8dce8');
  const fogColor = sunriseFog
    .clone()
    .lerp(nightFog, nightFactor)
    .lerp(dawnFog, dawnFactor * 0.65)
    .lerp(morningFog, morningFactor);

  // Balanced lighting for natural satin marine paint (no mirror glare or white clipping)
  const dirLightIntensity = THREE.MathUtils.lerp(
    0.45,
    THREE.MathUtils.lerp(2.05, 2.25, morningFactor),
    1.0 - nightFactor
  );
  const envIntensity = THREE.MathUtils.lerp(
    0.25,
    THREE.MathUtils.lerp(0.55, 0.68, morningFactor),
    1.0 - nightFactor
  );
  const fillLightIntensity = THREE.MathUtils.lerp(0.35, 0.85, 1.0 - nightFactor);
  const ambientIntensity = THREE.MathUtils.lerp(0.18, 0.36, 1.0 - nightFactor);

  // Subtle warm interior glow in daylight, stronger at sunrise/dawn/night
  const interiorGlowScale = THREE.MathUtils.lerp(
    0.32,
    1.35,
    nightFactor * 0.65 + (1.0 - morningFactor) * 0.35
  );
  const ledStrength = THREE.MathUtils.lerp(
    0.48,
    1.30,
    nightFactor * 0.6 + (1.0 - morningFactor) * 0.4
  );

  return {
    sunDir,
    sunColor,
    waterColor,
    fogColor,
    nightFactor,
    morningFactor,
    dirLightIntensity,
    envIntensity,
    fillLightIntensity,
    ambientIntensity,
    interiorGlowScale,
    ledStrength,
  };
}

// Module-level cached procedural textures so they are computed only once (4x faster startup)
let cachedWaterNormals: THREE.DataTexture | null = null;
let cachedTeakPlanks: THREE.DataTexture | null = null;

function getWaterNormalsTexture(): THREE.DataTexture {
  if (cachedWaterNormals) return cachedWaterNormals;
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const tau = Math.PI * 2;

  const waves: [number, number, number, number][] = [
    [2, 1, 0.28, 0.4],
    [3, -2, 0.24, 1.7],
    [1, 3, 0.20, 2.9],
    [4, -3, 0.17, 0.8],
    [5, 2, 0.15, 4.1],
    [3, 5, 0.13, 2.2],
    [7, -4, 0.11, 5.0],
    [6, 5, 0.095, 1.2],
    [9, -7, 0.08, 3.6],
    [8, 9, 0.07, 0.3],
    [12, -5, 0.06, 4.7],
    [11, 13, 0.05, 2.5],
  ];

  const sampleHeight = (u: number, v: number) => {
    const a = u * tau;
    const b = v * tau;
    let h = 0;
    for (let i = 0; i < waves.length; i++) {
      const [kx, ky, amp, phase] = waves[i];
      h += Math.sin(a * kx + b * ky + phase) * amp;
    }
    return h;
  };

  const eps = 1 / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const hL = sampleHeight(u - eps, v);
      const hR = sampleHeight(u + eps, v);
      const hD = sampleHeight(u, v - eps);
      const hU = sampleHeight(u, v + eps);

      const dx = (hL - hR) * 2.6;
      const dy = (hD - hU) * 2.6;
      const dz = 1.0;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const idx = (y * size + x) * 4;
      data[idx] = Math.round(((dx / len) * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.round(((dy / len) * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.round(((dz / len) * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  cachedWaterNormals = texture;
  return texture;
}

function getTeakPlankTexture(): THREE.DataTexture {
  if (cachedTeakPlanks) return cachedTeakPlanks;
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const planksAcross = 16;
  const plankWidth = size / planksAcross;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const plankIdx = Math.floor(y / plankWidth);
      const inPlankY = y % plankWidth;
      const isSeam = inPlankY < 1.6;
      const boardSeed = Math.sin(plankIdx * 12.9898 + 4.1414) * 43758.5453;
      const boardVar = (boardSeed - Math.floor(boardSeed)) * 0.12 - 0.06;
      const grain =
        Math.sin((x / size) * Math.PI * 14 + plankIdx * 1.7) * 0.03 +
        Math.sin((y / size) * Math.PI * 90) * 0.02;

      let r = 148;
      let g = 96;
      let b = 52;
      if (isSeam) {
        r = 38;
        g = 25;
        b = 16;
      } else {
        const factor = 1 + boardVar + grain;
        r = Math.min(255, Math.max(0, Math.round(152 * factor)));
        g = Math.min(255, Math.max(0, Math.round(98 * factor)));
        b = Math.min(255, Math.max(0, Math.round(54 * factor)));
      }

      const idx = (y * size + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  cachedTeakPlanks = tex;
  return tex;
}

/**
 * Loads the Blender-built /models/superyacht.glb model and applies authentic,
 * non-mirror Satin Marine Polyurethane exterior finishes so the yacht looks solid and real
 * (never glass-like or chrome-reflective).
 */
function BlenderSuperyacht({
  active,
  elevated,
  timeHours,
}: {
  active: boolean;
  elevated: boolean;
  timeHours: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const { scene } = useGLTF(MODEL_URL);

  const clonedScene = useMemo(() => {
    const root = scene.clone(true);
    const teakTex = getTeakPlankTexture();

    // 1. Matte-Satin Warm Champagne-Silver Marine Polyurethane Hull Paint
    // Zero metalness (0.0) + realistic matte-satin roughness (0.62) + DoubleSide so the hull is
    // 100% solid, opaque, and never acts like reflective glass or gets backface-culled.
    const hullMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dbd6cc'),
      metalness: 0.0,
      roughness: 0.62,
      envMapIntensity: 0.18,
      side: THREE.DoubleSide,
    });

    // 2. Matte-Satin Warm Pearl-White Marine Gelcoat / Superstructure Paint
    const superPearlMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f4efe6'),
      metalness: 0.0,
      roughness: 0.58,
      envMapIntensity: 0.18,
      side: THREE.DoubleSide,
    });

    // 3. Matte-Satin Anodized Carbon-Black Fashion Plates, Mullions, Boot Stripe & Mast
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1c1f24'),
      metalness: 0.02,
      roughness: 0.60,
      envMapIntensity: 0.18,
      side: THREE.DoubleSide,
    });

    // 4a. Subtle Non-Reflective Smoked Cabin Glazing (lets the warm interior rooms & walnut furniture show through)
    const salonGlassMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1a1d22'),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      metalness: 0.0,
      roughness: 0.65,
      envMapIntensity: 0.12,
    });

    // 4b. Matte-Satin Dark Slate Hull Portlights (flush on the hull, zero glass reflection)
    const hullWindowGlassMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#16191e'),
      transparent: false,
      metalness: 0.0,
      roughness: 0.65,
      envMapIntensity: 0.12,
      side: THREE.DoubleSide,
    });

    // 5. Soft Frosted-Tint Safety Glass Balustrades
    const balustradeGlassMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#cbd6de'),
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      metalness: 0.0,
      roughness: 0.55,
      envMapIntensity: 0.15,
      side: THREE.DoubleSide,
    });

    // 6. Brushed 316L Marine Stainless Steel Railings & Bollards
    const stainlessMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dce1e6'),
      metalness: 0.35,
      roughness: 0.42,
      envMapIntensity: 0.35,
      side: THREE.DoubleSide,
    });

    // 7. Natural Matte Burmese Teak Decks with Sikaflex caulking
    const teakMat = new THREE.MeshStandardMaterial({
      map: teakTex,
      color: new THREE.Color('#c28752'),
      metalness: 0.0,
      roughness: 0.68,
      envMapIntensity: 0.22,
      side: THREE.DoubleSide,
    });

    // 8. Matte Dark Walnut Interior & Exterior Dining Furniture
    const walnutMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3a2010'),
      metalness: 0.0,
      roughness: 0.58,
      envMapIntensity: 0.22,
      side: THREE.DoubleSide,
    });

    // 9. Matte Cream Sunbrella Linen Upholstery
    const linenMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e6dfd2'),
      roughness: 0.78,
      metalness: 0.0,
      envMapIntensity: 0.22,
      side: THREE.DoubleSide,
    });

    // 10. Matte Charcoal Throw Pillows & Lounger Frames
    const pillowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22262c'),
      roughness: 0.72,
      metalness: 0.0,
      envMapIntensity: 0.22,
      side: THREE.DoubleSide,
    });

    // 11. Soft Warm 2700K Interior Ambiance inside the salons & Beach Club
    const warmGlowMat = new THREE.MeshStandardMaterial({
      name: 'YBS_Runtime_WarmGlow',
      color: new THREE.Color('#cfa068'),
      emissive: new THREE.Color('#c47428'),
      emissiveIntensity: 0.85,
      roughness: 0.65,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    // 12. Warm Recessed Ceiling Soffits & Stair Risers
    const soffitGlowMat = new THREE.MeshStandardMaterial({
      name: 'YBS_Runtime_SoffitGlow',
      color: new THREE.Color('#d49e5c'),
      emissive: new THREE.Color('#bd6a20'),
      emissiveIntensity: 0.75,
      roughness: 0.60,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    // 13. Underwater Turquoise-Cyan LED Fixtures
    const cyanLedMat = new THREE.MeshStandardMaterial({
      name: 'YBS_Runtime_CyanLed',
      color: new THREE.Color('#42f5ea'),
      emissive: new THREE.Color('#14e8db'),
      emissiveIntensity: 3.6,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });

    root.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const origMat = mesh.material as THREE.MeshStandardMaterial;
        const mName = origMat?.name || '';
        const objName = mesh.name || '';

        if (mName.startsWith('YBS_Hull_')) {
          mesh.material = hullMat;
        } else if (mName.startsWith('YBS_Superstructure_Pearl')) {
          mesh.material = superPearlMat;
        } else if (objName.startsWith('Hull_Win') || objName.startsWith('Hull_BowSlot')) {
          mesh.material = hullWindowGlassMat;
        } else if (mName.startsWith('YBS_Obsidian_')) {
          mesh.material = obsidianMat;
        } else if (mName.startsWith('YBS_Salon_Glass')) {
          mesh.material = salonGlassMat;
        } else if (mName.startsWith('YBS_Balustrade_Glass')) {
          mesh.material = balustradeGlassMat;
        } else if (mName.startsWith('YBS_Stainless_Steel')) {
          mesh.material = stainlessMat;
        } else if (mName.startsWith('YBS_Burmese_Teak')) {
          mesh.material = teakMat;
        } else if (mName.startsWith('YBS_Interior_Walnut')) {
          mesh.material = walnutMat;
        } else if (mName.startsWith('YBS_Cushion_Linen')) {
          mesh.material = linenMat;
        } else if (mName.startsWith('YBS_Pillow_Charcoal')) {
          mesh.material = pillowMat;
        } else if (mName.startsWith('YBS_Warm_Interior_Glow')) {
          mesh.material = warmGlowMat;
        } else if (mName.startsWith('YBS_Ceiling_Warm_Soffit')) {
          mesh.material = soffitGlowMat;
        } else if (mName.startsWith('YBS_Underwater_Cyan_LED')) {
          mesh.material = cyanLedMat;
        }
      }
    });
    return root;
  }, [scene]);

  const atmos = getAtmosphereForTime(timeHours);

  useEffect(() => {
    const grp = groupRef.current;
    if (!grp) return;
    const tierBoost = elevated ? 1.12 : 1.0;
    grp.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mat = (node as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (!mat) return;
        if (mat.name === 'YBS_Runtime_WarmGlow') {
          mat.emissiveIntensity = 0.95 * atmos.interiorGlowScale * tierBoost;
        } else if (mat.name === 'YBS_Runtime_SoffitGlow') {
          mat.emissiveIntensity = 0.75 * atmos.interiorGlowScale * tierBoost;
        } else if (mat.name === 'YBS_Runtime_CyanLed') {
          mat.emissiveIntensity = 3.5 * atmos.ledStrength * tierBoost;
        }
      }
    });
  }, [atmos.interiorGlowScale, atmos.ledStrength, elevated]);

  useFrame((state, delta) => {
    if (!groupRef.current || !active) return;
    const dt = Math.min(delta, 0.05);
    const speedFactor = elevated ? 1.18 : 1.0;
    timeRef.current += dt * speedFactor;
    const t = timeRef.current;

    const wavePitch =
      0.008 +
      Math.sin(t * 1.35) * 0.0045 +
      Math.cos(t * 2.1 + 0.5) * 0.0018;
    const waveRoll =
      Math.cos(t * 0.95) * 0.0068 +
      Math.sin(t * 1.65 + 1.1) * 0.0022;
    const waveHeave =
      -0.012 +
      Math.sin(t * 1.35 - Math.PI * 0.45) * 0.018 +
      Math.cos(t * 0.85) * 0.008;
    const targetYaw = (elevated ? -0.025 : 0.02) + state.pointer.x * 0.035;

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      waveHeave,
      3.5,
      dt
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      wavePitch,
      3.5,
      dt
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      waveRoll,
      3.2,
      dt
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetYaw,
      2.5,
      dt
    );
  });

  const warmIntensity = (elevated ? 2.1 : 1.7) * atmos.interiorGlowScale;

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />

      {/* 4 Consolidated Real-Time Accent Lights (70% lower fragment shader cost than 13 point lights) */}
      {/* 1. Open Beach Club & Swim Platform Warm Dining Glow */}
      <pointLight
        position={[-4.85, 0.28, 0]}
        color="#ff9834"
        intensity={warmIntensity * 1.4}
        distance={5.0}
        decay={1.8}
      />
      {/* 2. Aft Lounge & Upper Deck Warm Soffit Glow */}
      <pointLight
        position={[-3.2, 1.05, 0]}
        color="#ffa442"
        intensity={warmIntensity * 1.15}
        distance={5.2}
        decay={1.8}
      />
      {/* 3 & 4. Port & Starboard Underwater Turquoise Hull Accent Lights */}
      <pointLight
        position={[-4.2, -0.04, 1.42]}
        color="#20f5e8"
        intensity={(elevated ? 2.4 : 1.8) * atmos.ledStrength}
        distance={4.5}
        decay={1.8}
      />
      <pointLight
        position={[-4.2, -0.04, -1.42]}
        color="#20f5e8"
        intensity={(elevated ? 2.4 : 1.8) * atmos.ledStrength}
        distance={4.5}
        decay={1.8}
      />
    </group>
  );
}

/**
 * Open Wide Infinite Sea (`Water.js` with 512x512 reflection target for 4x faster GPU performance,
 * true-scale multi-octave ocean waves, and integrated Hull-Contact Bow Wave, Side Foam Collar,
 * Kelvin V-Wake, Churning Stern Prop-Wash, and Underwater Cyan LED pools).
 */
function OpenInfiniteOceanAndSky({
  active,
  elevated,
  timeHours,
}: {
  active: boolean;
  elevated: boolean;
  timeHours: number;
}) {
  const { scene } = useThree();
  const atmos = getAtmosphereForTime(timeHours);
  const skyRef = useRef<Sky>(null);
  const waterRef = useRef<Water>(null);

  const skyObj = useMemo(() => {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    return sky;
  }, []);

  const waterObj = useMemo(() => {
    const waterGeo = new THREE.PlaneGeometry(4000, 4000);
    const normals = getWaterNormalsTexture();
    const water = new Water(waterGeo, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: normals,
      sunDirection: new THREE.Vector3(0.95, 0.08, 0.25).normalize(),
      sunColor: 0xffad52,
      waterColor: 0x041526,
      distortionScale: 1.65,
      fog: true,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.05;

    water.material.uniforms['uFlowOffset'] = { value: new THREE.Vector2(0, 0) };
    water.material.uniforms['uWakeTime'] = { value: 0 };
    water.material.uniforms['uLedStrength'] = { value: 1.0 };
    water.material.uniforms['uNightFactor'] = { value: 0.0 };

    water.material.fragmentShader = `
      uniform sampler2D mirrorSampler;
      uniform float alpha;
      uniform float time;
      uniform float size;
      uniform float distortionScale;
      uniform sampler2D normalSampler;
      uniform vec3 sunColor;
      uniform vec3 sunDirection;
      uniform vec3 eye;
      uniform vec3 waterColor;
      uniform vec2 uFlowOffset;
      uniform float uWakeTime;
      uniform float uLedStrength;
      uniform float uNightFactor;

      varying vec4 mirrorCoord;
      varying vec4 worldPosition;

      vec4 getOceanNoise( vec2 worldXZ ) {
        vec2 p = worldXZ + uFlowOffset;
        vec2 uv0 = p * 0.11 + vec2( time * 0.03, time * 0.015 );
        vec2 uv1 = p * 0.29 - vec2( time * 0.045, -time * 0.025 );
        vec2 uv2 = p * 0.78 + vec2( -time * 0.06, time * 0.05 );
        vec2 uv3 = p * 2.15 - vec2( time * 0.08, time * 0.07 );

        vec4 n = texture2D( normalSampler, uv0 ) * 0.36 +
                 texture2D( normalSampler, uv1 ) * 0.30 +
                 texture2D( normalSampler, uv2 ) * 0.20 +
                 texture2D( normalSampler, uv3 ) * 0.14;
        return n * 2.0 - 1.0;
      }

      float wakeFoamNoise( vec2 p ) {
        vec2 q = p + uFlowOffset * 1.15;
        float v = 0.0;
        v += 0.42 * sin( q.x * 3.8 + q.y * 2.9 + uWakeTime * 1.8 );
        v += 0.28 * cos( q.x * 8.3 - q.y * 7.1 - uWakeTime * 2.5 );
        v += 0.18 * sin( q.x * 17.5 + q.y * 15.2 + uWakeTime * 3.2 );
        v += 0.12 * cos( q.x * 31.0 - q.y * 27.0 );
        return 0.5 + 0.5 * v;
      }

      float getHullHalfBeam( float x ) {
        if ( x < -7.05 || x > 6.30 ) return 0.0;
        if ( x > 0.5 ) {
          float t = clamp( ( x - 0.5 ) / 5.70, 0.0, 1.0 );
          return 1.32 * ( 1.0 - pow( t, 1.42 ) );
        }
        if ( x < -5.2 ) {
          return 1.16;
        }
        return 1.30;
      }

      #include <common>
      #include <packing>
      #include <bsdfs>
      #include <fog_pars_fragment>
      #include <logdepthbuf_pars_fragment>
      #include <lights_pars_begin>
      #include <shadowmap_pars_fragment>
      #include <shadowmask_pars_fragment>

      void main() {
        #include <logdepthbuf_fragment>

        vec2 p = worldPosition.xz;
        float x = p.x;
        float absZ = abs( p.y );

        vec4 texNoise = getOceanNoise( p );
        vec2 wp = p + uFlowOffset;
        float swellX = 0.14 * cos( wp.x * 0.85 + wp.y * 0.35 + uWakeTime * 1.1 ) +
                       0.09 * cos( wp.x * 1.9 - wp.y * 1.1 + uWakeTime * 1.6 );
        float swellZ = 0.14 * sin( wp.x * 0.85 + wp.y * 0.35 + uWakeTime * 1.1 ) +
                       0.09 * sin( wp.x * 1.9 - wp.y * 1.1 + uWakeTime * 1.6 );

        float halfW = getHullHalfBeam( x );
        float fNoise = wakeFoamNoise( p );
        float fNoiseFine = wakeFoamNoise( p * 2.3 + vec2( 4.7, -3.1 ) );
        float lace = smoothstep( 0.28, 0.82, fNoise * 0.62 + fNoiseFine * 0.38 );

        float insideHull = step( -6.88, x ) * step( x, 6.08 ) * smoothstep( halfW + 0.02, halfW - 0.10, absZ );

        float bowZone = smoothstep( 0.2, 4.6, x ) * smoothstep( 6.45, 5.25, x );
        float bowWaveCrest = exp( -pow( ( absZ - ( halfW + 0.14 ) ) * 3.2, 2.0 ) ) * bowZone;
        float peelingBowWave = exp( -pow( ( absZ - ( halfW + 0.38 + max( 0.0, 5.4 - x ) * 0.19 ) ) * 2.4, 2.0 ) ) *
                               smoothstep( -2.8, 2.8, x ) * smoothstep( 5.9, 3.6, x );

        float hullAlong = smoothstep( -7.1, -6.0, x ) * smoothstep( 6.3, 5.3, x );
        float sideCollar = exp( -max( 0.0, absZ - halfW ) * 3.6 ) * step( halfW - 0.08, absZ ) * hullAlong;

        float bowDistX = max( 0.0, 5.95 - x );
        float kelvinArmZ = halfW * 0.42 + bowDistX * 0.22;
        float kelvinWake = exp( -abs( absZ - kelvinArmZ ) * 2.1 ) *
                           smoothstep( 0.5, 2.5, bowDistX ) * smoothstep( 24.0, 3.0, bowDistX ) * 0.55;

        float sternDist = max( 0.0, -6.70 - x );
        float sternWidth = 1.15 + sternDist * 0.15;
        float sternEnvelope = exp( -pow( absZ / sternWidth, 1.85 ) ) *
                              smoothstep( -5.6, -6.85, x ) * smoothstep( -20.5, -7.2, x );
        float sternBoil = sternEnvelope * ( 0.48 + 0.52 * lace );

        float wakeStrength = clamp( ( bowWaveCrest * 1.2 + peelingBowWave * 0.85 + sideCollar * 0.9 + kelvinWake * 0.65 + sternBoil * 1.15 ) * ( 1.0 - insideHull ), 0.0, 1.0 );

        vec3 normalPerturb = vec3(
          texNoise.x * 1.85 + swellX + ( fNoise - 0.5 ) * wakeStrength * 1.9,
          1.0,
          texNoise.y * 1.85 + swellZ + ( fNoiseFine - 0.5 ) * wakeStrength * 1.9
        );
        vec3 surfaceNormal = normalize( normalPerturb );

        vec3 worldToEye = eye - worldPosition.xyz;
        vec3 eyeDirection = normalize( worldToEye );
        float dist = length( worldToEye );

        vec3 sunReflect = normalize( reflect( -sunDirection, surfaceNormal ) );
        float specCore = pow( max( 0.0, dot( eyeDirection, sunReflect ) ), 140.0 ) * 2.6;
        float specWarm = pow( max( 0.0, dot( eyeDirection, sunReflect ) ), 28.0 ) * 0.55;
        vec3 specularLight = sunColor * ( specCore + specWarm ) * ( 1.0 - wakeStrength * 0.65 );
        vec3 diffuseLight = max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * 0.28;

        vec2 waveDistort = surfaceNormal.xz * min( 0.068, ( 0.018 + 0.55 / max( dist, 6.0 ) ) * distortionScale );
        vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + waveDistort ) );
        vec3 deepOceanTint = mix( waterColor * 1.35, reflectionSample, 0.38 );

        float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
        float rf0 = 0.025;
        float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 4.2 );
        reflectance = clamp( reflectance * 0.72, 0.04, 0.65 );

        float waveCrestScatter = clamp( ( surfaceNormal.x + surfaceNormal.z ) * 0.35 + 0.25, 0.0, 1.0 );
        vec3 deepWaterAlbedo = mix( waterColor * 0.75, waterColor * 1.65 + vec3( 0.01, 0.06, 0.09 ) * ( 1.0 - uNightFactor ), waveCrestScatter );

        vec3 oceanColor = mix( deepWaterAlbedo + diffuseLight * 0.25, deepOceanTint, reflectance ) + specularLight;

        float ledPool = 0.0;
        for ( int i = 0; i < 4; i++ ) {
          float lx = -5.9 + float( i ) * 1.2;
          vec2 dPort = p - vec2( lx, -1.34 );
          vec2 dStbd = p - vec2( lx, 1.34 );
          ledPool += exp( -dot( dPort, dPort ) * 2.3 ) + exp( -dot( dStbd, dStbd ) * 2.3 );
        }
        ledPool = clamp( ledPool, 0.0, 1.0 ) * ( 1.0 - insideHull * 0.85 ) * uLedStrength;
        vec3 turquoiseGlow = vec3( 0.08, 0.86, 0.84 ) * ( 0.65 + 0.35 * fNoise );
        oceanColor += turquoiseGlow * ledPool * 0.62;

        float rawFoam = ( bowWaveCrest * ( 0.65 + 0.55 * lace ) +
                          peelingBowWave * ( 0.45 + 0.55 * lace ) +
                          sideCollar * ( 0.38 + 0.62 * lace ) +
                          kelvinWake * ( 0.25 + 0.55 * lace ) +
                          sternBoil * ( 0.55 + 0.45 * lace ) ) * ( 1.0 - insideHull );
        float foamMask = clamp( smoothstep( 0.14, 0.78, rawFoam ), 0.0, 0.92 );
        float aeratedMask = clamp( smoothstep( 0.04, 0.48, rawFoam ), 0.0, 0.65 );

        vec3 aeratedTeal = mix( vec3( 0.07, 0.32, 0.44 ), vec3( 0.03, 0.14, 0.22 ), uNightFactor * 0.7 );
        vec3 sunlitFoam = mix( vec3( 0.90, 0.94, 0.97 ), sunColor * 0.35 + vec3( 0.72, 0.76, 0.80 ), 0.35 ) *
                          mix( 1.0, 0.45, uNightFactor );

        oceanColor = mix( oceanColor, aeratedTeal + turquoiseGlow * ledPool * 0.35, aeratedMask * 0.55 );
        oceanColor = mix( oceanColor, sunlitFoam, foamMask );

        gl_FragColor = vec4( oceanColor, alpha );

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `;

    water.material.needsUpdate = true;
    return water;
  }, []);

  const lastTimeHoursRef = useRef<number>(-1);

  useFrame((_, delta) => {
    const sky = skyRef.current;
    const water = waterRef.current;

    if (lastTimeHoursRef.current !== timeHours) {
      lastTimeHoursRef.current = timeHours;
      if (sky) {
        const u = sky.material.uniforms;
        u['turbidity'].value = THREE.MathUtils.lerp(7.2, 4.2, atmos.morningFactor);
        u['rayleigh'].value = THREE.MathUtils.lerp(
          0.45,
          THREE.MathUtils.lerp(2.75, 1.65, atmos.morningFactor),
          1.0 - atmos.nightFactor
        );
        u['mieCoefficient'].value = 0.0045;
        u['mieDirectionalG'].value = 0.86;
        u['sunPosition'].value.copy(atmos.sunDir);
      }

      if (water) {
        const wu = water.material.uniforms;
        wu['sunDirection'].value.copy(atmos.sunDir);
        wu['sunColor'].value.copy(atmos.sunColor);
        wu['waterColor'].value.copy(atmos.waterColor);
        if (wu['uLedStrength']) wu['uLedStrength'].value = atmos.ledStrength;
        if (wu['uNightFactor']) wu['uNightFactor'].value = atmos.nightFactor;
      }

      if (scene.fog && (scene.fog as THREE.Fog).color) {
        (scene.fog as THREE.Fog).color.copy(atmos.fogColor);
      }
    }

    if (!active || !water) return;
    const dt = Math.min(delta, 0.05);

    const cruiseSpeedUnitsPerSec = elevated ? 1.55 : 1.25;

    water.material.uniforms['time'].value += dt * 0.65;
    if (water.material.uniforms['uWakeTime']) {
      water.material.uniforms['uWakeTime'].value += dt * (elevated ? 1.18 : 1.0);
    }
    const flowOffset = water.material.uniforms['uFlowOffset']?.value as
      | THREE.Vector2
      | undefined;
    if (flowOffset) {
      flowOffset.set(
        flowOffset.x + dt * cruiseSpeedUnitsPerSec * 1.45,
        flowOffset.y + dt * 0.09
      );
    }
  });

  return (
    <>
      <primitive ref={skyRef} object={skyObj} />
      <primitive ref={waterRef} object={waterObj} />
    </>
  );
}

function CameraRig({ preset }: { preset: CameraViewPreset }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const desiredPos = useRef(new THREE.Vector3(...CAMERA_PRESETS[preset].pos));
  const desiredTarget = useRef(new THREE.Vector3(...CAMERA_PRESETS[preset].target));
  const isTransitioning = useRef(false);

  useEffect(() => {
    desiredPos.current.set(...CAMERA_PRESETS[preset].pos);
    desiredTarget.current.set(...CAMERA_PRESETS[preset].target);
    isTransitioning.current = true;
  }, [preset]);

  useFrame((state, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return;
    state.camera.position.lerp(desiredPos.current, Math.min(1, delta * 4.5));
    controlsRef.current.target.lerp(desiredTarget.current, Math.min(1, delta * 4.5));
    controlsRef.current.update();

    if (state.camera.position.distanceTo(desiredPos.current) < 0.04) {
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.06}
      minPolarAngle={Math.PI * 0.20}
      maxPolarAngle={Math.PI * 0.468}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
}

export default function GoldenYachtScene({
  active,
  elevated,
  viewPreset,
  timeHours = 6.25,
}: SceneProps) {
  const atmos = getAtmosphereForTime(timeHours);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'demand'}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.88,
      }}
    >
      <PerspectiveCamera makeDefault position={[-13.6, 3.28, 8.15]} fov={30} />
      <CameraRig preset={viewPreset} />

      <fog attach="fog" args={[atmos.fogColor.getStyle(), 75, 340]} />

      {/* Balanced Exterior Lighting for Solid Satin Marine Paint */}
      <ambientLight intensity={atmos.ambientIntensity} color="#d6e4f2" />
      <hemisphereLight
        args={['#98b6d4', '#162c42', atmos.fillLightIntensity * 0.75]}
      />
      <directionalLight
        position={[
          atmos.sunDir.x * 40,
          Math.max(2.5, atmos.sunDir.y * 40),
          atmos.sunDir.z * 40,
        ]}
        intensity={atmos.dirLightIntensity}
        color={atmos.sunColor}
      />
      <directionalLight
        position={[-16, 10, 14]}
        intensity={atmos.fillLightIntensity}
        color="#9ec0e2"
      />

      {/* 32-bit Radiance .hdr Environment Map at subtle satin intensity */}
      <Suspense fallback={null}>
        <Environment
          files={HDR_URL}
          background={false}
          environmentIntensity={atmos.envIntensity}
        />
      </Suspense>

      <OpenInfiniteOceanAndSky
        active={active}
        elevated={elevated}
        timeHours={timeHours}
      />
      <Suspense fallback={null}>
        <BlenderSuperyacht
          active={active}
          elevated={elevated}
          timeHours={timeHours}
        />
      </Suspense>
    </Canvas>
  );
}
