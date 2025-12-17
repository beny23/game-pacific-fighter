import { SEGMENT, TUNING } from './constants.js';

export class SpawnDirector {
  constructor() {
    this.nextFighterAt = 0;
    this.nextBomberAt = 0;
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
    spawnBomber,
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

    // Bombers: same direction as the player (visually face right) but slower,
    // so they drift left as the player overtakes them.
    const allowBombers = segment === SEGMENT.OCEAN || segment === SEGMENT.CARRIER_RETURN;
    if (allowBombers && typeof spawnBomber === 'function') {
      const bomberBaseEvery = 9800;
      const bomberEvery = Math.max(5200, bomberBaseEvery - difficulty * 240);

      if (!this.nextBomberAt) this.nextBomberAt = time + 4200;

      if (time >= this.nextBomberAt) {
        let bomberCount = 0;
        enemies?.children?.iterate?.((e) => {
          if (e?.isBomber) bomberCount += 1;
        });

        // Keep bombers as a rare, readable threat.
        if (bomberCount < 1) {
          spawnBomber({ difficulty, width, height, timeNow: time, worldSpeed });
        }

        this.nextBomberAt = time + bomberEvery;
      }
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
