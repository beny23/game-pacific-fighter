export function ensurePlaneTextures(scene, g) {
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

  // Soft shadow (ellipse) for planes
  if (!scene.textures.exists('pf_shadow')) {
    g.clear();
    g.fillStyle(0x000000, 0.28);
    g.fillEllipse(24, 14, 40, 16);
    g.fillStyle(0x000000, 0.14);
    g.fillEllipse(24, 14, 46, 20);
    g.generateTexture('pf_shadow', 48, 28);
  }
}
