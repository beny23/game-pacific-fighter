# Pacific Fighter — Game Design Specification (GDS)

**High concept**: A fast, arcade side-scrolling flight action game where the player launches from an aircraft carrier, flies over the ocean toward island chains, bombs ground targets, and dogfights enemy fighters.

**Design goals**
- Immediate “carrier launch” fantasy in the first 10–20 seconds.
- Clear moment-to-moment loop: fly → avoid hazards → engage fighters → bomb targets → survive to the next segment.
- Arcade readability: enemies/targets are easy to recognize, shots are easy to track, and failure feels fair.

**Non-goals (for initial scope)**
- Complex flight sim physics.
- Large open world exploration.
- Deep loadout/gear RPG systems.

---

## 1) Target Platform & Session
- **Platform**: **Phaser 3** (HTML5/Web).
- **Camera**: 2D side view (left-to-right autoscroll / forward motion).
- **Session length**: endless score chase; typical runs target 5–12 minutes.

---

## 2) Player Fantasy & Narrative Wrapper
- **Role**: Carrier-based strike fighter pilot.
- **Setting**: Pacific theater-inspired ocean and islands (fictionalized).
- **Mission framing**: Launch from carrier, strike island targets, fend off interceptors, return or push onward.

---

## 3) Core Gameplay Loop
1. **Launch / takeoff** from aircraft carrier deck.
2. **Cruise over ocean** while building speed/altitude and encountering early threats.
3. **Approach island** with ground targets (anti-air, fuel depots, radar, etc.).
4. **Bombing run**: line up, drop bombs, pull up, avoid flak.
5. **Enemy fighter encounter**: dogfight while managing health/ammo and positioning.
6. **Stage complete**: survive past the island/encounter region to reach next ocean segment.

Loop repeats with escalating complexity: more targets, smarter fighters, tighter space, stronger AA.

---

## 4) Controls (Proposed)
**Movement**
- `W/S` or `Up/Down`: pitch up/down (vertical movement)
- `A/D` or `Left/Right`: small lateral nudging/aiming adjustment (no speed control)

**Combat**
- `Space`: fire cannon (continuous/rapid)
- `B`: drop bomb

**Utility**
- `Esc`: pause

Notes:
- Keep input minimal: the game should feel responsive and arcade-like.
- If gamepad: left stick for movement, primary button fire, secondary bomb, shoulder boost.

---

## 5) Player Aircraft
**Player stats (tunable)**
- **Health**: e.g., 100 HP
- **Speed**: base forward speed; autoscroll sets minimum forward motion
- **Cannon**: infinite ammo or heat-based (TBD)
- **Bombs**: **10 bombs** in inventory; can be replenished by returning to the carrier.

**Hitbox and feel**
- Slightly forgiving collision/hitbox to reduce frustration.
- Clear feedback on damage: flash, sound, small smoke trail that worsens as health drops.

---

## 6) Weapons
### 6.1 Cannon
- **Purpose**: primary anti-air weapon; can also chip ground targets (reduced damage).
- **Firing model**: rate-limited continuous fire.
- **Projectiles**: fast bullets with visible tracers.

### 6.2 Bombs
- **Purpose**: primary anti-ground weapon.
- **Drop behavior**:
  - Bomb spawns at plane, falls with gravity while continuing forward.
  - Explodes on ground/structure contact.
  - Explosion has small AOE for clustered targets.
- **Constraints**:
  - Limited inventory encourages deliberate bombing runs.
  - Optional arming distance (prevents point-blank drops) if needed for balance.

**Bomb inventory rules (locked)**
- Start with **10 bombs**.
- Bombs are replenished to full when successfully landing/returning to the carrier.

---

## 7) Enemies
### 7.1 Enemy Fighter Planes
**Role**: mobile threats that pressure positioning.

**Behavior tiers**
- **Basic**: flies in from right, shoots straightforward bursts, retreats or passes.
- **Interceptor**: attempts to match player altitude, lead shots slightly.
- **Ace (mini-boss)**: higher HP, varied attack patterns (dives, loops), telegraphed special burst.

**Weakness/Counterplay**
- Readable approach lanes.
- Brief vulnerability windows during turns or attack windups.

### 7.2 Ground Defenses (Island)
- **Flak gun / AA turret**: fires arcing or burst shots upward.
- **Radar**: increases fighter spawn rate while alive (optional).
- **Fuel depot / ammo dump**: explodes with larger AOE when bombed (risk/reward).

---

## 8) Level / Stage Structure
### 8.1 Stage Beat: Carrier → Ocean → Island → Ocean
Each stage is a sequence:
1. **Carrier launch** (short scripted/tutorial beat)
2. **Ocean segment** (waves, clouds, early fighters)
3. **Island segment** (ground targets + flak + fighters)
4. **Exit ocean segment** (cooldown, score tally, prep for next stage)

For **endless mode**, the game continuously cycles these segments with escalating difficulty and occasional “breather” ocean segments.

### 8.2 Autoscroll & Boundaries
- **Forward motion**: constant forward movement to the right.
- **Screen bounds**: soft clamp with warning (camera edge indicator). Hard leaving screen = damage or fail (TBD).
- **Ceiling/floor**: ocean surface contact damages or destroys; top boundary prevents leaving play area.

### 8.3 Island Geometry
- Islands are “solid ground” silhouettes.
- Ground targets sit on flat pads or small structures to maintain readability.

---

## 9) Progression & Difficulty
**Difficulty ramp knobs**
- Fighter spawn frequency and accuracy.
- AA rate of fire.
- Bomb scarcity.
- Stage length.

**Player growth options (pick one)**
- **Arcade classic (recommended MVP)**: no upgrades; skill-based scoring.
- **Light upgrades (optional later)**: between cycles choose 1 of 3 perks (more bombs / afterburner / more HP).

**Endless escalation**
- Over time, increase spawn density, add tougher enemy patterns, and introduce mixed threats (fighters + flak simultaneously).
- Periodically cap/normalize difficulty spikes with brief ocean-only segments.

---

## 10) Scoring & Objectives
**Primary objective**: survive as long as possible.

**Secondary**
- Destroy ground targets (bombs) and fighters (cannon) for score.
- Accuracy bonus (bomb hits).
- No-damage bonus.

**Suggested scoring**
- Fighter: +100
- AA turret: +150
- Radar: +200
- Fuel depot: +250 (chain explosion bonus)

---

## 11) Failure States & Lives
**One-life run (locked)**
- The plane can take damage; health persists.
- If health reaches 0 → run ends.

**Carrier return & repairs (locked)**
- Periodically, the player can choose to **return to the carrier** to repair.
- Returning to carrier restores health (full repair) and replenishes bombs to **10**.
- Risk/reward: choosing to return costs time/opportunity (missed targets/score) but preserves the run.

**Carrier return UX (locked: visible landing)**
- The carrier appears as a visible set-piece during designated ocean segments.
- The player must **align altitude and position** with the deck approach zone and maintain safe speed to land.
- On successful landing: repair to full health, bombs reset to **10**, then immediate relaunch into the endless loop.
- Landing failure: colliding with the ocean/deck obstacles or missing the approach zone results in heavy damage or run end (final tuning).

---

## 12) HUD / UI (Minimal)
- Health bar
- Bomb count
- Score
- Stage progress indicator (simple bar)

---

## 13) Audio-Visual Direction (High-level)
**Visuals (vector art)**
- Clean, readable vector shapes with bold silhouettes and minimal gradients.
- Bright ocean palette, readable silhouettes.
- Cloud layers for depth.
- Island shapes with a few distinct landmarks.

**FX**
- Muzzle flashes, tracer lines.
- Bomb explosions with a clear radius.
- Flak bursts as dark puffs.

**Audio**
- Engine loop with boost overlay.
- Distinct sounds for cannon, bomb drop, explosion, hit, warning.

---

## 14) Technical / Implementation Notes (Engine-agnostic)
- Use object pooling for bullets, flak, explosions.
- Deterministic spawn patterns per stage segment for learnability.
- Separate collision layers: player, enemy, bullets, bombs, ground, pickups (if any).

## 14.1 Phaser 3 Notes
- Use Arcade Physics for simple, performant collisions.
- Keep scroll as a global `worldSpeed` applied to backgrounds and spawned entities.
- Prefer vector assets via SVG-to-texture pipeline or pre-exported sprites (implementation choice).

---

## 15) MVP Scope (First Playable)
**Must have**
- Carrier launch intro
- Ocean scrolling segment
- One island segment with 2–3 bombable targets
- Bomb drop + explosion damage
- Enemy fighters with basic shooting
- Player health + fail state
- Minimal HUD
- Endless loop back into ocean/island cycle with score accumulation

**Carrier repair loop (MVP requirement due to one-life design)**
- A simple “return to carrier” segment that allows full repair + bomb replenishment.

**Nice later**
- Aces / mini-bosses
- Perk selection
- Multiple island types
- Weather (rain) / time-of-day
- Afterburner/boost

---

## Open Questions (to finalize the spec)
None (spec locked for MVP).
