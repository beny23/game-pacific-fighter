export function getOrCreateGroundProxy(scene, { width, initialY }) {
  const existing = scene.__pfGroundProxy;
  if (existing && existing.active && existing.body) return existing;

  if (existing && typeof existing.destroy === 'function') {
    existing.destroy();
  }

  scene.__pfGroundProxy = scene.add.rectangle(width / 2, initialY, width, 16, 0x000000, 0);
  scene.physics.add.existing(scene.__pfGroundProxy, true);
  scene.__pfGroundProxy.setDepth(-100);
  return scene.__pfGroundProxy;
}

export function setGroundProxyY(proxy, y) {
  if (!proxy || !proxy.body) return;
  proxy.y = y;
  proxy.body.updateFromGameObject();
}
