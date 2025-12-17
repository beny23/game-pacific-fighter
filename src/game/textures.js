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

    // Fuselage (longer, reads side-on)
    g.fillStyle(0x6f7f5a, 1);
    g.fillRoundedRect(10, 14, 44, 6, 3);
    // Nose / engine (round cowl + shorter cone so it doesn't read like a torpedo)
    g.fillStyle(0x9aa7a6, 1);
    g.fillTriangle(54, 14, 66, 17, 54, 20);
    // radial cowl ring
    g.fillStyle(0x9aa7a6, 0.95);
    g.fillCircle(54, 17, 5);
    g.lineStyle(2, 0xffffff, 0.10);
    g.strokeCircle(54, 17, 5);
    // spinner hub (prop axis)
    g.fillStyle(0xe7f9ff, 0.20);
    g.fillCircle(59, 17, 2);
    g.fillStyle(0x062033, 0.18);
    g.fillCircle(59, 17, 1);
    // Tail taper
    g.fillStyle(0x6f7f5a, 1);
    g.fillTriangle(10, 14, 2, 12, 8, 17);
    g.fillTriangle(10, 20, 4, 23, 9, 18);

    // Top highlight + belly shadow to add volume
    g.fillStyle(0xe7f9ff, 0.06);
    g.fillRoundedRect(12, 14, 38, 2, 2);
    g.fillStyle(0x062033, 0.16);
    g.fillRoundedRect(12, 18, 38, 2, 2);

    // Cowling band + intake
    g.fillStyle(0x062033, 0.24);
    g.fillRoundedRect(46, 14, 8, 6, 3);
    g.fillStyle(0x062033, 0.35);
    g.fillCircle(55, 17, 2);

    // Tail fin + tailplane (make fin very obvious)
    g.fillStyle(0x6a7757, 1);
    // fin (taller, more vertical)
    g.fillTriangle(11, 14, 7, 3, 16, 15);
    // fin highlight
    g.fillStyle(0xe7f9ff, 0.07);
    g.fillTriangle(11, 14, 9, 6, 15, 15);
    // rudder line
    g.lineStyle(1, 0x062033, 0.22);
    g.lineBetween(12, 14, 11, 6);
    // fin outline
    g.lineStyle(2, 0xffffff, 0.10);
    g.lineBetween(11, 14, 7, 3);
    g.lineBetween(7, 3, 16, 15);
    g.lineBetween(16, 15, 11, 14);
    // tailplane
    g.fillStyle(0x6a7757, 1);
    g.fillRoundedRect(10, 18, 14, 4, 2);
    g.fillStyle(0x062033, 0.18);
    g.fillRect(10, 21, 14, 1);
    // tail outline
    g.lineStyle(2, 0xffffff, 0.10);
    g.lineBetween(10, 18, 24, 18);

    // Tailwheel hint (breaks "rocket" silhouette)
    g.fillStyle(0x062033, 0.35);
    g.fillCircle(9, 23, 1);

    // Wing (make it obvious): larger span + slightly lower placement + strong outline.
    const wA = { x: 18, y: 19 };
    const wB = { x: 68, y: 21 };
    const wC = { x: 63, y: 24 };
    const wD = { x: 16, y: 22 };

    g.fillStyle(0x6a7757, 1);
    g.fillTriangle(wA.x, wA.y, wB.x, wB.y, wC.x, wC.y);
    g.fillTriangle(wA.x, wA.y, wC.x, wC.y, wD.x, wD.y);

    // Wing outline (contrast)
    g.lineStyle(2, 0xffffff, 0.14);
    g.lineBetween(wA.x, wA.y, wB.x, wB.y);
    g.lineBetween(wB.x, wB.y, wC.x, wC.y);
    g.lineBetween(wC.x, wC.y, wD.x, wD.y);
    g.lineBetween(wD.x, wD.y, wA.x, wA.y);

    // Wing underside (thickness)
    g.fillStyle(0x062033, 0.16);
    g.fillTriangle(18, 22, 68, 24, 63, 24);
    g.fillTriangle(18, 22, 63, 24, 16, 24);

    // Leading edge highlight (brighter so it reads)
    g.lineStyle(2, 0xffffff, 0.12);
    g.lineBetween(wA.x + 1, wA.y, wB.x - 1, wB.y);

    // Strut/brace (darker + longer)
    g.lineStyle(2, 0x062033, 0.22);
    g.lineBetween(28, 19, 40, 24);

    // Cockpit canopy + hump (more airplane-like)
    g.fillStyle(0x6f7f5a, 1);
    g.fillRoundedRect(30, 11, 14, 4, 2);
    g.fillStyle(0x062033, 0.62);
    g.fillRoundedRect(32, 12, 12, 6, 3);
    g.fillStyle(0xd7f7ff, 0.16);
    g.fillRoundedRect(34, 13, 6, 2, 1);

    // Exhaust streak
    g.fillStyle(0x062033, 0.12);
    g.fillRect(44, 17, 7, 1);

    // Landing gear hints (tiny wheels) — improves silhouette at speed
    g.fillStyle(0x062033, 0.25);
    g.fillCircle(36, 23, 1);
    g.fillCircle(46, 23, 1);

    // Roundel
    g.fillStyle(0xe7f9ff, 0.38);
    g.fillCircle(28, 17, 3);
    g.fillStyle(0x062033, 0.18);
    g.fillCircle(28, 17, 1);

    // Outline (kept light)
    g.lineStyle(2, 0xffffff, 0.16);
    g.strokeRoundedRect(10, 14, 44, 6, 3);
    g.generateTexture('pf_plane', 72, 32);
  }

  // Shared propeller (spun via rotation in update)
  if (!scene.textures.exists('pf_prop')) {
    g.clear();
    // circular hub + 2 blades; semi-transparent to read as motion when rotated fast

    // Motion-blur disc + spokes
    g.fillStyle(0xe7f9ff, 0.12);
    g.fillCircle(14, 14, 12);
    g.lineStyle(2, 0xffffff, 0.16);
    g.strokeCircle(14, 14, 12);

    // extra faint inner ring for depth
    g.lineStyle(2, 0xffffff, 0.08);
    g.strokeCircle(14, 14, 8);

    // 2 faint blades
    g.fillStyle(0xe7f9ff, 0.42);
    g.fillRoundedRect(2, 12, 24, 4, 2);
    g.fillRoundedRect(12, 2, 4, 24, 2);

    // hub
    g.fillStyle(0xffffff, 0.55);
    g.fillCircle(14, 14, 2);
    g.fillStyle(0x062033, 0.10);
    g.fillCircle(14, 14, 1);
    g.generateTexture('pf_prop', 28, 28);
  }

  // Enemy fighter
  if (!scene.textures.exists('pf_fighter')) {
    g.clear();
    // WW2-style enemy prop plane (will be flipped in code to face left)

    // Fuselage
    g.fillStyle(0x7a2f2f, 1);
    g.fillRoundedRect(10, 14, 42, 6, 3);
    // Nose / engine (round cowl)
    g.fillStyle(0x9aa7a6, 0.92);
    g.fillTriangle(52, 14, 64, 17, 52, 20);
    g.fillStyle(0x9aa7a6, 0.90);
    g.fillCircle(52, 17, 5);
    g.lineStyle(2, 0xffffff, 0.09);
    g.strokeCircle(52, 17, 5);
    g.fillStyle(0xe7f9ff, 0.18);
    g.fillCircle(57, 17, 2);
    g.fillStyle(0x062033, 0.18);
    g.fillCircle(57, 17, 1);
    // Tail taper
    g.fillStyle(0x7a2f2f, 1);
    g.fillTriangle(10, 14, 2, 12, 8, 17);
    g.fillTriangle(10, 20, 4, 23, 9, 18);

    // Volume shading
    g.fillStyle(0xe7f9ff, 0.05);
    g.fillRoundedRect(12, 14, 36, 2, 2);
    g.fillStyle(0x062033, 0.16);
    g.fillRoundedRect(12, 18, 36, 2, 2);

    // Cowling band + intake
    g.fillStyle(0x062033, 0.20);
    g.fillRoundedRect(44, 14, 8, 6, 3);
    g.fillStyle(0x062033, 0.35);
    g.fillCircle(53, 17, 2);

    // Tail fin + tailplane (make fin very obvious)
    g.fillStyle(0x6a2730, 0.95);
    // fin (taller, more vertical)
    g.fillTriangle(11, 14, 7, 4, 16, 15);
    g.fillStyle(0xe7f9ff, 0.06);
    g.fillTriangle(11, 14, 9, 7, 15, 15);
    // rudder line
    g.lineStyle(1, 0x062033, 0.22);
    g.lineBetween(12, 14, 11, 7);
    // fin outline
    g.lineStyle(2, 0xffffff, 0.10);
    g.lineBetween(11, 14, 7, 4);
    g.lineBetween(7, 4, 16, 15);
    g.lineBetween(16, 15, 11, 14);
    g.fillStyle(0x6a2730, 0.95);
    g.fillRoundedRect(10, 18, 14, 4, 2);
    g.fillStyle(0x062033, 0.18);
    g.fillRect(10, 21, 14, 1);
    g.lineStyle(2, 0xffffff, 0.10);
    g.lineBetween(10, 18, 24, 18);

    // Tailwheel hint
    g.fillStyle(0x062033, 0.32);
    g.fillCircle(9, 23, 1);

    // Wing (make it obvious): larger span + outline.
    const ewA2 = { x: 17, y: 19 };
    const ewB2 = { x: 64, y: 21 };
    const ewC2 = { x: 59, y: 24 };
    const ewD2 = { x: 15, y: 22 };

    g.fillStyle(0x6a2730, 0.98);
    g.fillTriangle(ewA2.x, ewA2.y, ewB2.x, ewB2.y, ewC2.x, ewC2.y);
    g.fillTriangle(ewA2.x, ewA2.y, ewC2.x, ewC2.y, ewD2.x, ewD2.y);

    g.lineStyle(2, 0xffffff, 0.12);
    g.lineBetween(ewA2.x, ewA2.y, ewB2.x, ewB2.y);
    g.lineBetween(ewB2.x, ewB2.y, ewC2.x, ewC2.y);
    g.lineBetween(ewC2.x, ewC2.y, ewD2.x, ewD2.y);
    g.lineBetween(ewD2.x, ewD2.y, ewA2.x, ewA2.y);

    g.fillStyle(0x062033, 0.16);
    g.fillTriangle(17, 22, 64, 24, 59, 24);
    g.fillTriangle(17, 22, 59, 24, 15, 24);

    g.lineStyle(2, 0xffffff, 0.10);
    g.lineBetween(ewA2.x + 1, ewA2.y, ewB2.x - 1, ewB2.y);

    g.lineStyle(2, 0x062033, 0.22);
    g.lineBetween(27, 19, 38, 24);

    // Canopy + hump
    g.fillStyle(0x7a2f2f, 1);
    g.fillRoundedRect(28, 11, 14, 4, 2);
    g.fillStyle(0x062033, 0.58);
    g.fillRoundedRect(30, 12, 12, 6, 3);
    g.fillStyle(0xd7f7ff, 0.14);
    g.fillRoundedRect(32, 13, 6, 2, 1);

    // Markings
    g.fillStyle(0xffffff, 0.20);
    g.fillRect(20, 16, 10, 2);

    // Landing gear hints
    g.fillStyle(0x062033, 0.22);
    g.fillCircle(34, 23, 1);
    g.fillCircle(44, 23, 1);

    // Outline
    g.lineStyle(2, 0xffffff, 0.16);
    g.strokeRoundedRect(10, 14, 42, 6, 3);
    g.generateTexture('pf_fighter', 68, 32);
  }

  // Enemy bomber (bigger, flies same direction as player)
  if (!scene.textures.exists('pf_bomber')) {
    g.clear();

    // Canvas: 128x44, side-on, facing right.
    // Fuselage
    g.fillStyle(0x6a7f86, 1);
    g.fillRoundedRect(12, 20, 76, 10, 5);
    // Nose (rounded, not pointy)
    g.fillCircle(88, 25, 5);
    g.fillRoundedRect(84, 20, 10, 10, 5);
    // Tail boom taper
    g.fillTriangle(12, 20, 2, 18, 10, 25);
    g.fillTriangle(12, 30, 4, 34, 10, 26);

    // Volume shading
    g.fillStyle(0xe7f9ff, 0.06);
    g.fillRoundedRect(16, 20, 66, 3, 3);
    g.fillStyle(0x062033, 0.18);
    g.fillRoundedRect(16, 27, 66, 3, 3);

    // Cockpit hump + canopy
    g.fillStyle(0x6a7f86, 1);
    g.fillRoundedRect(64, 14, 18, 8, 4);
    g.fillStyle(0x062033, 0.62);
    g.fillRoundedRect(66, 15, 14, 7, 3);
    g.fillStyle(0xd7f7ff, 0.14);
    g.fillRoundedRect(68, 16, 7, 2, 1);

    // Big wing (side profile)
    const wA = { x: 26, y: 22 };
    const wB = { x: 110, y: 26 };
    const wC = { x: 104, y: 31 };
    const wD = { x: 22, y: 28 };

    g.fillStyle(0x344a60, 1);
    g.fillTriangle(wA.x, wA.y, wB.x, wB.y, wC.x, wC.y);
    g.fillTriangle(wA.x, wA.y, wC.x, wC.y, wD.x, wD.y);

    // Wing underside thickness
    g.fillStyle(0x062033, 0.16);
    g.fillTriangle(26, 27, 110, 30, 104, 31);
    g.fillTriangle(26, 27, 104, 31, 22, 31);

    // Wing outline/highlight
    g.lineStyle(2, 0xffffff, 0.12);
    g.lineBetween(wA.x, wA.y, wB.x, wB.y);
    g.lineBetween(wB.x, wB.y, wC.x, wC.y);
    g.lineBetween(wC.x, wC.y, wD.x, wD.y);
    g.lineBetween(wD.x, wD.y, wA.x, wA.y);

    // Twin engine nacelles (as dark pods)
    g.fillStyle(0x062033, 0.22);
    g.fillRoundedRect(58, 23, 10, 8, 4);
    g.fillRoundedRect(78, 24, 10, 8, 4);
    // Nacelle highlights
    g.fillStyle(0xe7f9ff, 0.06);
    g.fillRoundedRect(60, 24, 6, 2, 2);
    g.fillRoundedRect(80, 25, 6, 2, 2);

    // Tailplane + strong tail fin
    g.fillStyle(0x344a60, 1);
    g.fillRoundedRect(10, 26, 22, 6, 3);
    g.fillStyle(0x062033, 0.16);
    g.fillRect(10, 30, 22, 2);

    g.fillStyle(0x344a60, 1);
    g.fillTriangle(14, 20, 8, 6, 20, 22);
    g.fillStyle(0xe7f9ff, 0.07);
    g.fillTriangle(14, 20, 12, 10, 19, 22);
    g.lineStyle(2, 0xffffff, 0.10);
    g.lineBetween(14, 20, 8, 6);
    g.lineBetween(8, 6, 20, 22);
    g.lineBetween(20, 22, 14, 20);

    // Porthole dots to break up "torpedo" silhouette
    g.fillStyle(0xe7f9ff, 0.10);
    for (let i = 0; i < 8; i += 1) {
      g.fillRect(22 + i * 8, 25 + (i % 2), 2, 1);
    }

    // Outline fuselage
    g.lineStyle(2, 0xffffff, 0.10);
    g.strokeRoundedRect(12, 20, 76, 10, 5);

    g.generateTexture('pf_bomber', 128, 44);
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

    // Subtle top highlight to give hull volume
    g.fillStyle(0xe7f9ff, 0.06);
    g.fillRoundedRect(16, 28, 232, 5, 3);

    // Waterline shadow band
    g.fillStyle(0x062033, 0.22);
    g.fillRoundedRect(14, 38, 240, 7, 4);

    // Portholes / details
    g.fillStyle(0xe7f9ff, 0.08);
    for (let i = 0; i < 18; i += 1) {
      g.fillRect(26 + i * 12, 36 + (i % 2), 2, 1);
    }

    // Deck
    g.fillStyle(0x2a3e52, 1);
    g.fillRoundedRect(34, 16, 186, 14, 6);
    g.fillStyle(0x062033, 0.16);
    g.fillRoundedRect(40, 22, 174, 6, 3);

    // Deck planking / panels
    g.fillStyle(0xe7f9ff, 0.05);
    for (let x = 44; x < 212; x += 14) {
      g.fillRect(x, 17, 1, 12);
    }

    // Deck grime
    g.fillStyle(0x062033, 0.10);
    for (let i = 0; i < 10; i += 1) {
      const x = 50 + ((i * 29) % 160);
      g.fillRect(x, 18 + (i % 3), 2, 10);
    }

    // Superstructure
    g.fillStyle(0x344a60, 1);
    g.fillRoundedRect(134, 6, 48, 14, 6);
    g.fillRoundedRect(160, 2, 18, 12, 5);
    g.fillStyle(0xe7f9ff, 0.12);
    g.fillRect(142, 12, 12, 2);
    g.fillRect(156, 11, 12, 2);

    // Superstructure shadow and extra window line
    g.fillStyle(0x062033, 0.16);
    g.fillRoundedRect(136, 15, 44, 4, 3);
    g.fillStyle(0xe7f9ff, 0.08);
    g.fillRect(142, 9, 22, 1);

    // Turrets + barrels
    g.fillStyle(0x223548, 1);
    const turrets = [
      { x: 74, y: 22 },
      { x: 146, y: 22 },
      { x: 206, y: 22 }
    ];
    for (const t of turrets) {
      g.fillRoundedRect(t.x - 14, t.y - 7, 28, 14, 6);
      g.fillStyle(0xe7f9ff, 0.05);
      g.fillRoundedRect(t.x - 14, t.y - 7, 28, 4, 3);
      g.fillStyle(0x223548, 1);
      g.fillRect(t.x + 10, t.y - 2, 18, 4);
      g.fillRect(t.x + 6, t.y - 4, 12, 2);
    }

    // AA silhouettes (tiny)
    g.fillStyle(0x062033, 0.22);
    g.fillRect(112, 22, 4, 3);
    g.fillRect(182, 22, 4, 3);

    // Outline
    g.lineStyle(2, 0xffffff, 0.08);
    g.strokeRoundedRect(34, 16, 186, 14, 6);
    g.lineStyle(2, 0xffffff, 0.06);
    g.strokeRoundedRect(12, 26, 244, 20, 7);

    g.generateTexture('pf_battleship', 280, 56);
  }

  // Small boat (ocean convoy target)
  if (!scene.textures.exists('pf_boat')) {
    g.clear();
    // hull
    g.fillStyle(0x1a2a38, 1);
    g.fillRoundedRect(6, 10, 84, 12, 5);
    g.fillTriangle(90, 10, 90, 22, 102, 16);
    g.fillTriangle(6, 10, 0, 14, 6, 22);

    // top highlight
    g.fillStyle(0xe7f9ff, 0.06);
    g.fillRoundedRect(10, 11, 70, 3, 2);

    // waterline shade
    g.fillStyle(0x062033, 0.18);
    g.fillRoundedRect(8, 18, 80, 3, 2);

    // deck
    g.fillStyle(0x2a3e52, 1);
    g.fillRoundedRect(18, 6, 54, 10, 5);

    // deck panels
    g.fillStyle(0xe7f9ff, 0.05);
    for (let x = 24; x < 68; x += 11) g.fillRect(x, 7, 1, 8);

    // tiny bridge
    g.fillStyle(0x344a60, 1);
    g.fillRoundedRect(50, 2, 14, 8, 3);
    g.fillStyle(0xe7f9ff, 0.12);
    g.fillRect(53, 6, 6, 1);

    // tiny gun mount
    g.fillStyle(0x062033, 0.22);
    g.fillRect(34, 7, 4, 3);
    g.fillRect(37, 8, 6, 1);

    // outline
    g.lineStyle(2, 0xffffff, 0.06);
    g.strokeRoundedRect(18, 6, 54, 10, 5);
    g.lineStyle(2, 0xffffff, 0.05);
    g.strokeRoundedRect(6, 10, 84, 12, 5);
    g.generateTexture('pf_boat', 104, 26);
  }

  // Small/big ship wakes (for boats + battleship)
  if (!scene.textures.exists('pf_ship_wake_small')) {
    g.clear();
    g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, 160, 28);

    g.fillStyle(0xe7f9ff, 0.16);
    g.fillRoundedRect(4, 10, 152, 10, 6);
    g.fillStyle(0xd7f7ff, 0.12);
    for (let i = 0; i < 16; i += 1) {
      const x = 10 + i * 9;
      const y = 12 + ((i % 3) - 1);
      g.fillCircle(x, y, 4);
    }
    g.fillStyle(0xffffff, 0.06);
    g.fillRoundedRect(18, 12, 116, 6, 4);

    g.generateTexture('pf_ship_wake_small', 160, 28);
  }

  if (!scene.textures.exists('pf_ship_wake_big')) {
    g.clear();
    g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, 300, 44);

    g.fillStyle(0xe7f9ff, 0.14);
    g.fillRoundedRect(0, 14, 300, 18, 10);
    g.fillStyle(0xd7f7ff, 0.11);
    for (let i = 0; i < 22; i += 1) {
      const x = 14 + i * 13;
      const y = 22 + ((i % 4) - 1) * 2;
      g.fillCircle(x, y, 6);
    }
    g.fillStyle(0xffffff, 0.05);
    g.fillRoundedRect(18, 18, 264, 10, 7);

    g.generateTexture('pf_ship_wake_big', 300, 44);
  }

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
