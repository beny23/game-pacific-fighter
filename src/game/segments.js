import { SEGMENT, TUNING } from './constants.js';

export class SegmentSystem {
  constructor(scene, { player, groundTargets, oceanLineY, setHelp, setGroundProxyY }) {
    this.scene = scene;
    this.player = player;
    this.groundTargets = groundTargets;
    this.oceanLineY = oceanLineY;
    this.setHelp = setHelp;
    this.setGroundProxyY = setGroundProxyY;

    this.segment = SEGMENT.LAUNCH;
    this.segmentEndsAt = 0;

    this.difficulty = 0;

    this.island = null;
    this.carrier = null; // physics deck body
    this.carrierVisual = null; // ship sprite
    this.landingZone = null;
    this.carrierWake = null;

    this._islandCollider = null;
    this._carrierCollider = null;
  }

  _clearSetPieceColliders() {
    if (this._islandCollider) {
      this._islandCollider.destroy();
      this._islandCollider = null;
    }
    if (this._carrierCollider) {
      this._carrierCollider.destroy();
      this._carrierCollider = null;
    }
  }

  init(time) {
    this.segment = SEGMENT.LAUNCH;
    this.segmentEndsAt = time + TUNING.SEGMENTS.LAUNCH_MS;
    this.createCarrierForLaunch();
  }

  update(time) {
    if (time < this.segmentEndsAt) return;

    if (this.segment === SEGMENT.LAUNCH) {
      this.segment = SEGMENT.OCEAN;
      this.segmentEndsAt = time + TUNING.SEGMENTS.OCEAN_MS;
      this.destroyCarrier();
      this.setHelp('OCEAN: fighters inbound');
      return;
    }

    if (this.segment === SEGMENT.OCEAN) {
      this.segment = SEGMENT.ISLAND;
      this.segmentEndsAt = time + TUNING.SEGMENTS.ISLAND_MS;
      this.createIsland();
      return;
    }

    if (this.segment === SEGMENT.ISLAND) {
      this.segment = SEGMENT.CARRIER_RETURN;
      this.segmentEndsAt = time + TUNING.SEGMENTS.RETURN_MS;
      this.createCarrierReturn();
      this.difficulty += 1;
      return;
    }

    if (this.segment === SEGMENT.CARRIER_RETURN) {
      this.segment = SEGMENT.OCEAN;
      this.segmentEndsAt = time + TUNING.SEGMENTS.OCEAN_MS;
      this.destroyCarrier();
      this.setHelp('OCEAN: fighters inbound');
    }
  }

  updateSetPieces(dt, worldSpeed) {
    if (this.island) {
      this.island.x -= worldSpeed * dt;
      this.island.body.updateFromGameObject();

      this.groundTargets.children.iterate((t) => {
        if (!t) return;
        t.x -= worldSpeed * dt;
        t.body.updateFromGameObject();
      });

      const islandHeight = this.island.displayHeight ?? this.island.height;
      this.setGroundProxyY(this.island.y - islandHeight / 2);
      return;
    }

    if (this.carrier) {
      this.carrier.x -= worldSpeed * dt;
      this.landingZone.x -= worldSpeed * dt;

      if (this.carrierVisual) {
        this.carrierVisual.x -= worldSpeed * dt;
      }

      if (this.carrierWake) {
        this.carrierWake.x -= worldSpeed * dt;
      }

      this.carrier.body.updateFromGameObject();
      this.landingZone.body.updateFromGameObject();

      this.setGroundProxyY(this.carrier.y - 12);
      return;
    }

    this.setGroundProxyY(this.oceanLineY + 8);
  }

  getLandingZone() {
    return this.landingZone;
  }

  createCarrierForLaunch() {
    this.destroyIsland();
    this.destroyCarrier();

    const { width, height } = this.scene.scale;

    const deckW = 320;
    const deckH = 18;
    const deckX = width * 0.35;
    const deckY = this.oceanLineY - 10;

    // Visual ship (taller), independent from physics.
    this.carrierVisual = this.scene.add.image(deckX, deckY + 4, 'pf_carrier');
    this.carrierVisual.setAlpha(0.95);
    this.carrierVisual.setDepth(-2);
    this.carrierVisual.setDisplaySize(deckW + 20, 40);

    // Thin invisible physics deck used for collision/landing.
    this.carrier = this.scene.add.rectangle(deckX, deckY, deckW, deckH, 0x000000, 0);
    this.carrier.setDepth(-1);

    this.carrierWake = this.scene.add.image(deckX - 110, deckY + 22, 'pf_wake');
    this.carrierWake.setAlpha(0.35);
    this.carrierWake.setDepth(-11);
    this.carrierWake.setDisplaySize(260, 34);

    // Landing zone is positioned ABOVE the deck so it overlaps the plane when the plane is resting on the carrier.
    this.landingZone = this.scene.add.rectangle(deckX + 40, deckY - 24, 160, 44, 0x2ae3a7);
    this.landingZone.setAlpha(0.15);
    this.landingZone.setDepth(-1);

    this.scene.physics.add.existing(this.carrier, true);
    this.scene.physics.add.existing(this.landingZone, true);

    // Prevent flying through the carrier.
    this._carrierCollider = this.scene.physics.add.collider(this.player, this.carrier);

    this.setGroundProxyY(this.carrier.y - 12);

    this.player.x = this.carrier.x - 130;
    this.player.y = this.carrier.y - 28;
    this.player.setVelocity(0, 0);

    this.setHelp('LAUNCH: climb and engage targets');
  }

  createCarrierReturn() {
    this.destroyIsland();
    this.destroyCarrier();

    const { width } = this.scene.scale;

    const deckW = 340;
    const deckH = 18;
    const deckX = width + 220;
    const deckY = this.oceanLineY - 10;

    this.carrierVisual = this.scene.add.image(deckX, deckY + 4, 'pf_carrier');
    this.carrierVisual.setAlpha(0.96);
    this.carrierVisual.setDepth(-2);
    this.carrierVisual.setDisplaySize(deckW + 20, 40);

    this.carrier = this.scene.add.rectangle(deckX, deckY, deckW, deckH, 0x000000, 0);
    this.carrier.setDepth(-1);

    this.carrierWake = this.scene.add.image(deckX - 120, deckY + 22, 'pf_wake');
    this.carrierWake.setAlpha(0.35);
    this.carrierWake.setDepth(-11);
    this.carrierWake.setDisplaySize(280, 34);

    // Landing zone is positioned ABOVE the deck so it overlaps the plane when the plane is resting on the carrier.
    this.landingZone = this.scene.add.rectangle(deckX + 60, deckY - 24, 180, 44, 0x2ae3a7);
    this.landingZone.setAlpha(0.18);
    this.landingZone.setDepth(-1);

    this.scene.physics.add.existing(this.carrier, true);
    this.scene.physics.add.existing(this.landingZone, true);

    // Prevent flying through the carrier.
    this._carrierCollider = this.scene.physics.add.collider(this.player, this.carrier);

    this.setHelp('CARRIER: land on the deck zone to repair + reload');
  }

  createIsland() {
    this.destroyIsland();
    this.destroyCarrier();

    const { width, height } = this.scene.scale;

    const islandWidth = 520;
    const islandHeight = 160;

    const islandTextures = ['pf_island_0', 'pf_island_1', 'pf_island_2'];
    const islandKey = islandTextures[Math.floor(Math.random() * islandTextures.length)];

    this.island = this.scene.add.image(width + islandWidth / 2, height - islandHeight / 2, islandKey);
    this.island.setAlpha(0.98);
    this.island.setDepth(-3);
    this.island.setDisplaySize(islandWidth, islandHeight);
    this.scene.physics.add.existing(this.island, true);

    // Prevent flying through the island mass.
    this._islandCollider = this.scene.physics.add.collider(this.player, this.island);

    const islandTopY = this.island.y - islandHeight / 2;

    // Primary target (big explosion when destroyed)
    const primaryX = this.island.x + (-60 + Math.random() * 120);
    const primary = this.groundTargets.create(primaryX, islandTopY + 14, 'pf_target_primary');
    primary.setDisplaySize(62, 34);
    primary.refreshBody();
    primary.hp = 120;
    primary.isPrimary = true;
    primary.isTurret = false;

    // Secondary targets for variety
    const secondaryCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < secondaryCount; i += 1) {
      const sx = this.island.x - 170 + i * 170 + (Math.random() - 0.5) * 36;
      const t = this.groundTargets.create(sx, islandTopY + 15, 'pf_target_secondary');
      t.setDisplaySize(40, 26);
      t.refreshBody();
      t.hp = 26;
      t.isPrimary = false;
      t.isTurret = false;
    }

    for (let i = 0; i < 3; i += 1) {
      const turret = this.groundTargets.create(
        this.island.x - 140 + i * 140,
        // Place turrets ON the island top (sprite origin is centered).
        islandTopY + 11,
        'pf_turret'
      );
      turret.setDisplaySize(26, 26);
      turret.refreshBody();

      turret.hp = 22;
      turret.isPrimary = false;
      turret.isTurret = true;
      turret.fireEveryMs = Math.max(900, 1550 - this.difficulty * 70);
      turret.fireChance = Math.min(0.86, 0.7 + this.difficulty * 0.03);
      turret.nextFireAt = this.scene.time.now + 400 + i * 150;
    }

    this.setHelp('ISLAND: bomb primary targets (B) and avoid flak');
  }

  destroyIsland() {
    this._clearSetPieceColliders();
    if (this.island) {
      this.island.destroy();
      this.island = null;
    }
    this.groundTargets.clear(true, true);
  }

  destroyCarrier() {
    this._clearSetPieceColliders();
    if (this.carrier) {
      this.carrier.destroy();
      this.carrier = null;
    }
    if (this.carrierVisual) {
      this.carrierVisual.destroy();
      this.carrierVisual = null;
    }
    if (this.carrierWake) {
      this.carrierWake.destroy();
      this.carrierWake = null;
    }
    if (this.landingZone) {
      this.landingZone.destroy();
      this.landingZone = null;
    }

    this.setGroundProxyY(this.oceanLineY + 8);
  }
}
