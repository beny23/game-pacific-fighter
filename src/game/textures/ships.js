export function ensureShipTextures(scene, g) {
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
}
