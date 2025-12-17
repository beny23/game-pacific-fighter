import Phaser from 'phaser';

import { SEGMENT, TUNING } from '../game/constants.js';
import { ensureTextures } from '../game/textures.js';
import { createHud } from '../game/hud.js';
import { createEnvironment } from '../game/environment.js';
import { getOrCreateGroundProxy, setGroundProxyY } from '../game/groundProxy.js';
import { SegmentSystem } from '../game/segments.js';
import { PlayerSystem } from '../game/player.js';
import { createWeapons } from '../game/weapons.js';
import { createEnemies } from '../game/enemies.js';
import { SpawnDirector } from '../game/spawnDirector.js';
import { createBattleshipSystem } from '../game/battleship.js';
import { createAudio } from '../game/audio.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;

    ensureTextures(this);

    this.worldSpeed = TUNING.WORLD_SPEED;
    this.score = 0;
    this.bestScore = Number(localStorage.getItem('pf_bestScore') || 0);
    this.gameOverShown = false;

    this.oceanLineY = this.H - 26;
    this.environment = createEnvironment(this, { oceanLineY: this.oceanLineY });

    this.hud = createHud(this);
    this.hud.setHelp('W/S or Up/Down: altitude  |  Space: cannon  |  B: bomb');

    // Static bodies avoid subtle physics drift when we manually scroll set-pieces.
    this.groundTargets = this.physics.add.staticGroup();

    this.groundProxy = getOrCreateGroundProxy(this, {
      width: this.W,
      initialY: this.oceanLineY + 8
    });

    this.playerSystem = new PlayerSystem(this, { oceanLineY: this.oceanLineY });
    this.player = this.playerSystem.create();

    this.weapons = createWeapons(this);
    this.enemySystem = createEnemies(this);
    this.spawnDirector = new SpawnDirector();
    this.audio = createAudio(this);

    this.segmentSystem = new SegmentSystem(this, {
      player: this.player,
      groundTargets: this.groundTargets,
      oceanLineY: this.oceanLineY,
      setHelp: this.hud.setHelp,
      setGroundProxyY: (y) => setGroundProxyY(this.groundProxy, y)
    });
    this.segmentSystem.init(this.time.now);

    this.battleshipSystem = createBattleshipSystem(this, { oceanLineY: this.oceanLineY });
    this._battleshipBombOverlap = null;
    this._battleshipBulletOverlap = null;

    this._wireCollisions();

    this.input.on('pointerdown', () => {
      if (this.playerSystem.state.dead) this.scene.restart();
    });
  }

  update(time, delta) {
    const dt = delta / 1000;

    if (this.playerSystem.state.dead) {
      if (!this.gameOverShown) this._gameOver();
      return;
    }

    this.segmentSystem.update(time);

    // Gentle endless-mode ramp: every ~5k score increases difficulty by 1.
    const rampDifficulty = Math.floor(this.score / 5000);
    const difficulty = this.segmentSystem.difficulty + rampDifficulty;

    this.environment.update(dt, { worldSpeed: this.worldSpeed });
    this.segmentSystem.updateSetPieces(dt, this.worldSpeed);

    this.battleshipSystem.update(time, dt, {
      segment: this.segmentSystem.segment,
      difficulty,
      worldSpeed: this.worldSpeed,
      width: this.W,
      player: this.player,
      enemyBullets: this.weapons.enemyBullets,
      spawnFlak: (x, y, ctx) => this.enemySystem.spawnFlak(x, y, ctx)
    });

    // Late-bind overlaps because the battleship spawns/despawns dynamically.
    if (this.battleshipSystem.sprite && !this._battleshipBombOverlap) {
      this._battleshipBombOverlap = this.physics.add.overlap(
        this.weapons.bombs,
        this.battleshipSystem.sprite,
        (a, b) => {
          const ship = a?.texture?.key === 'pf_battleship' ? a : b;
          const projectile = ship === a ? b : a;
          this._onBattleshipHit(projectile, ship, { isBomb: true });
        }
      );
    }
    if (!this.battleshipSystem.sprite && this._battleshipBombOverlap) {
      this._battleshipBombOverlap.destroy();
      this._battleshipBombOverlap = null;
    }

    if (this.battleshipSystem.sprite && !this._battleshipBulletOverlap) {
      this._battleshipBulletOverlap = this.physics.add.overlap(
        this.weapons.playerBullets,
        this.battleshipSystem.sprite,
        (a, b) => {
          const ship = a?.texture?.key === 'pf_battleship' ? a : b;
          const projectile = ship === a ? b : a;
          this._onBattleshipHit(projectile, ship, { isBomb: false });
        }
      );
    }
    if (!this.battleshipSystem.sprite && this._battleshipBulletOverlap) {
      this._battleshipBulletOverlap.destroy();
      this._battleshipBulletOverlap = null;
    }

    // Score slowly increases with distance.
    this.score += Math.floor(this.worldSpeed * dt * 0.12);

    this.playerSystem.update(time, dt, {
      segment: this.segmentSystem.segment,
      landingZone: this.segmentSystem.getLandingZone(),
      canLand: this.segmentSystem.segment === SEGMENT.CARRIER_RETURN,
      onLand: () => this._landAndRepair(),
      onFireCannon: (t) => {
        const fired = this.weapons.tryFireCannon(t, { player: this.player, playerState: this.playerSystem.state });
        if (fired) this.audio?.playGun?.();
      },
      onDropBomb: (t) => {
        const dropped = this.weapons.tryDropBomb(t, { player: this.player, playerState: this.playerSystem.state });
        if (dropped) this.audio?.playBombDrop?.();
      },
      onWaterDamage: (amt) => this.playerSystem.damage(amt)
    });

    // Engine loop follows vertical movement and damage.
    this.audio?.updateEngine?.({
      vy: this.player?.body?.velocity?.y ?? 0,
      landing: !!this.playerSystem.state.landing,
      hpPct: this.playerSystem.state.maxHealth > 0 ? this.playerSystem.state.health / this.playerSystem.state.maxHealth : 1
    });

    this.spawnDirector.update(time, {
      segment: this.segmentSystem.segment,
      difficulty,
      worldSpeed: this.worldSpeed,
      width: this.W,
      height: this.H,
      enemies: this.enemySystem.enemies,
      groundTargets: this.groundTargets,
      player: this.player,
      enemyBullets: this.weapons.enemyBullets,
      spawnFighter: (args) => this.enemySystem.spawnFighter(args),
      spawnFlak: (x, y, ctx) => this.enemySystem.spawnFlak(x, y, ctx)
    });

    this.enemySystem.updateEnemies(time, {
      difficulty,
      player: this.player,
      enemyBullets: this.weapons.enemyBullets
    });

    this._updateEnemyBulletVfx(time);

    // Ground targets clean
    this.groundTargets.children.iterate((t) => {
      if (!t) return;
      if (t.x < -80) t.destroy();
    });

    this.weapons.cleanupProjectiles({
      width: this.W,
      height: this.H,
      onDestroyProjectile: (obj) => {
        // Occasional airburst puff near the screen edges as flak expires.
        if (obj?.texture?.key === 'pf_flak') {
          const nearScreen = obj.x > -40 && obj.x < this.W + 40 && obj.y > -40 && obj.y < this.H + 40;
          if (nearScreen) this._spawnFlakBurst(obj.x, obj.y);
        }
      }
    });

    this.hud.update({
      hp: Math.ceil(this.playerSystem.state.health),
      bombs: this.playerSystem.state.bombs,
      score: this.score,
      bestScore: this.bestScore,
      segment: this.segmentSystem.segment,
      landing: this.playerSystem.state.landing
    });
  }

  _onBattleshipHit(projectile, ship, { isBomb }) {
    if (!this.battleshipSystem.sprite) return;
    if (!ship || ship !== this.battleshipSystem.sprite) return;
    // Arcade overlap callbacks can fire more than once per physics step; make hits idempotent per projectile.
    if (!projectile || !projectile.active) return;
    if (projectile === ship) return;
    if (projectile._pfHitBattleship) return;
    projectile._pfHitBattleship = true;

    if (projectile?.destroy) projectile.destroy();

    // Readable feedback on hit.
    ship.setTintFill(0xffffff);
    this.time.delayedCall(60, () => {
      if (ship?.active) ship.clearTint();
    });

    const x = this.battleshipSystem.sprite.x + (Math.random() - 0.5) * 40;
    const y = this.battleshipSystem.sprite.y - 10 + (Math.random() - 0.5) * 10;

    if (isBomb) {
      this._spawnExplosion(x, y);
      const killed = this.battleshipSystem.damage(TUNING.BATTLESHIP.BOMB_DAMAGE);
      if (killed) {
        this.score += 900;
        this._spawnBigExplosion(x, y);
      }
    } else {
      this._spawnSpark(x, y);
      const killed = this.battleshipSystem.damage(TUNING.BATTLESHIP.BULLET_DAMAGE);
      if (killed) {
        this.score += 900;
        this._spawnBigExplosion(x, y);
      }
    }
  }

  _updateEnemyBulletVfx(time) {
    // Flak trail + occasional mini-bursts along its flight.
    this.weapons.enemyBullets.children.iterate((b) => {
      if (!b || !b.active) return;
      if (b.texture?.key !== 'pf_flak') return;

      if (!b._nextTrailAt) b._nextTrailAt = time + 60;
      if (time < b._nextTrailAt) return;
      b._nextTrailAt = time + 70;

      const puff = this.add.image(b.x, b.y, 'pf_smoke');
      puff.setDepth(1);
      puff.setAlpha(0.12);
      puff.setScale(0.22 + Math.random() * 0.14);
      puff.setTint(0x9b5de5);
      this.tweens.add({
        targets: puff,
        alpha: 0,
        scale: puff.scaleX * 1.7,
        duration: 380,
        onComplete: () => puff.destroy()
      });

      if (Math.random() < 0.18) this._spawnFlakBurst(b.x, b.y);
    });
  }

  _wireCollisions() {
    // Player bullets vs fighters
    this.physics.add.overlap(this.weapons.playerBullets, this.enemySystem.enemies, (bullet, enemy) => {
      bullet.destroy();
      this._spawnSpark(enemy.x, enemy.y);
      this.enemySystem.damageEnemy(enemy, 26, {
        onKilled: () => {
          this._spawnExplosion(enemy.x, enemy.y);
          this.score += 120;
        }
      });
    });

    // Enemy bullets vs player
    this.physics.add.overlap(this.weapons.enemyBullets, this.player, (a, b) => {
      const bullet = a === this.player ? b : a;
      if (bullet && bullet !== this.player) bullet.destroy();
      if (bullet && bullet.texture && bullet.texture.key === 'pf_flak') {
        this._spawnFlakBurst(this.player.x, this.player.y);
      } else {
        this._spawnSpark(this.player.x, this.player.y);
      }
      this.playerSystem.damage(6);
    });

    // Fighter collision vs player
    this.physics.add.overlap(this.enemySystem.enemies, this.player, () => {
      this._spawnSpark(this.player.x, this.player.y);
      this.playerSystem.damage(16);
    });

    // Bombs vs ground
    this.physics.add.collider(this.weapons.bombs, this.groundProxy, (bomb) => {
      const isOceanImpact = !this.segmentSystem.island && bomb.y >= this.oceanLineY - 8;

      if (isOceanImpact) {
        this._spawnWaterSplash(bomb.x, this.oceanLineY);
        bomb.destroy();
        return;
      }

      this.weapons.explodeBomb(bomb.x, bomb.y, {
        enemies: this.enemySystem.enemies,
        groundTargets: this.groundTargets,
        onDamageEnemy: (e, amt) =>
          this.enemySystem.damageEnemy(e, amt, {
            onKilled: () => {
              this.score += 120;
            }
          }),
        onDamageGroundTarget: (t, amt) => this._damageGroundTarget(t, amt)
      });
      bomb.destroy();
    });

    // Bombs vs ground targets
    this.physics.add.overlap(this.weapons.bombs, this.groundTargets, (bomb, target) => {
      this.weapons.explodeBomb(bomb.x, bomb.y, {
        enemies: this.enemySystem.enemies,
        groundTargets: this.groundTargets,
        onDamageEnemy: (e, amt) =>
          this.enemySystem.damageEnemy(e, amt, {
            onKilled: () => {
              this.score += 120;
            }
          }),
        onDamageGroundTarget: (t, amt) => this._damageGroundTarget(t, amt)
      });
      bomb.destroy();
      this._damageGroundTarget(target, 999);
    });

    // Player bullets vs ground targets
    this.physics.add.overlap(this.weapons.playerBullets, this.groundTargets, (bullet, target) => {
      bullet.destroy();
      this._damageGroundTarget(target, 6);
    });
  }

  _spawnSpark(x, y) {
    const s = this.add.image(x, y, 'pf_spark');
    s.setDepth(50);
    s.setAlpha(0.8);
    s.setScale(0.45 + Math.random() * 0.25);
    s.setRotation(Math.random() * Math.PI);
    s.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: s,
      alpha: 0,
      scale: s.scaleX * 1.6,
      duration: 120,
      onComplete: () => s.destroy()
    });
  }

  _spawnFlakBurst(x, y) {
    this.audio?.playFlak?.();
    const p = this.add.image(x, y, 'pf_flak_burst');
    p.setDepth(49);
    p.setAlpha(0.7);
    p.setScale(0.55);
    this.tweens.add({
      targets: p,
      alpha: 0,
      scale: 1.1,
      duration: 220,
      ease: 'Quad.easeOut',
      onComplete: () => p.destroy()
    });
  }

  _spawnExplosion(x, y) {
    this.audio?.playExplosion?.(false);
    this._flash(0.05, 110);
    this.cameras.main.shake(70, 0.002);

    const burn = this.add.image(x, y + 6, 'pf_burn');
    burn.setDepth(-5);
    burn.setAlpha(0.22);
    burn.setScale(0.9 + Math.random() * 0.6);
    burn.setRotation(Math.random() * Math.PI);
    this.tweens.add({
      targets: burn,
      alpha: 0,
      duration: 9000,
      delay: 1200,
      onComplete: () => burn.destroy()
    });

    const puff = this.add.image(x, y, 'pf_explosion');
    puff.setDepth(55);
    puff.setAlpha(0.9);
    puff.setScale(0.7);
    puff.setBlendMode(Phaser.BlendModes.SCREEN);
    this.tweens.add({
      targets: puff,
      alpha: 0,
      scale: 1.3,
      duration: 260,
      ease: 'Quad.easeOut',
      onComplete: () => puff.destroy()
    });
  }

  _flash(alpha = 0.06, duration = 120) {
    const r = this.add.rectangle(this.W / 2, this.H / 2, this.W, this.H, 0xffffff, alpha);
    r.setDepth(120);
    r.setScrollFactor(0);
    this.tweens.add({
      targets: r,
      alpha: 0,
      duration,
      onComplete: () => r.destroy()
    });
  }

  _spawnWaterSplash(x, y) {
    const splash = this.add.image(x, y - 10, 'pf_splash');
    splash.setDepth(-6);
    splash.setAlpha(0.55);
    splash.setScale(0.65);

    const ripple = this.add.image(x, y + 2, 'pf_ripple');
    ripple.setDepth(-6);
    ripple.setAlpha(0.22);
    ripple.setScale(0.55);

    this.tweens.add({
      targets: splash,
      y: splash.y - 18,
      alpha: 0,
      scale: splash.scaleX * 1.15,
      duration: 380,
      ease: 'Quad.easeOut',
      onComplete: () => splash.destroy()
    });

    this.tweens.add({
      targets: ripple,
      alpha: 0,
      scale: 1.35,
      duration: 520,
      ease: 'Quad.easeOut',
      onComplete: () => ripple.destroy()
    });
  }

  _damageGroundTarget(target, amount) {
    // Primary targets are meant to be bombed; cannon damage is greatly reduced.
    const isPrimary = !!target.isPrimary;
    const isTurret = !!target.isTurret;
    const applied = (isPrimary && amount <= 20) ? Math.ceil(amount * 0.25) : amount;

    target.hp -= applied;

    if (typeof target.setFillStyle === 'function') {
      target.setFillStyle(0xffb703);
      this.time.delayedCall(70, () => {
        if (target?.active) target.setFillStyle(0xffd166);
      });
    } else {
      target.setTintFill(0xffffff);
      this.time.delayedCall(70, () => {
        if (target?.active) target.clearTint();
      });
    }

    if (target.hp <= 0) {
      if (isPrimary) {
        this.score += 600;
        this._spawnBigExplosion(target.x, target.y);
      } else if (isTurret) {
        this.score += 180;
        this._spawnExplosion(target.x, target.y);
      } else {
        this.score += 120;
        this._spawnExplosion(target.x, target.y);
      }

      target.destroy();
    }
  }

  _spawnBigExplosion(x, y) {
    this.audio?.playExplosion?.(true);
    this._flash(0.10, 140);
    this.cameras.main.shake(140, 0.006);

    const burn = this.add.image(x, y + 8, 'pf_burn');
    burn.setDepth(-5);
    burn.setAlpha(0.28);
    burn.setScale(2.0);
    burn.setRotation(Math.random() * Math.PI);
    this.tweens.add({
      targets: burn,
      alpha: 0,
      duration: 12000,
      delay: 1600,
      onComplete: () => burn.destroy()
    });

    // Multi-blast, smoky, larger radius feel (visual-only).
    const blasts = [
      { dx: 0, dy: 0, t: 0, s: 1.1 },
      { dx: -18, dy: 6, t: 80, s: 0.9 },
      { dx: 16, dy: -8, t: 140, s: 0.85 }
    ];

    for (const b of blasts) {
      this.time.delayedCall(b.t, () => {
        const puff = this.add.image(x + b.dx, y + b.dy, 'pf_explosion');
        puff.setDepth(60);
        puff.setAlpha(0.95);
        puff.setScale(0.9 * b.s);
        puff.setBlendMode(Phaser.BlendModes.SCREEN);
        this.tweens.add({
          targets: puff,
          alpha: 0,
          scale: 1.8 * b.s,
          duration: 420,
          ease: 'Quad.easeOut',
          onComplete: () => puff.destroy()
        });

        this._spawnFlakBurst(x + b.dx, y + b.dy);

        const smoke = this.add.image(x + b.dx, y + b.dy - 6, 'pf_smoke');
        smoke.setDepth(40);
        smoke.setAlpha(0.28);
        smoke.setScale(0.8);
        smoke.setTint(0x062033);
        this.tweens.add({
          targets: smoke,
          y: smoke.y - 26,
          alpha: 0,
          scale: 1.6,
          duration: 950,
          ease: 'Quad.easeOut',
          onComplete: () => smoke.destroy()
        });
      });
    }
  }

  _landAndRepair() {
    if (this.playerSystem.state.landing) return;

    const landingZone = this.segmentSystem.getLandingZone();
    if (!landingZone) return;

    this.playerSystem.state.landing = true;

    this.player.setVelocity(0, 0);
    this.player.x = landingZone.x;
    this.player.y = landingZone.y - 6;

    this.hud.setHelp('LANDED: repairing + reloading…');

    this.time.delayedCall(900, () => {
      this.playerSystem.repairAndReload();
      this.playerSystem.state.landing = false;

      this.segmentSystem.segment = SEGMENT.LAUNCH;
      this.segmentSystem.segmentEndsAt = this.time.now + TUNING.SEGMENTS.RELAUNCH_MS;
      this.segmentSystem.createCarrierForLaunch();
    });
  }

  _gameOver() {
    this.gameOverShown = true;

    this.bestScore = Math.max(this.bestScore, this.score);
    localStorage.setItem('pf_bestScore', String(this.bestScore));
    this.hud.showGameOver({ score: this.score, bestScore: this.bestScore });

    this.enemySystem.enemies.clear(true, true);
    this.weapons.enemyBullets.clear(true, true);
    this.weapons.playerBullets.clear(true, true);
    this.weapons.bombs.clear(true, true);
  }
}
