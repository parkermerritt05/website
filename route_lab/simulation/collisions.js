import {
  COLLISION_OVERLAP_THRESHOLD,
  COLLISION_PUSH,
  PLAYER_COLLISION_RADIUS,
} from "../constants.js";
import { distance } from "./geometry.js";

export function handleCollisions(app) {
  const players = [
    ...Object.values(app.oFormation),
    ...Object.values(app.dFormation),
  ];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      resolveCollision(players[i], players[j]);
    }
  }
}

export function resolveCollision(p1, p2) {
  let xDiff = p2.cx - p1.cx;
  let yDiff = p2.cy - p1.cy;
  let dist = distance(p1.cx, p1.cy, p2.cx, p2.cy);
  if (dist === 0) {
    xDiff = 0.01;
    yDiff = 0.01;
    dist = distance(0, 0, xDiff, yDiff);
  }
  const overlap = 2 * PLAYER_COLLISION_RADIUS - dist;
  if (overlap > COLLISION_OVERLAP_THRESHOLD) {
    const nx = xDiff / dist;
    const ny = yDiff / dist;
    p1.cx -= nx * COLLISION_PUSH;
    p1.cy -= ny * COLLISION_PUSH;
    p2.cx += nx * COLLISION_PUSH;
    p2.cy += ny * COLLISION_PUSH;
  }
}
