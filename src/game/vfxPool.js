// Simple sprite/image pool to reduce GC churn on mobile.
// Only for short-lived visual effects (Images). Avoid pooling long-lived decals.

export function createVfxPool(scene, { caps = {} } = {}) {
  const pools = new Map();

  function capFor(key) {
    return typeof caps[key] === 'number' ? caps[key] : 40;
  }

  function acquire(key) {
    let pool = pools.get(key);
    if (!pool) {
      pool = [];
      pools.set(key, pool);
    }

    const img = pool.pop();
    if (img) {
      scene.tweens.killTweensOf(img);
      img.setActive(true);
      img.setVisible(true);
      img.setAlpha(1);
      img.setScale(1);
      img.setRotation(0);
      img.setTint(0xffffff);
      img.clearTint();
      return img;
    }

    const created = scene.add.image(0, 0, key);
    created.setActive(true);
    created.setVisible(true);
    return created;
  }

  function release(img) {
    if (!img || !img.texture?.key) return;
    const key = img.texture.key;

    let pool = pools.get(key);
    if (!pool) {
      pool = [];
      pools.set(key, pool);
    }

    // Respect per-key caps.
    if (pool.length >= capFor(key)) {
      img.destroy();
      return;
    }

    img.setActive(false);
    img.setVisible(false);
    pool.push(img);
  }

  function clear() {
    for (const pool of pools.values()) {
      for (const img of pool) img.destroy();
      pool.length = 0;
    }
    pools.clear();
  }

  scene.events.once('shutdown', clear);

  return { acquire, release, clear };
}
