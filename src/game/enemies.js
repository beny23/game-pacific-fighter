export function createEnemies(scene) {
  const enemies = scene.physics.add.group({ allowGravity: false });

  function destroyEnemy(enemy) {
    if (!enemy) return;
    if (enemy._prop) {
      enemy._prop.destroy();
      enemy._prop = null;
    }
    if (enemy._shadow) {
      enemy._shadow.destroy();
      enemy._shadow = null;
    }
    enemy.destroy();
  }

  function spawnFighter({ difficulty, width, height, timeNow }) {
    const y = 60 + Math.random() * (height - 180);
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

      const drift = Math.sin((time + e.y * 10) / 380) * 22;
      e.body.setVelocityY(drift);

      // Light bank + prop follow/spin.
      e.setRotation(Phaser.Math.Clamp(e.body.velocity.y / 560, -0.16, 0.16));
      if (e._prop) {
        const w = (e.displayWidth || e.width) || 1;
        const dir = e.flipX ? -1 : 1;
        e._prop.x = e.x + dir * w * 0.43;
        e._prop.y = e.y;
        e._prop.rotation = time * 0.05;
      }

      if (e._shadow) {
        const groundY = scene.scale.height - 16;
        const h = Phaser.Math.Clamp((groundY - e.y) / 280, 0, 1);
        e._shadow.x = e.x - 6;
        e._shadow.y = groundY;
        e._shadow.setAlpha(Phaser.Math.Clamp(0.36 - h * 0.36, 0, 0.36));
        e._shadow.setScale(0.9 - h * 0.28);
      }

      // Engine smoke.
      if (time >= (e._nextSmokeAt || 0)) {
        e._nextSmokeAt = time + 95 + Math.random() * 90;
        const w = (e.displayWidth || e.width) || 1;
        const smoke = scene.add.image(e.x + w * 0.45, e.y + 2, 'pf_smoke');
        smoke.setDepth(e.depth - 1);
        smoke.setAlpha(0.12);
        smoke.setScale(0.28 + Math.random() * 0.18);
        scene.tweens.add({
          targets: smoke,
          x: smoke.x + 22,
          y: smoke.y + (Math.random() - 0.5) * 10,
          alpha: 0,
          scale: smoke.scaleX * 1.65,
          duration: 520,
          onComplete: () => smoke.destroy()
        });
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
    spawnFlak,
    updateEnemies,
    damageEnemy
  };
}
