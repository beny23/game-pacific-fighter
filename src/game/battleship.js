import { TUNING } from './constants.js';

export function createBattleshipSystem(scene, { oceanLineY }) {
  const state = {
    sprite: null,
    wake: null,
    hp: 0,
    maxHp: 0,
    active: false,
    nextSpawnAt: 0,
    nextFireAt: 0,
    fireEveryMs: 820,
    fireChance: 0.85,
    // turret offsets relative to sprite center
    turrets: [
      { x: -70, y: -18 },
      { x: -10, y: -20 },
      { x: 55, y: -18 }
    ]
  };

  function isActive() {
    return !!state.sprite && state.active;
  }

  function spawn({ width, timeNow }) {
    destroy();

    state.wake = scene.add.image(width + 210, oceanLineY + 12, 'pf_ship_wake_big');
    state.wake.setDepth(-3);
    state.wake.setAlpha(0.65);
    state.wake.setScale(0.85, 0.75);

    state.sprite = scene.add.image(width + 220, oceanLineY - 6, 'pf_battleship');
    state.sprite.setDepth(-2);
    state.sprite.setAlpha(0.98);
    state.sprite.setDisplaySize(260, 56);

    // Static body so bombs can collide; plane can fly over so we don't add a player collider.
    scene.physics.add.existing(state.sprite, true);

    // Tuned so it takes multiple bombs to sink.
    state.maxHp = TUNING.BATTLESHIP.HP;
    state.hp = state.maxHp;
    state.active = true;

    state.nextFireAt = timeNow + 600;
  }

  function destroy() {
    state.active = false;
    if (state.wake) {
      state.wake.destroy();
      state.wake = null;
    }
    if (state.sprite) {
      state.sprite.destroy();
      state.sprite = null;
    }
  }

  function update(time, dt, { segment, difficulty = 0, worldSpeed, width, player, enemyBullets, spawnFlak }) {
    // Only show in ocean segment.
    if (segment !== 'OCEAN') {
      if (state.sprite) destroy();
      state.nextSpawnAt = 0;
      return;
    }

    if (!state.nextSpawnAt) state.nextSpawnAt = time + 2400;

    if (!state.sprite && time >= state.nextSpawnAt) {
      state.nextSpawnAt = time + 12000 + Math.random() * 9000;
      spawn({ width, timeNow: time });
    }

    if (!state.sprite) return;

    // If something destroyed the sprite (e.g., overlap callback), bail safely.
    if (!state.sprite.active) {
      destroy();
      return;
    }

    // Scroll with the world.
    state.sprite.x -= worldSpeed * dt;
    if (state.wake) {
      state.wake.x = state.sprite.x + 36;
      state.wake.y = state.sprite.y + 20;
      state.wake.alpha = 0.55 + 0.12 * Math.sin(time * 0.004);
    }
    // Static bodies need a refresh when their GameObject moves.
    if (state.sprite.body?.updateFromGameObject) state.sprite.body.updateFromGameObject();
    else if (state.sprite.body?.refreshBody) state.sprite.body.refreshBody();

    // Despawn after passing offscreen.
    if (state.sprite.x < -240) {
      destroy();
      return;
    }

    // Fire flak from turrets.
    if (time >= state.nextFireAt) {
      state.nextFireAt = time + state.fireEveryMs;
      if (Math.random() <= state.fireChance) {
        const t = state.turrets[Math.floor(Math.random() * state.turrets.length)];
        const x = state.sprite.x + t.x;
        const y = state.sprite.y + t.y;
        spawnFlak?.(x, y, { difficulty, worldSpeed, player, enemyBullets });
      }
    }

    // Light smoke when damaged.
    const hpPct = state.maxHp > 0 ? state.hp / state.maxHp : 1;
    const smokeChance = hpPct < 0.2 ? 0.16 : hpPct < 0.5 ? 0.08 : 0;
    if (smokeChance > 0 && Math.random() < smokeChance) {
      const smoke = scene.add.image(state.sprite.x + (Math.random() - 0.5) * 120, state.sprite.y - 18, 'pf_smoke');
      smoke.setDepth(state.sprite.depth + 1);
      smoke.setAlpha(hpPct < 0.2 ? 0.28 : 0.20);
      smoke.setScale((hpPct < 0.2 ? 0.65 : 0.52) + Math.random() * 0.42);
      smoke.setTint(0x062033);
      scene.tweens.add({
        targets: smoke,
        y: smoke.y - 30,
        alpha: 0,
        scale: smoke.scaleX * 1.6,
        duration: 900,
        ease: 'Quad.easeOut',
        onComplete: () => smoke.destroy()
      });
    }
  }

  function damage(amount) {
    if (!state.sprite) return false;
    state.hp -= amount;
    if (state.hp <= 0) {
      destroy();
      return true;
    }
    return false;
  }

  return {
    get sprite() {
      return state.sprite;
    },
    isActive,
    update,
    damage,
    destroy
  };
}
