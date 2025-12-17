import Phaser from 'phaser';
import { TUNING } from './constants.js';

export function createWeapons(scene) {
  const playerBullets = scene.physics.add.group({ allowGravity: false });
  const enemyBullets = scene.physics.add.group({ allowGravity: false });
  const bombs = scene.physics.add.group({ allowGravity: true });

  function spawnMuzzleFlash(x, y, { flipX = false } = {}) {
    const flash = scene.add.image(x, y, 'pf_muzzle');
    flash.setDepth(9);
    flash.setAlpha(0.9);
    flash.setScale(0.45 + Math.random() * 0.25);
    flash.setFlipX(flipX);
    flash.setRotation((Math.random() - 0.5) * 0.35);
    flash.setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: flash.scaleX * 1.5,
      duration: 90,
      onComplete: () => flash.destroy()
    });
  }

  function tryFireCannon(time, { player, playerState }) {
    if (time - playerState.lastCannonAt < playerState.cannonCooldownMs) return;
    playerState.lastCannonAt = time;

    spawnMuzzleFlash(player.x + 32, player.y + (Math.random() - 0.5) * 2);

    const bullet = playerBullets.create(player.x + 28, player.y, 'pf_bullet');
    bullet.body.setAllowGravity(false);
    bullet.setVelocityX(TUNING.WEAPONS.BULLET_SPEED_X);
    bullet.setBlendMode(Phaser.BlendModes.ADD);
    bullet.setScale(0.75);
    bullet.damage = 10;
  }

  function tryDropBomb(time, { player, playerState }) {
    if (time - playerState.lastBombAt < playerState.bombCooldownMs) return;
    if (playerState.bombs <= 0) return;

    playerState.lastBombAt = time;
    playerState.bombs -= 1;

    const bomb = bombs.create(player.x + 10, player.y + 10, 'pf_bomb');
    bomb.setScale(0.45);
    bomb.body.setAllowGravity(true);
    bomb.body.setGravityY(TUNING.WEAPONS.BOMB_GRAVITY_Y);
    bomb.setVelocityX(TUNING.WEAPONS.BOMB_VELOCITY_X);
    bomb.damage = 60;
  }

  function explodeBomb(x, y, { enemies, groundTargets, onDamageEnemy, onDamageGroundTarget }) {
    const radius = TUNING.WEAPONS.BOMB_EXPLOSION_RADIUS;

    // Visual-only blast ring + puff.
    const ring = scene.add.circle(x, y, radius, 0xff8c42, 0.12);
    ring.setDepth(10);

    const puff = scene.add.image(x, y, 'pf_explosion');
    puff.setDepth(11);
    puff.setScale(0.6);
    puff.setAlpha(0.95);

    scene.tweens.add({
      targets: ring,
      alpha: 0,
      duration: 240,
      onComplete: () => ring.destroy()
    });

    scene.tweens.add({
      targets: puff,
      alpha: 0,
      scale: 1.15,
      duration: 260,
      ease: 'Quad.easeOut',
      onComplete: () => puff.destroy()
    });

    enemies.children.iterate((e) => {
      if (!e) return;
      const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
      if (d <= radius) onDamageEnemy?.(e, 55);
    });

    groundTargets.children.iterate((t) => {
      if (!t) return;
      const d = Phaser.Math.Distance.Between(x, y, t.x, t.y);
      if (d <= radius) onDamageGroundTarget?.(t, 999);
    });
  }

  function cleanupProjectiles({ width, height, onDestroyProjectile }) {
    const destroyIfOffscreen = (obj) => {
      if (!obj) return;
      if (obj.x < -120 || obj.x > width + 120 || obj.y < -120 || obj.y > height + 120) {
        onDestroyProjectile?.(obj);
        obj.destroy();
      }
    };

    playerBullets.children.iterate(destroyIfOffscreen);
    enemyBullets.children.iterate(destroyIfOffscreen);
    bombs.children.iterate(destroyIfOffscreen);
  }

  return {
    playerBullets,
    enemyBullets,
    bombs,
    tryFireCannon,
    tryDropBomb,
    explodeBomb,
    cleanupProjectiles
  };
}
