import Phaser from 'phaser';

export function createEnemies(scene) {
  const enemies = scene.physics.add.group({ allowGravity: false });

  function destroyEnemy(enemy) {
    if (!enemy) return;
    if (enemy._prop) {
      enemy._prop.destroy();
      enemy._prop = null;
    }
    if (Array.isArray(enemy._props)) {
      for (const p of enemy._props) p?.destroy?.();
      enemy._props = null;
    }
    if (enemy._shadow) {
      enemy._shadow.destroy();
      enemy._shadow = null;
    }
    enemy.destroy();
  }

  function spawnFighter({ difficulty, width, height, timeNow, y: yOverride }) {
    const y = typeof yOverride === 'number' ? yOverride : 60 + Math.random() * (height - 180);
    const enemy = enemies.create(width + 50, y, 'pf_fighter');
    // Match player plane size (player uses pf_plane at ~1.0 scale).
    enemy.setScale(1.05);
    enemy.body.setAllowGravity(false);
    enemy.setVelocityX(-(200 + difficulty * 7));

    // Fighters enter from the right, moving left.
    enemy.setFlipX(true);
    enemy.setDepth(4);

    // Visual-only shadow.
    const shadow = scene.add.image(enemy.x, scene.scale.height - 10, 'pf_shadow');
    shadow.setDepth(enemy.depth - 3);
    shadow.setAlpha(0.0);
    shadow.setScale(0.85);
    enemy._shadow = shadow;

    // Visual-only propeller sprite.
    const prop = scene.add.image(enemy.x, enemy.y, 'pf_prop');
    prop.setAlpha(0.7);
    prop.setScale(0.65);
    prop.setDepth(enemy.depth + 1);
    enemy._prop = prop;

    enemy._nextSmokeAt = timeNow + 90 + Math.random() * 120;

    enemy.hp = 28 + difficulty * 4;
    enemy.nextShotAt = timeNow + 500 + Math.random() * 600;
    enemy.shotEveryMs = Math.max(900, 1400 - difficulty * 40);

    // Occasional ace fighter for variety.
    const aceChance = Math.min(0.22, 0.10 + difficulty * 0.01);
    enemy.isAce = Math.random() < aceChance;
    if (enemy.isAce) {
      enemy.hp += 18;
      enemy.shotEveryMs = Math.max(720, enemy.shotEveryMs - 140);
      enemy.setTint(0xe7f9ff);
    }

  }

  function spawnBomber({ difficulty, width, height, timeNow }) {
    // Bombers fly the same direction as the player (facing right), but slower.
    // Relative to the player, they drift left (you overtake them).
    const y = 80 + Math.random() * (height - 240);
    const bomber = enemies.create(width + 120, y, 'pf_bomber');
    bomber.setScale(0.92);
    bomber.body.setAllowGravity(false);

    // Slow left drift.
    bomber.setVelocityX(-(70 + difficulty * 2));
    bomber.setFlipX(false);
    bomber.setDepth(3);

    // Visual-only shadow.
    const shadow = scene.add.image(bomber.x, scene.scale.height - 10, 'pf_shadow');
    shadow.setDepth(bomber.depth - 3);
    shadow.setAlpha(0.0);
    shadow.setScale(1.15);
    bomber._shadow = shadow;

    // Two propeller sprites (visual only).
    const p1 = scene.add.image(bomber.x, bomber.y, 'pf_prop');
    const p2 = scene.add.image(bomber.x, bomber.y, 'pf_prop');
    for (const p of [p1, p2]) {
      p.setAlpha(0.65);
      p.setScale(0.72);
      p.setDepth(bomber.depth + 1);
    }
    bomber._props = [p1, p2];

    bomber._nextSmokeAt = timeNow + 120 + Math.random() * 160;

    bomber.hp = 90 + difficulty * 8;
    // Occasional defensive tail gun.
    bomber.nextShotAt = timeNow + 900 + Math.random() * 900;
    bomber.shotEveryMs = Math.max(1400, 2200 - difficulty * 55);
    bomber.isBomber = true;
  }

  function damageEnemy(enemy, amount, { onKilled }) {
    enemy.hp -= amount;
    if (enemy.hp <= 0) {
      onKilled?.(enemy);
      destroyEnemy(enemy);
    }
  }

  function updateEnemies(time, { difficulty, player, enemyBullets }) {
    enemies.children.iterate((e) => {
      if (!e) return;

      const drift = e.isBomber ? Math.sin((time + e.y * 6) / 520) * 12 : Math.sin((time + e.y * 10) / 380) * 22;
      e.body.setVelocityY(drift);

      // Light bank + prop follow/spin.
      const bank = e.isBomber ? 0.09 : 0.16;
      e.setRotation(Phaser.Math.Clamp(e.body.velocity.y / 560, -bank, bank));
      if (e._prop) {
        const w = (e.displayWidth || e.width) || 1;
        const dir = e.flipX ? -1 : 1;
        e._prop.x = e.x + dir * w * 0.43;
        e._prop.y = e.y;
        e._prop.rotation = time * 0.05;
      }
      if (Array.isArray(e._props)) {
        const w = (e.displayWidth || e.width) || 1;
        // Engine nacelles are forward on the wing; keep both props near the nose-side.
        e._props[0].x = e.x + w * 0.10;
        e._props[0].y = e.y + 3;
        e._props[1].x = e.x + w * 0.24;
        e._props[1].y = e.y + 4;
        e._props[0].rotation = time * 0.05;
        e._props[1].rotation = time * 0.05;
      }

      if (e._shadow) {
        const groundY = scene.scale.height - 16;
        const h = Phaser.Math.Clamp((groundY - e.y) / 280, 0, 1);
        e._shadow.x = e.x - (e.isBomber ? 10 : 6);
        e._shadow.y = groundY;
        const maxA = e.isBomber ? 0.30 : 0.36;
        e._shadow.setAlpha(Phaser.Math.Clamp(maxA - h * maxA, 0, maxA));
        e._shadow.setScale((e.isBomber ? 1.15 : 0.9) - h * (e.isBomber ? 0.34 : 0.28));
      }

      // Engine smoke.
      if (time >= (e._nextSmokeAt || 0)) {
        e._nextSmokeAt = time + 95 + Math.random() * 90;
        const w = (e.displayWidth || e.width) || 1;
        // Emit smoke behind the plane based on facing direction.
        // Fighters are flipped (face left), bombers face right.
        const behindDir = e.flipX ? 1 : -1;

        const spawnSmoke = (sx, sy, { alpha = 0.12, drift = 22 } = {}) => {
          const smoke = scene.add.image(sx, sy, 'pf_smoke');
          smoke.setDepth(e.depth - 1);
          smoke.setAlpha(alpha);
          smoke.setScale(0.26 + Math.random() * 0.20);
          scene.tweens.add({
            targets: smoke,
            x: smoke.x + behindDir * drift,
            y: smoke.y + (Math.random() - 0.5) * 10,
            alpha: 0,
            scale: smoke.scaleX * 1.7,
            duration: 560,
            onComplete: () => smoke.destroy()
          });
        };

        if (e.isBomber) {
          // Twin-engine smoke, roughly aligned with the prop/nacelles.
          const baseY = e.y + 3;
          const e1x = e.x + w * 0.10 + behindDir * 6;
          const e2x = e.x + w * 0.24 + behindDir * 6;
          spawnSmoke(e1x, baseY + 1, { alpha: 0.10, drift: 28 });
          spawnSmoke(e2x, baseY + 2, { alpha: 0.10, drift: 28 });
        } else {
          spawnSmoke(e.x + behindDir * w * 0.45, e.y + 2, { alpha: 0.12, drift: 22 });
        }
      }

      if (time >= e.nextShotAt) {
        e.nextShotAt = time + e.shotEveryMs;
        enemyShoot(e, { difficulty, player, enemyBullets });
      }

      if (e.x < -80) destroyEnemy(e);
    });
  }

  function enemyShoot(enemy, { difficulty, player, enemyBullets }) {
    const w = (enemy.displayWidth || enemy.width) || 1;
    const muzzleX = enemy.x - w * 0.48;
    const flash = scene.add.image(muzzleX, enemy.y, 'pf_muzzle');
    flash.setDepth((enemy.depth || 0) + 2);
    flash.setAlpha(0.8);
    flash.setScale(0.35 + Math.random() * 0.2);
    flash.setFlipX(true);
    flash.setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: flash.scaleX * 1.55,
      duration: 90,
      onComplete: () => flash.destroy()
    });

    const bullet = enemyBullets.create(enemy.x - w * 0.42, enemy.y, 'pf_enemy_bullet');
    bullet.body.setAllowGravity(false);
    const speed = 300 + difficulty * 6;

    // Slightly stronger tracer for bomber defensive fire.
    bullet._tracerStrong = !!enemy?.isBomber;

    // Straight shot (classic arcade feel): always fire left.
    bullet.setVelocity(-speed, 0);
    bullet.setRotation(0);
    bullet.setBlendMode(Phaser.BlendModes.ADD);
  }

  function spawnFlak(x, y, { difficulty, worldSpeed = 0, player, enemyBullets }) {
    const bullet = enemyBullets.create(x, y, 'pf_flak');
    bullet.body.setAllowGravity(false);

    bullet.setScale(0.85);

    const targetX = player.x;
    const targetY = player.y;
    const baseAngle = Math.atan2(targetY - y, targetX - x);
    const angleJitter = (Math.random() - 0.5) * 0.55;
    const angle = baseAngle + angleJitter;
    const speed = 180 + difficulty * 4;

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    // Inherit the island/turret scroll so flak doesn't look detached.
    bullet.setVelocity(vx - worldSpeed * 0.9, vy);
  }

  return {
    enemies,
    spawnFighter,
    spawnBomber,
    spawnFlak,
    updateEnemies,
    damageEnemy
  };
}
