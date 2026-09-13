import { BOUNDARY_OFFSET, HASH_MARK_LENGTH } from "../constants.js";

/** Fraction of the hash-to-sideline gap the power bar sits toward the edge. */
const SIDE_HASH_BLEND = 1 / 5;

export function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function clamp(value, low, high) {
  return Math.max(low, Math.min(value, high));
}

export function clampX(app, x) {
  const left = BOUNDARY_OFFSET + app.sideLineOffset;
  const right = app.width - BOUNDARY_OFFSET - app.sideLineOffset;
  return clamp(x, left, right);
}

export function leftHashX(app) {
  return Math.floor((3 * app.width) / 7);
}

export function rightHashX(app) {
  return Math.floor((4 * app.width) / 7);
}

export function rightControlX(app) {
  const hash = rightHashX(app) - Math.floor(HASH_MARK_LENGTH / 2);
  const sideline = app.width - BOUNDARY_OFFSET - app.sideLineOffset;
  return Math.floor(hash + (sideline - hash) * SIDE_HASH_BLEND);
}

export function pointInZone(x, y, zone) {
  return zone.left <= x && x <= zone.right && zone.top <= y && y <= zone.bottom;
}

export function getRadiusEndpoint(cx, cy, r, theta) {
  const rad = (theta * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
}

export function getRadiusAndAngleToEndpoint(cx, cy, targetX, targetY) {
  const radius = distance(cx, cy, targetX, targetY);
  let angle = (Math.atan2(cy - targetY, targetX - cx) * 180) / Math.PI;
  angle = ((angle % 360) + 360) % 360;
  return [radius, angle];
}

export function getBallPlacement(target, app) {
  const qb = app.oFormation.QB;
  const ballVelo = app.velocity * 3;
  const playerVelo = Math.hypot(target.dx, target.dy);
  const veloRatio = playerVelo / ballVelo;
  const distanceToTarget = distance(qb.cx, qb.cy, target.cx, target.cy);
  const [, targetAngle] = getRadiusAndAngleToEndpoint(0, 0, target.dx, target.dy);
  const [, angleToTarget] = getRadiusAndAngleToEndpoint(
    target.cx, target.cy, qb.cx, qb.cy
  );
  const angleDifference = (((targetAngle - angleToTarget) % 360) + 360) % 360;
  const sinTheta = Math.sin((angleDifference * Math.PI) / 180);
  let leadAngle =
    (((Math.asin(Math.min(1, Math.max(-1, sinTheta * veloRatio))) * 180) /
      Math.PI) %
      360 +
      360) %
    360;
  const ballAngle = 180 - (angleDifference + leadAngle);
  let sinBallAngle = Math.sin((ballAngle * Math.PI) / 180);
  if (sinBallAngle === 0) sinBallAngle = 0.0001;
  const throwDistance = (distanceToTarget * sinTheta) / sinBallAngle;
  const throwAngle = angleToTarget - 180 - leadAngle;
  const [ballX, ballY] = getRadiusEndpoint(
    qb.cx, qb.cy, throwDistance, throwAngle
  );
  if (qb.cx === ballX && qb.cy === ballY) return [ballX, ballY];
  const ballDistanceToQb = distance(qb.cx, qb.cy, ballX, ballY);
  const leadX = (qb.cx - ballX) / ballDistanceToQb;
  const leadY = (qb.cy - ballY) / ballDistanceToQb;
  return [
    ballX + leadX * app.yardStep * 0.5,
    ballY + leadY * app.yardStep * 0.5,
  ];
}
