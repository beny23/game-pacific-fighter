export function updateBombDrift(bombs, dt, worldSpeed) {
  bombs.children.iterate((b) => {
    if (!b) return;
    b.x -= worldSpeed * dt * 0.35;
    b.body.updateFromGameObject();
  });
}
