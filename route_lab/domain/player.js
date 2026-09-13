import { BOUNDARY_OFFSET, GOAL_LINE_YARDS, PLAYER_HIT_RADIUS } from "../constants.js";
import {
  clampX,
  distance,
  getRadiusAndAngleToEndpoint,
  getRadiusEndpoint,
} from "../simulation/geometry.js";

export class Player {
  constructor(cx, cy, dx = 0, dy = 0, targetX = null, targetY = null) {
    this.startX = cx;
    this.startY = cy;
    this.cx = cx;
    this.cy = cy;
    this.dx = dx;
    this.dy = dy;
    this.targetX = targetX;
    this.targetY = targetY;
  }

  isOutOfBounds(app) {
    return (
      this.cx <= app.sideLineOffset + BOUNDARY_OFFSET ||
      this.cx >= app.width - BOUNDARY_OFFSET
    );
  }

  clickInPlayer(mouseX, mouseY) {
    return distance(this.cx, this.cy, mouseX, mouseY) <= PLAYER_HIT_RADIUS;
  }

  goToPoint(app) {
    this.targetX = clampX(app, this.targetX);
    const dx = this.targetX - this.cx;
    const dy = this.targetY - this.cy;
    const dist = distance(this.cx, this.cy, this.targetX, this.targetY);
    if (dist === 0) return;

    let desiredVx = (dx / dist) * app.maxSpeed;
    let desiredVy = (dy / dist) * app.maxSpeed;
    const slowdownDist = 2 * app.yardStep;
    if (dist < slowdownDist) {
      desiredVx *= dist / slowdownDist;
      desiredVy *= dist / slowdownDist;
    }

    let steerX = desiredVx - this.dx;
    let steerY = desiredVy - this.dy;
    const steerMag = distance(0, 0, steerX, steerY);
    if (steerMag > app.acceleration) {
      steerX = (steerX / steerMag) * app.acceleration;
      steerY = (steerY / steerMag) * app.acceleration;
    }
    this.dx += steerX;
    this.dy += steerY;

    const speed = distance(0, 0, this.dx, this.dy);
    if (speed > app.maxSpeed) {
      this.dx = (this.dx / speed) * app.maxSpeed;
      this.dy = (this.dy / speed) * app.maxSpeed;
    }
  }

  trackBall(app) {
    this.targetX = app.ball.targetX;
    this.targetY = app.ball.targetY;
    this.goToPoint(app);
    this.movePlayer(app);
  }

  runWithBall(app) {
    this.targetX = this.cx;
    this.targetY = app.lineOfScrimmage - app.yardStep * GOAL_LINE_YARDS;
    this.goToPoint(app);
    this.movePlayer(app);
  }

  block(app) {
    const defender = this.getNearestDefender(app);
    this.stopPlayer(app, defender);
  }

  movePlayer(app) {
    this.cx += this.dx;
    this.cy += this.dy;
    this.cx = clampX(app, this.cx);
  }

  stopPlayer(app, target) {
    const playerVelo = app.maxSpeed;
    const targetVelo = (target.dx ** 2 + target.dy ** 2) ** 0.5;
    const veloRatio = targetVelo / playerVelo;
    const distanceToTarget = distance(this.cx, this.cy, target.cx, target.cy);
    const [, targetAngle] = getRadiusAndAngleToEndpoint(0, 0, target.dx, target.dy);
    const [, angleToTarget] = getRadiusAndAngleToEndpoint(
      target.cx, target.cy, this.cx, this.cy
    );
    const angleDifference = ((targetAngle - angleToTarget) % 360 + 360) % 360;
    const sinTheta = Math.sin((angleDifference * Math.PI) / 180);
    const pursuitAngle =
      (((Math.asin(sinTheta * veloRatio) * 180) / Math.PI) % 360 + 360) % 360;
    const interceptAngle = 180 - (angleDifference + pursuitAngle);
    const sinInterceptAngle = Math.sin((interceptAngle * Math.PI) / 180);
    if (sinInterceptAngle > -0.0015 && sinInterceptAngle < 0.0015) {
      [this.targetX, this.targetY] = getRadiusEndpoint(
        this.cx, this.cy, 10 * app.yardStep, targetAngle
      );
      this.goToPoint(app);
      this.movePlayer(app);
      return;
    }
    const pursuitDistance = (distanceToTarget * sinTheta) / sinInterceptAngle;
    const pursuitHeading = angleToTarget - 180 - pursuitAngle;
    [this.targetX, this.targetY] = getRadiusEndpoint(
      this.cx, this.cy, pursuitDistance, pursuitHeading
    );
    this.goToPoint(app);
    this.movePlayer(app);
  }

  getNearestDefender(app) {
    let closestDist = null;
    let closest = null;
    for (const player of Object.values(app.dFormation)) {
      const dist = distance(this.cx, this.cy, player.cx, player.cy);
      if (closestDist === null || dist < closestDist) {
        closest = player;
        closestDist = dist;
      }
    }
    return closest;
  }

  registerTackle(app) {
    app.playResult = "Tackled";
    app.lastPlayResult = "Tackled";
    app.throwing = false;
    app.ballVelocity = 0;
    app.isPaused = true;
    const yards = Math.trunc(
      (app.lineOfScrimmage - app.ball.carrier.cy) / app.yardStep
    );
    app.lastYardsRan = yards;
    app.totalYards += yards;
  }
}
