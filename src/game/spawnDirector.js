import { SEGMENT, TUNING } from './constants.js';

export class SpawnDirector {
  constructor() {
    this.nextFighterAt = 0;
  }

  update(time, {
    segment,
    difficulty,
    worldSpeed,
    width,
    height,
    enemies,
    groundTargets,
    player,
    enemyBullets,
    spawnFighter,
    spawnFlak
  }) {
    // Easier pacing: fewer fighters, slower ramp.
    const baseEvery = 2200;
    const every = Math.max(1100, baseEvery - difficulty * 90);

    if (!this.nextFighterAt) this.nextFighterAt = time + 900;

    if (time >= this.nextFighterAt && segment !== SEGMENT.LAUNCH) {
      this.nextFighterAt = time + every;
      spawnFighter({ difficulty, width, height, timeNow: time });
    }

    groundTargets.children.iterate((t) => {
      if (!t) return;
      if (!t.isTurret) return;
      if (typeof t.fireEveryMs !== 'number') return;

      if (!t.nextFireAt) t.nextFireAt = time + 350 + Math.random() * 450;
      if (time < t.nextFireAt) return;
      t.nextFireAt = time + t.fireEveryMs;

      if (typeof t.fireChance === 'number' && Math.random() > t.fireChance) return;

      const w = t.displayWidth ?? t.width ?? 0;
      const h = t.displayHeight ?? t.height ?? 0;

      // Spawn from an approximate barrel position (slightly forward and up).
      const spawnX = t.x + w * 0.35;
      const spawnY = t.y - h * 0.25;

      spawnFlak(spawnX, spawnY, { difficulty, worldSpeed, player, enemyBullets });

      // Tiny recoil for visual punch.
      t.setScale(1);
      t.scene.tweens.add({
        targets: t,
        scaleX: 0.96,
        scaleY: 1.03,
        duration: 70,
        yoyo: true
      });
    });
  }
}
