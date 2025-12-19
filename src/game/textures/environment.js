export function ensureEnvironmentTextures(scene, g, { makeRng }) {
  // Ocean tile (for scrolling waves)
  if (!scene.textures.exists('pf_ocean_tile')) {
    g.clear();
    // Brighter blue base so water reads clearly against the gritty sky.
    g.fillStyle(0x0b4d7a, 1);
    g.fillRect(0, 0, 128, 64);

    // Subtle depth bands (darker water under wavelets)
    g.fillStyle(0x062033, 0.10);
    for (let y = 4; y < 64; y += 10) {
      g.fillRoundedRect(0, y, 128, 3, 2);
    }

    // soft wave bands
    g.fillStyle(0xe7f9ff, 0.12);
    for (let y = 8; y < 64; y += 12) {
      g.fillRoundedRect(0, y, 128, 5, 3);
    }

    // secondary finer bands
    g.fillStyle(0xe7f9ff, 0.06);
    for (let y = 2; y < 64; y += 8) {
      g.fillRoundedRect(0, y, 128, 2, 2);
    }

    // light foam clusters
    g.fillStyle(0xd7f7ff, 0.08);
    for (let i = 0; i < 22; i += 1) {
      const x = (i * 31) % 128;
      const y = 6 + ((i * 17) % 52);
      g.fillCircle(x, y, 2);
      if (i % 3 === 0) g.fillCircle((x + 7) % 128, y + 1, 1);
    }

    // dark speckle noise (adds grit)
    g.fillStyle(0x062033, 0.10);
    for (let i = 0; i < 34; i += 1) {
      const x = (i * 19) % 128;
      const y = (i * 23) % 64;
      g.fillRect(x, y, 1, 1);
    }

    // sparkles
    g.fillStyle(0xe7f9ff, 0.10);
    for (let i = 0; i < 26; i += 1) {
      const x = (i * 23) % 128;
      const y = (i * 17) % 64;
      g.fillRect(x, y, 2, 1);
    }
    g.generateTexture('pf_ocean_tile', 128, 64);
  }

  // Wave crest tile (whitecaps)
  if (!scene.textures.exists('pf_wave_crest')) {
    g.clear();
    g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, 128, 32);

    // broad foam streaks
    g.fillStyle(0xe7f9ff, 0.18);
    for (let i = 0; i < 9; i += 1) {
      const x = 4 + i * 14;
      const y = 5 + ((i % 3) * 7);
      g.fillRoundedRect(x, y, 12 + (i % 2) * 7, 3, 2);
      g.fillRoundedRect(x + 2, y + 3, 8 + (i % 2) * 5, 2, 2);
    }

    // finer foam bits
    g.fillStyle(0xd7f7ff, 0.10);
    for (let i = 0; i < 16; i += 1) {
      const x = 6 + (i * 19) % 128;
      const y = 4 + (i * 7) % 26;
      g.fillCircle(x, y, 2);
      if (i % 4 === 0) g.fillRect(x + 3, y, 2, 1);
    }

    // thin highlight stroke (gives crest definition)
    g.lineStyle(2, 0xffffff, 0.06);
    for (let i = 0; i < 6; i += 1) {
      const x = 10 + i * 20;
      const y = 6 + (i % 2) * 8;
      g.strokeRoundedRect(x, y, 18, 6, 3);
    }

    g.generateTexture('pf_wave_crest', 128, 32);
  }

  // Sky tile (vertical gradient bands)
  if (!scene.textures.exists('pf_sky')) {
    g.clear();
    const top = { r: 0x0b, g: 0x1d, b: 0x34 };
    const bottom = { r: 0x2b, g: 0x57, b: 0x6b };

    for (let y = 0; y < 256; y += 8) {
      const t = y / 255;
      const r = Math.round(top.r + (bottom.r - top.r) * t);
      const gg = Math.round(top.g + (bottom.g - top.g) * t);
      const b = Math.round(top.b + (bottom.b - top.b) * t);
      const color = (r << 16) | (gg << 8) | b;
      g.fillStyle(color, 1);
      g.fillRect(0, y, 64, 8);
    }

    // subtle haze specks
    g.fillStyle(0xe7f9ff, 0.05);
    for (let i = 0; i < 40; i += 1) {
      const x = (i * 29) % 64;
      const y = (i * 37) % 256;
      g.fillRect(x, y, 1, 1);
    }

    g.generateTexture('pf_sky', 64, 256);
  }

  // Film grain tile (very subtle overlay; helps unify the scene)
  if (!scene.textures.exists('pf_grain')) {
    g.clear();
    g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, 96, 96);

    // Bright specks
    g.fillStyle(0xffffff, 0.06);
    for (let i = 0; i < 140; i += 1) {
      const x = (i * 37) % 96;
      const y = (i * 61) % 96;
      const w = (i % 5) === 0 ? 2 : 1;
      g.fillRect(x, y, w, 1);
    }

    // Dark specks
    g.fillStyle(0x062033, 0.08);
    for (let i = 0; i < 120; i += 1) {
      const x = (i * 29) % 96;
      const y = (i * 53) % 96;
      g.fillRect(x, y, 1, 1);
    }

    g.generateTexture('pf_grain', 96, 96);
  }

  // Cloud blob
  if (!scene.textures.exists('pf_cloud')) {
    g.clear();
    g.fillStyle(0xd7f7ff, 1);
    g.fillCircle(18, 16, 12);
    g.fillCircle(32, 14, 14);
    g.fillCircle(46, 18, 10);
    g.fillRoundedRect(12, 18, 44, 14, 7);
    g.lineStyle(2, 0xffffff, 0.18);
    g.strokeRoundedRect(12, 18, 44, 14, 7);
    g.generateTexture('pf_cloud', 64, 40);
  }

  // Island variants (so not every island looks the same)
  if (!scene.textures.exists('pf_island_0')) {
    const variants = [
      { key: 'pf_island_0', seed: 101, land: 0x2f5e49, beachAlpha: 0.55 },
      { key: 'pf_island_1', seed: 202, land: 0x315744, beachAlpha: 0.52 },
      { key: 'pf_island_2', seed: 303, land: 0x2a5a46, beachAlpha: 0.58 }
    ];

    for (const v of variants) {
      const rnd = makeRng(v.seed);
      g.clear();

      // Base land mass
      g.fillStyle(v.land, 1);
      g.fillRoundedRect(0, 30, 520, 160, 48);

      // Cliffs / shadow band
      g.fillStyle(0x062033, 0.15);
      g.fillRoundedRect(0, 92, 520, 62, 28);

      // Top grass ridge highlight
      g.fillStyle(0xe7f9ff, 0.07);
      g.fillRoundedRect(0, 30, 520, 26, 18);

      // Dirt tracks / roads (vary per island)
      g.fillStyle(0x062033, 0.10);
      const roadY1 = 96 + Math.floor(rnd() * 18);
      const roadY2 = 112 + Math.floor(rnd() * 18);
      const roadY3 = 80 + Math.floor(rnd() * 18);
      g.fillRoundedRect(30 + Math.floor(rnd() * 40), roadY1, 190 + Math.floor(rnd() * 90), 7 + Math.floor(rnd() * 3), 4);
      g.fillRoundedRect(210 + Math.floor(rnd() * 40), roadY2, 170 + Math.floor(rnd() * 110), 6 + Math.floor(rnd() * 3), 4);
      g.fillRoundedRect(90 + Math.floor(rnd() * 80), roadY3, 120 + Math.floor(rnd() * 80), 5 + Math.floor(rnd() * 3), 3);

      // Beach strip + wet-sand edge
      g.fillStyle(0xffd166, v.beachAlpha);
      g.fillRoundedRect(0, 148, 520, 42, 22);
      g.fillStyle(0x6fd2ff, 0.22);
      g.fillRoundedRect(0, 158, 520, 10, 18);

      // Rocky speckles on the beach (random scatter)
      g.fillStyle(0x062033, 0.12);
      for (let i = 0; i < 34; i += 1) {
        const x = 12 + Math.floor(rnd() * 496);
        const y = 152 + Math.floor(rnd() * 34);
        const r = 1 + Math.floor(rnd() * 3);
        g.fillCircle(x, y, r);
      }

      // Palm-ish silhouettes (count + placement varies)
      const palms = 4 + Math.floor(rnd() * 5);
      for (let i = 0; i < palms; i += 1) {
        const x = 34 + Math.floor(rnd() * 452);
        const baseY = 102 + Math.floor(rnd() * 26);
        g.fillStyle(0x062033, 0.18);
        g.fillRoundedRect(x, baseY, 4, 18, 2);
        g.fillStyle(0x062033, 0.12);
        g.fillCircle(x + 2, baseY - 2, 7);
        g.fillCircle(x - 4, baseY, 5);
        g.fillCircle(x + 8, baseY, 5);
      }

      // Bunkers / structures (vary)
      g.fillStyle(0x062033, 0.28);
      const bx = 280 + Math.floor(rnd() * 140);
      const by = 70 + Math.floor(rnd() * 18);
      g.fillRoundedRect(bx, by, 62 + Math.floor(rnd() * 26), 20, 6);
      g.fillRoundedRect(bx + 52, by + 6, 34 + Math.floor(rnd() * 12), 16, 6);
      g.fillStyle(0xe7f9ff, 0.10);
      g.fillRect(bx + 10, by + 8, 16, 4);
      g.fillRect(bx + 32, by + 8, 16, 4);

      // AA pit craters (random)
      g.fillStyle(0x062033, 0.16);
      for (let i = 0; i < 3; i += 1) {
        const cx = 60 + Math.floor(rnd() * 420);
        const cy = 112 + Math.floor(rnd() * 30);
        const cr = 10 + Math.floor(rnd() * 8);
        g.fillCircle(cx, cy, cr);
        g.fillStyle(0xe7f9ff, 0.06);
        g.fillCircle(cx, cy, Math.max(6, cr - 4));
        g.fillStyle(0x062033, 0.16);
      }

      // Scorch marks + smoke columns (vary)
      g.fillStyle(0x000000, 0.10);
      for (let i = 0; i < 3; i += 1) {
        const sx = 160 + Math.floor(rnd() * 270);
        const sy = 108 + Math.floor(rnd() * 26);
        const sr = 10 + Math.floor(rnd() * 10);
        g.fillCircle(sx, sy, sr);
      }

      g.fillStyle(0xe7f9ff, 0.05);
      const smokeCols = 2 + Math.floor(rnd() * 3);
      for (let i = 0; i < smokeCols; i += 1) {
        const sx = 170 + Math.floor(rnd() * 300);
        const sy = 84 + Math.floor(rnd() * 18);
        g.fillRoundedRect(sx, sy, 16, 34, 8);
        g.fillCircle(sx + 8, sy, 10);
      }

      g.generateTexture(v.key, 520, 190);
    }
  }
}
