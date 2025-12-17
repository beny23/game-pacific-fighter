# Pacific Fighter (MVP)

Phaser 3 side-scroller MVP: carrier takeoff, ocean flight, island bombing, enemy fighters, and visible carrier landing to repair/restock.

## Run

1. Install deps:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

Open the shown URL (usually http://localhost:5173).

## Controls
- `W/S` or `Up/Down`: altitude
- `A/D` or `Left/Right`: small lateral nudging
- `Space`: cannon
- `B`: drop bomb (10 total; replenished by landing on carrier)

## Notes
- Endless loop with increasing difficulty.
- One-life run: reach 0 HP → game over.
- Land on the carrier’s highlighted deck zone during the carrier segment to repair/reload.
