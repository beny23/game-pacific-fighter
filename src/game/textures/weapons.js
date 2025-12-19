export function ensureWeaponTextures(scene, g) {
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
}
