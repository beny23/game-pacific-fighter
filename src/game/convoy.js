export function createConvoySystem(scene, { oceanLineY, oceanTargets }) {
  const state = {
    nextSpawnAt: 0,
    active: false,
    segmentWasOcean: false
  };

  function clear() {
    oceanTargets.clear(true, true);
    state.active = false;
  }

  function spawn({ width, timeNow, difficulty }) {
    clear();

    const count = 2 + Math.floor(Math.random() * 3);
    const gap = 110 + Math.random() * 40;
    const baseX = width + 180;
    const y = oceanLineY - 6;

    for (let i = 0; i < count; i += 1) {
      const boat = oceanTargets.create(baseX + i * gap, y + (Math.random() - 0.5) * 6, 'pf_boat');
      boat.setDepth(-2);
      boat.setAlpha(0.98);
      boat.setDisplaySize(84, 22);
      boat.refreshBody();

      boat.hp = 18 + difficulty * 3;
      boat.isOceanTarget = true;
    }

    state.active = true;
    state.nextSpawnAt = timeNow + 9000 + Math.random() * 7000;
  }

  function update(time, dt, { segment, worldSpeed, width, difficulty }) {
    if (segment !== 'OCEAN') {
      if (state.segmentWasOcean) clear();
      state.segmentWasOcean = false;
      state.nextSpawnAt = 0;
      return;
    }

    state.segmentWasOcean = true;

    if (!state.nextSpawnAt) state.nextSpawnAt = time + 1800;

    if (!state.active && time >= state.nextSpawnAt) {
      spawn({ width, timeNow: time, difficulty });
    }

    // Scroll + cleanup.
    oceanTargets.children.iterate((t) => {
      if (!t) return;
      t.x -= worldSpeed * dt;
      t.body.updateFromGameObject?.();
      t.body.refreshBody?.();
      if (t.x < -120) t.destroy();
    });

    // If all boats destroyed, allow another spawn later.
    const alive = oceanTargets.countActive(true);
    if (alive === 0) state.active = false;
  }

  function damage(target, amount) {
    if (!target || !target.active) return false;
    target.hp -= amount;
    if (target.hp <= 0) {
      target.destroy();
      return true;
    }
    return false;
  }

  return { update, damage, clear };
}
