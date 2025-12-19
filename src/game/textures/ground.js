export function ensureGroundTextures(scene, g) {
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
}
