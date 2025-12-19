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
    const everyBase = Math.max(1100, baseEvery - difficulty * 90);

    if (!this.nextFighterAt) this.nextFighterAt = time + 900;

    // Detect bomber presence so we can keep spawns readable.
    let bomberY = null;
    let bomberCount = 0;
    enemies?.children?.iterate?.((e) => {
      if (!e?.isBomber) return;
      bomberCount += 1;
      if (bomberY == null) bomberY = e.y;
    });

    const fighterEvery = bomberCount > 0 ? Math.floor(everyBase * 1.25) : everyBase;

    if (time >= this.nextFighterAt && segment !== SEGMENT.LAUNCH) {
      this.nextFighterAt = time + fighterEvery;

      let y = undefined;
      if (bomberY != null) {
        // Try to spawn fighters away from bomber altitude.
        const minY = 60;
        const maxY = Math.max(minY + 20, height - 120);
        const gap = 120;
        const topBandMax = Math.max(minY, bomberY - gap);
        const botBandMin = Math.min(maxY, bomberY + gap);

        const topSpace = Math.max(0, topBandMax - minY);
        const botSpace = Math.max(0, maxY - botBandMin);

        if (topSpace + botSpace > 0) {
          const pickTop = Math.random() < (topSpace / (topSpace + botSpace));
          if (pickTop && topSpace > 0) y = minY + Math.random() * topSpace;
          else if (botSpace > 0) y = botBandMin + Math.random() * botSpace;
        }
      }

      spawnFighter({ difficulty, width, height, timeNow: time, y });
    }

    // Bombers: same direction as the player (visually face right) but slower,
    // so they drift left as the player overtakes them.
    const allowBombers = segment === SEGMENT.OCEAN || segment === SEGMENT.CARRIER_RETURN;
    if (allowBombers && typeof spawnBomber === 'function') {
      const bomberBaseEvery = 9800;
      const bomberEvery = Math.max(5200, bomberBaseEvery - difficulty * 240);

      if (!this.nextBomberAt) this.nextBomberAt = time + 4200;

      if (time >= this.nextBomberAt) {
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
