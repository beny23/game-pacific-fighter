export function createEnvironment(scene, { oceanLineY }) {
  const W = scene.scale.width;
  const H = scene.scale.height;

  const sky = scene.add.tileSprite(W / 2, H / 2, W, H, 'pf_sky');
  sky.setDepth(-20);
  sky.setAlpha(1);

  // Two-layer scrolling ocean for depth.
  const oceanBase = scene.add.rectangle(W / 2, oceanLineY + 28, W, 120, 0x0b4d7a);
  oceanBase.setAlpha(0.95);
  oceanBase.setDepth(-11);

  const oceanBack = scene.add.tileSprite(W / 2, oceanLineY + 22, W, 86, 'pf_ocean_tile');
  oceanBack.setAlpha(0.95);
  oceanBack.setDepth(-10);

  const oceanFront = scene.add.tileSprite(W / 2, oceanLineY + 26, W, 92, 'pf_ocean_tile');
  oceanFront.setAlpha(0.78);
  oceanFront.setDepth(-9);

  const oceanCrest = scene.add.tileSprite(W / 2, oceanLineY + 18, W, 64, 'pf_wave_crest');
  oceanCrest.setAlpha(0.25);
  oceanCrest.setDepth(-9);

  const oceanFoam = scene.add.tileSprite(W / 2, oceanLineY + 34, W, 56, 'pf_wave_crest');
  oceanFoam.setAlpha(0.12);
  oceanFoam.setDepth(-9);

  const whitecaps = [];
  let nextWhitecapAt = 0;

  const horizon = scene.add.rectangle(W / 2, H * 0.3, W, 4, 0x0a4d68);
  horizon.setDepth(-8);

  const haze = scene.add.rectangle(W / 2, H * 0.32, W, 70, 0xe7f9ff);
  haze.setAlpha(0.05);
  haze.setDepth(-8);

  const clouds = [];

  // Simple vignette using layered edge bands (no shader).
  const vignette = scene.add.graphics();
  vignette.setDepth(95);
  vignette.setScrollFactor(0);
  for (let i = 0; i < 8; i += 1) {
    const a = 0.012 + i * 0.008;
    const t = 10;
    vignette.fillStyle(0x000000, a);
    vignette.fillRect(0, i * t, W, t); // top
    vignette.fillRect(0, H - (i + 1) * t, W, t); // bottom
    vignette.fillRect(i * t, 0, t, H); // left
    vignette.fillRect(W - (i + 1) * t, 0, t, H); // right
  }

  // Film grain overlay (very subtle). TileSprite so it stays cheap.
  const grain = scene.add.tileSprite(W / 2, H / 2, W, H, 'pf_grain');
  grain.setDepth(96);
  grain.setScrollFactor(0);
  grain.setAlpha(0.08);

  function update(dt, { worldSpeed }) {
    // Scroll water.
    sky.tilePositionX += worldSpeed * dt * 0.08;
    oceanBack.tilePositionX += worldSpeed * dt * 0.9;
    oceanFront.tilePositionX += worldSpeed * dt * 1.25;

    oceanCrest.tilePositionX += worldSpeed * dt * 1.6;
    oceanCrest.tilePositionY = Math.sin(scene.time.now / 380) * 2;
    oceanCrest.setAlpha(0.18 + (Math.sin(scene.time.now / 520) * 0.05));

    oceanFoam.tilePositionX += worldSpeed * dt * 2.05;
    oceanFoam.tilePositionY = Math.sin(scene.time.now / 310) * 2.5;
    oceanFoam.setAlpha(0.10 + (Math.sin(scene.time.now / 610) * 0.04));

    // Slight drift to avoid visible tiling.
    grain.tilePositionX += dt * 6;
    grain.tilePositionY += dt * 3;
    grain.rotation = Math.sin(scene.time.now / 2200) * 0.002;

    // Occasional small whitecaps to sell motion.
    if (scene.time.now >= nextWhitecapAt) {
      nextWhitecapAt = scene.time.now + 180 + Math.random() * 240;
      if (whitecaps.length < 18) {
        const cap = scene.add.image(W + 40, oceanLineY + 14 + Math.random() * 30, 'pf_ripple');
        cap.setDepth(-8);
        cap.setAlpha(0.10 + Math.random() * 0.08);
        cap.setScale(0.18 + Math.random() * 0.18);
        cap.speed = 40 + Math.random() * 90;
        whitecaps.push(cap);
      }
    }

    for (const cap of whitecaps) {
      cap.x -= (worldSpeed * 1.25 + cap.speed) * dt;
      cap.rotation += dt * 0.25;
    }

    for (let i = whitecaps.length - 1; i >= 0; i -= 1) {
      const cap = whitecaps[i];
      if (cap.x < -80) {
        cap.destroy();
        whitecaps.splice(i, 1);
      }
    }

    // Spawn textured clouds.
    if (clouds.length < 10 && Math.random() < 0.06) {
      const y = 54 + Math.random() * (H * 0.46);
      const cloud = scene.add.image(W + 60, y, 'pf_cloud');
      cloud.setAlpha(0.18 + Math.random() * 0.12);
      cloud.setScale(0.8 + Math.random() * 1.25);
      cloud.speed = 30 + Math.random() * 80;
      cloud.parallax = 0.25 + Math.random() * 0.25;
      cloud.setDepth(-7);
      clouds.push(cloud);
    }

    for (const cloud of clouds) cloud.x -= (worldSpeed * cloud.parallax + cloud.speed) * dt;

    for (let i = clouds.length - 1; i >= 0; i -= 1) {
      const c = clouds[i];
      if (c.x < -200) {
        c.destroy();
        clouds.splice(i, 1);
      }
    }
  }

  return { sky, oceanBase, oceanBack, oceanFront, oceanCrest, oceanFoam, horizon, haze, vignette, grain, update };
}
