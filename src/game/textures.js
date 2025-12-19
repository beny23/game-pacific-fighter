import { ensurePlaneTextures } from './textures/planes.js';
import { ensureWeaponTextures } from './textures/weapons.js';
import { ensureGroundTextures } from './textures/ground.js';
import { ensureShipTextures } from './textures/ships.js';
import { ensureVfxTextures } from './textures/vfx.js';
import { ensureEnvironmentTextures } from './textures/environment.js';

function makeRng(seed) {
  // Deterministic PRNG for repeatable texture variants.
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export function ensureTextures(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  ensurePlaneTextures(scene, g);
  ensureWeaponTextures(scene, g);
  ensureGroundTextures(scene, g);
  ensureShipTextures(scene, g);
  ensureVfxTextures(scene, g);
  ensureEnvironmentTextures(scene, g, { makeRng });

  g.destroy();
}
