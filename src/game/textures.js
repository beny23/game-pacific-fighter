export function ensureTextures(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  function makeRng(seed) {
    // Deterministic PRNG for repeatable texture variants.
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  }

  // Player plane
  if (!scene.textures.exists('pf_plane')) {
    g.clear();
    // WW2-style single-prop fighter (side view, facing right)
    // palette: olive drab + aluminum accents
    // fuselage base
    g.fillStyle(0x6f7f5a, 1);
    g.fillRoundedRect(10, 12, 44, 8, 4);
    // nose cone
    g.fillStyle(0x9aa7a6, 1);
    g.fillTriangle(54, 12, 68, 16, 54, 20);
    // engine cowling band
    g.fillStyle(0x062033, 0.22);
    g.fillRoundedRect(50, 12, 8, 8, 3);
    // tail boom + fin
    g.fillStyle(0x6f7f5a, 1);
    g.fillTriangle(10, 12, 2, 8, 7, 16);
    g.fillTriangle(12, 12, 6, 4, 10, 12);
    // wings (top/bottom)
    g.fillStyle(0x6a7757, 1);
    g.fillTriangle(26, 10, 44, 4, 46, 12);
    g.fillTriangle(26, 22, 44, 28, 46, 20);
    // wing shadow
    g.fillStyle(0x062033, 0.12);
    g.fillTriangle(28, 22, 44, 27, 46, 20);
    // cockpit canopy
    g.fillStyle(0x062033, 0.6);
    g.fillRoundedRect(34, 12, 12, 7, 3);
    g.fillStyle(0xd7f7ff, 0.18);
    g.fillRoundedRect(36, 13, 6, 2, 1);
    // roundel (simple marking)
    g.fillStyle(0xe7f9ff, 0.42);
    g.fillCircle(30, 16, 3);
    g.fillStyle(0x062033, 0.18);
    g.fillCircle(30, 16, 1);
    // outline
    g.lineStyle(2, 0xffffff, 0.18);
    g.strokeRoundedRect(10, 12, 44, 8, 4);
    g.generateTexture('pf_plane', 72, 32);
  }

  // Shared propeller (spun via rotation in update)
  if (!scene.textures.exists('pf_prop')) {
    g.clear();
    // circular hub + 2 blades; semi-transparent to read as motion when rotated fast
    g.fillStyle(0xe7f9ff, 0.55);
    g.fillRoundedRect(2, 12, 24, 4, 2);
    g.fillRoundedRect(12, 2, 4, 24, 2);
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(14, 14, 2);
    g.lineStyle(2, 0xffffff, 0.18);
    g.strokeCircle(14, 14, 12);
    g.generateTexture('pf_prop', 28, 28);
  }

  // Enemy fighter
  if (!scene.textures.exists('pf_fighter')) {
    g.clear();
    // WW2-style enemy prop plane (will be flipped in code to face left)
    g.fillStyle(0x7a2f2f, 1);
    g.fillRoundedRect(10, 12, 40, 8, 4);
    g.fillTriangle(50, 12, 64, 16, 50, 20);
    g.fillStyle(0x062033, 0.18);
    g.fillRoundedRect(46, 12, 8, 8, 3);
    // tail + fin
    g.fillStyle(0x7a2f2f, 1);
    g.fillTriangle(10, 12, 2, 10, 7, 18);
    g.fillTriangle(12, 12, 7, 5, 10, 12);
    // wings
    g.fillTriangle(24, 10, 40, 5, 44, 12);
    g.fillTriangle(24, 22, 40, 27, 44, 20);
    // canopy
    g.fillStyle(0x062033, 0.55);
    g.fillRoundedRect(30, 12, 12, 7, 3);
    // markings
    g.fillStyle(0xffffff, 0.25);
    g.fillRect(22, 13, 10, 2);
    // outline
    g.lineStyle(2, 0xffffff, 0.18);
    g.strokeRoundedRect(10, 12, 40, 8, 4);
    g.generateTexture('pf_fighter', 68, 32);
  }

  // Turret
  if (!scene.textures.exists('pf_turret')) {
    g.clear();
    // Base block
    g.fillStyle(0xffd166, 1);
    g.fillRoundedRect(4, 12, 26, 16, 5);
    // Shadow
    g.fillStyle(0x062033, 0.14);
    g.fillRoundedRect(6, 22, 22, 6, 3);
    // Rotating head
    g.fillStyle(0xffb703, 1);
    g.fillRoundedRect(10, 6, 14, 12, 4);
    // Barrel + muzzle
    g.fillStyle(0x0a4d68, 0.65);
    g.fillRoundedRect(20, 10, 14, 4, 2);
    g.fillStyle(0xe7f9ff, 0.35);
    g.fillRect(32, 11, 2, 2);
    // Panel line
    g.lineStyle(2, 0xffffff, 0.16);
    g.strokeRoundedRect(4, 12, 26, 16, 5);
    g.lineStyle(1, 0xffffff, 0.12);
    g.strokeRoundedRect(10, 6, 14, 12, 4);
    g.generateTexture('pf_turret', 40, 32);
  }

  // Primary ground target (big, bomb-worthy)
  if (!scene.textures.exists('pf_target_primary')) {
    g.clear();
    // Fuel dump / hangar-ish silhouette
    g.fillStyle(0x6a7f86, 1);
    g.fillRoundedRect(4, 14, 56, 22, 6);
    // roof
    g.fillStyle(0x062033, 0.22);
    g.fillRoundedRect(6, 10, 52, 10, 6);
    // tanks
    g.fillStyle(0xffd166, 0.9);
    g.fillRoundedRect(10, 18, 14, 14, 7);
    g.fillRoundedRect(28, 18, 14, 14, 7);
    // hazard stripe
    g.fillStyle(0xff6b6b, 0.7);
    g.fillRect(46, 26, 10, 3);
    // outline + grime
    g.lineStyle(2, 0xffffff, 0.14);
    g.strokeRoundedRect(4, 14, 56, 22, 6);
    g.fillStyle(0x000000, 0.10);
    g.fillRect(6, 30, 50, 2);
    g.generateTexture('pf_target_primary', 64, 40);
  }

  // Secondary ground target (small)
  if (!scene.textures.exists('pf_target_secondary')) {
    g.clear();
    // Truck / crate silhouette
    g.fillStyle(0x6f7f5a, 1);
    g.fillRoundedRect(6, 16, 34, 16, 5);
    g.fillStyle(0x062033, 0.22);
    g.fillRoundedRect(8, 18, 16, 8, 4);
    g.fillStyle(0x6a7f86, 0.9);
    g.fillRoundedRect(26, 18, 12, 12, 4);
    // wheels
    g.fillStyle(0x062033, 0.65);
    g.fillCircle(14, 34, 3);
    g.fillCircle(32, 34, 3);
    g.lineStyle(2, 0xffffff, 0.12);
    g.strokeRoundedRect(6, 16, 34, 16, 5);
    g.generateTexture('pf_target_secondary', 48, 40);
  }

  // Player bullet
  if (!scene.textures.exists('pf_bullet')) {
    g.clear();
    // Tracer-like slug
    g.fillStyle(0xe7f9ff, 1);
    g.fillRoundedRect(0, 1, 18, 3, 2);
    g.fillStyle(0xe7f9ff, 0.25);
    g.fillRoundedRect(2, 0, 10, 1, 1);
    g.fillStyle(0xffd166, 0.55);
    g.fillRect(16, 1, 2, 3);
    g.generateTexture('pf_bullet', 18, 4);
  }

  // Enemy bullet
  if (!scene.textures.exists('pf_enemy_bullet')) {
    g.clear();
    // Reddish tracer
    g.fillStyle(0xff6b6b, 1);
    g.fillRoundedRect(0, 1, 12, 3, 2);
    g.fillStyle(0xff6b6b, 0.25);
    g.fillRoundedRect(1, 0, 7, 1, 1);
    g.generateTexture('pf_enemy_bullet', 12, 4);
  }

  // Flak
  if (!scene.textures.exists('pf_flak')) {
    g.clear();
    g.fillStyle(0x9b5de5, 1);
    g.fillCircle(5, 5, 5);
    g.lineStyle(2, 0xffffff, 0.22);
    g.strokeCircle(5, 5, 5);
    g.generateTexture('pf_flak', 10, 10);
  }

  // Muzzle flash
  if (!scene.textures.exists('pf_muzzle')) {
    g.clear();
    g.fillStyle(0xffd166, 0.95);
    g.fillTriangle(10, 0, 20, 10, 10, 20);
    g.fillTriangle(0, 10, 10, 0, 10, 20);
    g.fillStyle(0xff8c42, 0.65);
    g.fillCircle(10, 10, 4);
    g.lineStyle(2, 0xffffff, 0.12);
    g.strokeCircle(10, 10, 10);
    g.generateTexture('pf_muzzle', 20, 20);
  }

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

  // Soft shadow (ellipse) for planes
  if (!scene.textures.exists('pf_shadow')) {
    g.clear();
    g.fillStyle(0x000000, 0.28);
    g.fillEllipse(24, 14, 40, 16);
    g.fillStyle(0x000000, 0.14);
    g.fillEllipse(24, 14, 46, 20);
    g.generateTexture('pf_shadow', 48, 28);
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

  // Bomb
  if (!scene.textures.exists('pf_bomb')) {
    g.clear();
    g.fillStyle(0xfff3b0, 1);
    g.fillRoundedRect(6, 4, 12, 20, 6);
    g.fillStyle(0xe7f9ff, 0.35);
    g.fillRoundedRect(9, 8, 4, 12, 2);
    g.fillStyle(0xffd166, 1);
    g.fillTriangle(6, 22, 0, 26, 6, 26);
    g.fillTriangle(18, 22, 24, 26, 18, 26);
    g.generateTexture('pf_bomb', 24, 28);
  }

  // Carrier deck
  if (!scene.textures.exists('pf_carrier')) {
    g.clear();
    // Make it read like a ship: visible hull + deck with angled bow.
    // Hull side (darker)
    g.fillStyle(0x3c4e55, 1);
    // Main hull body
    g.fillRoundedRect(16, 18, 310, 18, 7);
    // Bow (angled front)
    g.fillTriangle(16, 18, 0, 27, 16, 36);
    // Stern (slight cut)
    g.fillTriangle(326, 18, 340, 22, 340, 34);
    // Hull shadow band
    g.fillStyle(0x062033, 0.18);
    g.fillRoundedRect(18, 28, 308, 7, 4);

    // Portholes
    g.fillStyle(0xe7f9ff, 0.10);
    for (let i = 0; i < 12; i += 1) {
      g.fillCircle(38 + i * 24, 31 + (i % 2), 1);
    }

    // Flight deck (lighter) slightly above hull
    g.fillStyle(0x6a7f86, 1);
    g.fillRoundedRect(10, 10, 322, 16, 7);
    // Deck edge shadow
    g.fillStyle(0x062033, 0.14);
    g.fillRoundedRect(14, 20, 312, 4, 3);

    // Dark deck inset
    g.fillStyle(0x062033, 0.20);
    g.fillRoundedRect(18, 12, 300, 12, 6);

    // Runway markings + centerline
    g.fillStyle(0xe7f9ff, 0.22);
    for (let i = 0; i < 9; i += 1) {
      g.fillRect(26 + i * 32, 18, 14, 2);
    }
    g.fillRect(22, 16, 296, 1);

    // Elevator cutout detail
    g.fillStyle(0x000000, 0.08);
    g.fillRoundedRect(120, 13, 44, 10, 4);

    // Superstructure (right side)
    g.fillStyle(0x062033, 0.32);
    g.fillRoundedRect(250, 2, 64, 14, 6);
    g.fillRoundedRect(276, 0, 28, 10, 5);
    // Bridge windows
    g.fillStyle(0xe7f9ff, 0.14);
    g.fillRect(260, 8, 10, 2);
    g.fillRect(274, 7, 12, 2);

    // Antenna mast
    g.fillStyle(0xe7f9ff, 0.12);
    g.fillRect(296, 0, 2, 8);

    // Grime streaks on deck
    g.fillStyle(0x062033, 0.08);
    for (let i = 0; i < 9; i += 1) {
      g.fillRect(30 + i * 34, 12, 2, 12);
    }

    // Outline
    g.lineStyle(2, 0xffffff, 0.10);
    g.strokeRoundedRect(10, 10, 322, 16, 7);
    g.lineStyle(2, 0xffffff, 0.08);
    g.strokeRoundedRect(16, 18, 310, 18, 7);

    g.generateTexture('pf_carrier', 340, 44);
  }

  // Enemy battleship
  if (!scene.textures.exists('pf_battleship')) {
    g.clear();
    // Long hull + deck + 3 turrets; reads even when scaled down.
    // Hull
    g.fillStyle(0x1a2a38, 1);
    g.fillRoundedRect(12, 26, 244, 20, 7);
    // Bow (right)
    g.fillTriangle(256, 26, 256, 46, 276, 38);
    // Stern (left)
    g.fillTriangle(12, 26, 0, 34, 12, 46);
    // Waterline shadow band
    g.fillStyle(0x062033, 0.22);
    g.fillRoundedRect(14, 38, 240, 7, 4);

    // Deck
    g.fillStyle(0x2a3e52, 1);
    g.fillRoundedRect(34, 16, 186, 14, 6);
    g.fillStyle(0x062033, 0.16);
    g.fillRoundedRect(40, 22, 174, 6, 3);

    // Superstructure
    g.fillStyle(0x344a60, 1);
    g.fillRoundedRect(134, 6, 48, 14, 6);
    g.fillRoundedRect(160, 2, 18, 12, 5);
    g.fillStyle(0xe7f9ff, 0.12);
    g.fillRect(142, 12, 12, 2);
    g.fillRect(156, 11, 12, 2);

    // Turrets + barrels
    g.fillStyle(0x223548, 1);
    const turrets = [
      { x: 74, y: 22 },
      { x: 146, y: 22 },
      { x: 206, y: 22 }
    ];
    for (const t of turrets) {
      g.fillRoundedRect(t.x - 14, t.y - 7, 28, 14, 6);
      g.fillRect(t.x + 10, t.y - 2, 18, 4);
      g.fillRect(t.x + 6, t.y - 4, 12, 2);
    }

    // Outline
    g.lineStyle(2, 0xffffff, 0.08);
    g.strokeRoundedRect(34, 16, 186, 14, 6);
    g.lineStyle(2, 0xffffff, 0.06);
    g.strokeRoundedRect(12, 26, 244, 20, 7);

    g.generateTexture('pf_battleship', 280, 56);
  }

  // Ocean tile (for scrolling waves)
  if (!scene.textures.exists('pf_ocean_tile')) {
    g.clear();
    // Brighter blue base so water reads clearly against the gritty sky.
    g.fillStyle(0x0b4d7a, 1);
    g.fillRect(0, 0, 128, 64);
    // soft wave bands
    g.fillStyle(0xe7f9ff, 0.12);
    for (let y = 8; y < 64; y += 12) {
      g.fillRoundedRect(0, y, 128, 5, 3);
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

    g.fillStyle(0xe7f9ff, 0.18);
    for (let i = 0; i < 10; i += 1) {
      const x = 6 + i * 13;
      const y = 6 + ((i % 3) * 7);
      g.fillRoundedRect(x, y, 10 + (i % 2) * 6, 3, 2);
      g.fillRect(x + 3, y + 3, 4, 1);
    }

    g.fillStyle(0xe7f9ff, 0.10);
    for (let i = 0; i < 12; i += 1) {
      const x = 10 + (i * 17) % 128;
      const y = 2 + (i * 5) % 28;
      g.fillRect(x, y, 2, 1);
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

  // Smoke puff
  if (!scene.textures.exists('pf_smoke')) {
    g.clear();
    g.fillStyle(0xe7f9ff, 0.55);
    g.fillCircle(10, 10, 8);
    g.fillStyle(0xd7f7ff, 0.35);
    g.fillCircle(14, 12, 6);
    g.fillStyle(0x062033, 0.12);
    g.fillCircle(9, 13, 5);
    g.generateTexture('pf_smoke', 24, 24);
  }

  // Explosion puff
  if (!scene.textures.exists('pf_explosion')) {
    g.clear();
    g.fillStyle(0xff8c42, 0.9);
    g.fillCircle(18, 18, 16);
    g.fillStyle(0xffd166, 0.75);
    g.fillCircle(14, 16, 10);
    g.fillStyle(0xe7f9ff, 0.18);
    g.fillCircle(20, 20, 8);
    g.lineStyle(2, 0xffffff, 0.12);
    g.strokeCircle(18, 18, 16);
    g.generateTexture('pf_explosion', 36, 36);
  }

  // Carrier wake (stretched foam)
  if (!scene.textures.exists('pf_wake')) {
    g.clear();
    g.fillStyle(0xe7f9ff, 0.16);
    g.fillRoundedRect(0, 10, 220, 18, 9);
    g.fillStyle(0xd7f7ff, 0.12);
    for (let i = 0; i < 18; i += 1) {
      g.fillCircle(10 + i * 12, 18 + ((i % 3) - 1) * 2, 5);
    }
    g.fillStyle(0xffffff, 0.06);
    g.fillRoundedRect(10, 14, 190, 10, 6);
    g.generateTexture('pf_wake', 220, 40);
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
    g.generateTexture('pf_splash', 48, 40);
  }

  // Water ripple ring
  if (!scene.textures.exists('pf_ripple')) {
    g.clear();
    g.lineStyle(3, 0xe7f9ff, 0.14);
    g.strokeCircle(24, 24, 18);
    g.lineStyle(2, 0xd7f7ff, 0.10);
    g.strokeCircle(24, 24, 10);
    g.generateTexture('pf_ripple', 48, 48);
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

    // Backward-compatible alias.
    if (!scene.textures.exists('pf_island')) {
      // If somehow requested, just point it to the first variant by copying pixels.
      const src = scene.textures.get('pf_island_0');
      if (src) {
        // Phaser doesn't support aliasing texture keys directly, so re-generate using the same texture.
        // We can create an image from pf_island_0 at runtime; for texture existence, keep using pf_island_0.
      }
    }
  }

  g.destroy();
}
