import Phaser from 'phaser';
import { TUNING } from './constants.js';
import { clamp } from './utils.js';

export class PlayerSystem {
  constructor(scene, { oceanLineY }) {
    this.scene = scene;
    this.oceanLineY = oceanLineY;

    this.sprite = null;
    this.prop = null;
    this.shadow = null;

    this._nextSmokeAt = 0;

    this.state = {
      health: 100,
      maxHealth: 100,
      bombs: 10,
      cannonCooldownMs: TUNING.WEAPONS.CANNON_COOLDOWN_MS,
      lastCannonAt: 0,
      bombCooldownMs: TUNING.WEAPONS.BOMB_COOLDOWN_MS,
      lastBombAt: 0,
      dead: false,
      landing: false
    };

    this.cursors = null;
    this.keys = null;
  }

  create() {
    const { width, height } = this.scene.scale;
    this.sprite = this.scene.physics.add.sprite(
      TUNING.PLAYER.START_X,
      height * TUNING.PLAYER.START_Y_FACTOR,
      'pf_plane'
    );
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setDepth(5);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setImmovable(false);
    this.sprite.body.setCollideWorldBounds(true);

    // Visual-only shadow (helps depth perception).
    this.shadow = this.scene.add.image(this.sprite.x, this.oceanLineY, 'pf_shadow');
    this.shadow.setDepth(this.sprite.depth - 3);
    this.shadow.setAlpha(0.0);
    this.shadow.setScale(0.85);

    // Visual-only propeller sprite (no physics). Keeps the body simple and reliable.
    this.prop = this.scene.add.image(this.sprite.x, this.sprite.y, 'pf_prop');
    this.prop.setDepth(this.sprite.depth + 1);
    this.prop.setAlpha(0.75);
    this.prop.setScale(0.65);

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = this.scene.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      b: Phaser.Input.Keyboard.KeyCodes.B
    });

    return this.sprite;
  }

  update(time, dt, {
    segment,
    landingZone,
    canLand,
    onLand,
    onFireCannon,
    onDropBomb,
    onWaterDamage
  }) {
    if (this.state.dead) return;

    const body = this.sprite?.body;
    if (!body) return;

    const up = this.cursors.up.isDown || this.keys.w.isDown;
    const down = this.cursors.down.isDown || this.keys.s.isDown;
    const left = this.cursors.left.isDown || this.keys.a.isDown;
    const right = this.cursors.right.isDown || this.keys.d.isDown;

    const vy = (up ? -1 : 0) + (down ? 1 : 0);
    const vx = (left ? -1 : 0) + (right ? 1 : 0);

    const targetX = TUNING.PLAYER.START_X + vx * TUNING.PLAYER.X_NUDGE;
    this.sprite.x = Phaser.Math.Linear(this.sprite.x, targetX, TUNING.PLAYER.X_SMOOTH * dt);

    this.sprite.setVelocityY(vy * TUNING.PLAYER.Y_SPEED);

    // Subtle bank animation based on vertical velocity.
    this.sprite.setRotation(Phaser.Math.Clamp(body.velocity.y / 520, -0.22, 0.22));

    // Propeller spin + follow.
    if (this.prop) {
      const ox = (this.sprite.displayWidth || this.sprite.width) * 0.43;
      this.prop.x = this.sprite.x + ox;
      this.prop.y = this.sprite.y;
      this.prop.rotation = time * 0.045;
    }

    // Shadow follow (stronger when low).
    if (this.shadow) {
      const h = Phaser.Math.Clamp((this.oceanLineY - this.sprite.y) / 260, 0, 1);
      const alpha = Phaser.Math.Clamp(0.42 - h * 0.42, 0, 0.42);
      this.shadow.x = this.sprite.x + 10;
      this.shadow.y = this.oceanLineY + 10;
      this.shadow.setAlpha(this.state.landing ? 0.32 : alpha);
      this.shadow.setScale(0.9 - h * 0.25);
    }

    // Light engine smoke trail (purely visual).
    if (time >= this._nextSmokeAt && !this.state.landing) {
      const hpPct = this.state.maxHealth > 0 ? (this.state.health / this.state.maxHealth) : 1;
      const damaged = hpPct < 0.35;
      this._nextSmokeAt = time + (damaged ? 45 : 70);

      const w = (this.sprite.displayWidth || this.sprite.width) || 1;
      const smoke = this.scene.add.image(this.sprite.x - w * 0.45, this.sprite.y + 2, 'pf_smoke');
      smoke.setDepth(this.sprite.depth - 1);
      smoke.setAlpha(damaged ? 0.32 : 0.18);
      smoke.setScale((damaged ? 0.46 : 0.35) + Math.random() * 0.22);
      if (damaged) smoke.setTint(0x062033);
      this.scene.tweens.add({
        targets: smoke,
        x: smoke.x - 30,
        y: smoke.y + (Math.random() - 0.5) * 12,
        alpha: 0,
        scale: smoke.scaleX * 1.6,
        duration: 520,
        onComplete: () => smoke.destroy()
      });
    }

    if (this.sprite.y > this.oceanLineY) {
      this.sprite.y = this.oceanLineY;
      this.sprite.setVelocityY(Math.min(0, body.velocity.y));
      onWaterDamage?.(8 * dt);
    }

    if (this.keys.space.isDown) {
      onFireCannon?.(time);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.b)) {
      onDropBomb?.(time);
    }

    if (canLand && landingZone && !this.state.landing) {
      // Use Arcade overlap against the landing zone body (more reliable than bounds checks,
      // especially once carrier collisions are enabled).
      const overlapping = typeof this.scene.physics.overlap === 'function'
        ? this.scene.physics.overlap(this.sprite, landingZone)
        : false;

      // Ease-of-use: no special button; just settle onto the deck zone.
      if (overlapping && Math.abs(body.velocity.y) < 70) {
        onLand?.();
      }
    }

    this.sprite.y = clamp(this.sprite.y, TUNING.PLAYER.MIN_Y, this.scene.scale.height - TUNING.PLAYER.MIN_Y);
  }

  damage(amount) {
    if (this.state.dead) return;

    this.state.health -= amount;
    this.state.health = Math.max(0, this.state.health);

    this.sprite.setTintFill(0xffffff);
    this.scene.time.delayedCall(50, () => {
      if (!this.state.dead) this.sprite.clearTint();
    });

    if (this.state.health <= 0) {
      this.state.dead = true;
      if (this.prop) {
        this.prop.destroy();
        this.prop = null;
      }
      if (this.shadow) {
        this.shadow.destroy();
        this.shadow = null;
      }
    }
  }

  repairAndReload() {
    this.state.health = this.state.maxHealth;
    this.state.bombs = 10;
  }
}
