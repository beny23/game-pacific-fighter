export function ensureVfxTextures(scene, g) {
  // Hit spark
  if (!scene.textures.exists('pf_spark')) {
    g.clear();
    g.fillStyle(0xe7f9ff, 0.9);
    g.fillRect(9, 0, 2, 20);
    g.fillRect(0, 9, 20, 2);
    g.fillStyle(0xffd166, 0.65);
    g.fillCircle(10, 10, 3);
    g.generateTexture('pf_spark', 20, 20);
  }

  // Flak burst puff
  if (!scene.textures.exists('pf_flak_burst')) {
    g.clear();
    g.fillStyle(0xe7f9ff, 0.12);
    g.fillCircle(18, 18, 16);
    g.fillStyle(0x9b5de5, 0.18);
    g.fillCircle(18, 18, 10);
    g.lineStyle(2, 0xffffff, 0.14);
    g.strokeCircle(18, 18, 16);
    g.generateTexture('pf_flak_burst', 36, 36);
  }

  // Scorch / burn decal
  if (!scene.textures.exists('pf_burn')) {
    g.clear();
    g.fillStyle(0x000000, 0.18);
    g.fillCircle(24, 24, 18);
    g.fillStyle(0x000000, 0.10);
    g.fillCircle(18, 26, 14);
    g.fillCircle(30, 20, 12);
    g.fillStyle(0xe7f9ff, 0.03);
    g.fillCircle(22, 22, 10);
    g.generateTexture('pf_burn', 48, 48);
  }

  // Smoke puff
  if (!scene.textures.exists('pf_smoke')) {
    g.clear();
    // Layered circles for a more volumetric puff.
    g.fillStyle(0xe7f9ff, 0.52);
    g.fillCircle(9, 11, 8);
    g.fillStyle(0xd7f7ff, 0.36);
    g.fillCircle(14, 10, 7);
    g.fillStyle(0xd7f7ff, 0.26);
    g.fillCircle(12, 15, 6);
    g.fillStyle(0xe7f9ff, 0.22);
    g.fillCircle(17, 14, 5);
    g.fillStyle(0x062033, 0.14);
    g.fillCircle(9, 15, 5);
    g.fillStyle(0x062033, 0.08);
    g.fillCircle(15, 16, 4);
    g.generateTexture('pf_smoke', 24, 24);
  }

  // Explosion puff
  if (!scene.textures.exists('pf_explosion')) {
    g.clear();
    // Hot core
    g.fillStyle(0xffd166, 0.78);
    g.fillCircle(15, 16, 9);
    g.fillStyle(0xff8c42, 0.90);
    g.fillCircle(18, 18, 15);
    g.fillStyle(0xfff1a8, 0.22);
    g.fillCircle(14, 14, 6);

    // Sooty edge and shock hint
    g.lineStyle(3, 0x062033, 0.10);
    g.strokeCircle(18, 18, 16);
    g.lineStyle(2, 0xffffff, 0.10);
    g.strokeCircle(18, 18, 14);

    // Tiny spark streaks
    g.fillStyle(0xffd166, 0.30);
    for (let i = 0; i < 10; i += 1) {
      const x = 6 + (i * 7) % 24;
      const y = 8 + (i * 11) % 22;
      g.fillRect(x, y, 2, 1);
    }
    g.generateTexture('pf_explosion', 36, 36);
  }

  // Water splash (bomb impact)
  if (!scene.textures.exists('pf_splash')) {
    g.clear();
    g.fillStyle(0xe7f9ff, 0.22);
    g.fillTriangle(24, 0, 14, 28, 34, 28);
    g.fillTriangle(10, 10, 0, 32, 18, 28);
    g.fillTriangle(38, 10, 30, 28, 48, 32);
    g.fillStyle(0xe7f9ff, 0.14);
    g.fillCircle(24, 26, 10);

    // droplets
    g.fillStyle(0xd7f7ff, 0.12);
    g.fillCircle(10, 6, 3);
    g.fillCircle(36, 7, 3);
    g.fillCircle(20, 10, 2);
    g.fillCircle(28, 11, 2);

    // darker base to feel anchored in water
    g.fillStyle(0x062033, 0.06);
    g.fillCircle(24, 30, 12);
    g.generateTexture('pf_splash', 48, 40);
  }

  // Water ripple ring
  if (!scene.textures.exists('pf_ripple')) {
    g.clear();
    g.lineStyle(3, 0xe7f9ff, 0.14);
    g.strokeCircle(24, 24, 18);
    g.lineStyle(2, 0xd7f7ff, 0.10);
    g.strokeCircle(24, 24, 10);

    // extra faint outer ring for scale
    g.lineStyle(2, 0xffffff, 0.06);
    g.strokeCircle(24, 24, 22);

    // tiny foam ticks around the ring
    g.fillStyle(0xe7f9ff, 0.08);
    for (let i = 0; i < 12; i += 1) {
      const x = 8 + (i * 13) % 32;
      const y = 10 + (i * 11) % 30;
      g.fillRect(x, y, 2, 1);
    }
    g.generateTexture('pf_ripple', 48, 48);
  }
}
