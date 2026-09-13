import { drawLine, drawOval } from "../cmu-shim.js";
import {
  BALL_ARC_ACCELERATION,
  BALL_FILL,
  BALL_LACE_COLOR,
  CAMERA_SCROLL_YARDS,
  CATCH_HEIGHT,
  DEFLECT_HEIGHT,
  PLAYER_HIT_RADIUS,
  SNAP_BALL_VELOCITY,
  THROW_START_HEIGHT,
} from "../constants.js";
import { distance } from "../simulation/geometry.js";
import { CoverPlayer } from "./defense.js";
import { Quarterback, SkillPlayer } from "./offense.js";

export class Ball {
  constructor(cx, cy, carrier, dx = 0, dy = 0, targetX = null, targetY = null) {
    this.carrier = carrier;
    this.dx = dx;
    this.dy = dy;
    this.cx = cx;
    this.cy = cy;
    this.targetX = targetX;
    this.targetY = targetY;
    this.beingSnapped = false;
    this.height = 0;
  }

  drawBall(app) {
    let offset = 0;
    if (this.cy <= CAMERA_SCROLL_YARDS * app.yardStep) {
      offset = CAMERA_SCROLL_YARDS * app.yardStep - this.cy;
    }
    const scaleFactor = 1 + this.height / 50;
    // Shim drawOval rotates by -rotateAngle; pass the negated canvas heading
    // so the long axis follows the throw (canvas 0° = right, CCW+).
    const canvasDeg = this.flightAngleDeg();
    const rotateAngle = -canvasDeg;
    const cx = this.cx;
    const cy = this.cy + offset;
    const width = 10 * scaleFactor;
    const height = 5 * scaleFactor;
    drawOval(cx, cy, width, height, {
      fill: BALL_FILL,
      align: "center",
      rotateAngle,
    });
    const laceHalf = 2.2 * scaleFactor;
    const rad = (canvasDeg * Math.PI) / 180;
    const dx = laceHalf * Math.cos(rad);
    const dy = laceHalf * Math.sin(rad);
    drawLine(cx - dx, cy - dy, cx + dx, cy + dy, {
      fill: BALL_LACE_COLOR,
      lineWidth: 1,
    });
  }

  throwToTarget(targetX, targetY, app) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.carrier = null;
    this.height = THROW_START_HEIGHT;
    this.throwDistance = distance(this.cx, this.cy, targetX, targetY);
    if (this.throwDistance < 0.001) {
      this.dx = 0;
      this.dy = 0;
      this.distanceTravelled = 0;
      return;
    }
    const dx = this.targetX - this.cx;
    const dy = this.targetY - this.cy;
    const ratio = app.ballVelocity / this.throwDistance;
    this.dx = dx * ratio;
    this.dy = dy * ratio;
    this.distanceTravelled = 0;
  }

  updateBallPosition(app) {
    if (this.carrier !== null) {
      if (this.carrier === app.oFormation.C) {
        this.beingSnapped = true;
        app.ballVelocity = SNAP_BALL_VELOCITY;
        this.throwToTarget(app.oFormation.QB.cx, app.oFormation.QB.cy, app);
        return;
      }
      this.cx = this.carrier.cx;
      this.cy = this.carrier.cy;
    } else if (app.playResult === "Incomplete") {
      this.dx = 0;
      this.dy = 0;
      this.cx += this.dx;
      this.cy += this.dy;
    } else if (this.targetX !== null && this.targetY !== null) {
      this.cx += this.dx;
      this.cy += this.dy;
      this.distanceTravelled += app.ballVelocity;
      this.updateHeight(app);
      this.checkCatch(app);
    }
  }

  updateHeight(app) {
    const timePassed = this.distanceTravelled / app.ballVelocity;
    const totalTime = this.throwDistance / app.ballVelocity;
    const initialVerticalSpeed = (BALL_ARC_ACCELERATION * totalTime) / 2;
    const verticalSpeed =
      initialVerticalSpeed - BALL_ARC_ACCELERATION * timePassed;
    this.height += verticalSpeed;
  }

  checkCatch(app) {
    if (this.height <= 0) {
      this.markIncomplete(app);
    } else if (this.height <= CATCH_HEIGHT) {
      this.tryCatch(app);
    } else if (this.height <= DEFLECT_HEIGHT) {
      this.tryDeflect(app);
    }
  }

  markIncomplete(app, countAttempt = true) {
    app.playResult = "Incomplete";
    app.lastPlayResult = "Incomplete";
    app.lastYardsRan = 0;
    if (countAttempt) {
      app.attempts += 1;
    }
    app.isPaused = true;
    this.height = 0;
    this.dx = 0;
    this.dy = 0;
    this.targetX = null;
    this.targetY = null;
  }

  tryCatch(app) {
    const receiver = this.nearestCatcher(app);
    if (receiver === null) return;
    this.beingSnapped = false;
    this.carrier = receiver;
    if (receiver instanceof CoverPlayer) {
      app.playResult = "Intercepted";
      app.lastPlayResult = "Intercepted";
      app.lastYardsRan = 0;
      app.ints += 1;
    }
    this.cx = receiver.cx;
    this.cy = receiver.cy;
    this.dx = 0;
    this.dy = 0;
    this.targetX = null;
    this.targetY = null;
    this.height = 0;
  }

  nearestCatcher(app) {
    let closestReceiver = null;
    let closestDistance = Infinity;
    const allPlayers = [
      ...Object.values(app.oFormation),
      ...Object.values(app.dFormation),
    ];
    for (const player of allPlayers) {
      if (!this.canCatch(player)) continue;
      const distToBall = distance(this.cx, this.cy, player.cx, player.cy);
      if (distToBall < closestDistance) {
        closestDistance = distToBall;
        closestReceiver = player;
      }
    }
    if (closestDistance <= PLAYER_HIT_RADIUS) {
      return closestReceiver;
    }
    return null;
  }

  canCatch(player) {
    return (
      player instanceof SkillPlayer ||
      (player instanceof Quarterback && this.beingSnapped) ||
      player instanceof CoverPlayer
    );
  }

  tryDeflect(app) {
    for (const player of Object.values(app.dFormation)) {
      if (!(player instanceof CoverPlayer)) continue;
      if (distance(this.cx, this.cy, player.cx, player.cy) <= PLAYER_HIT_RADIUS) {
        this.markIncomplete(app);
        return;
      }
    }
  }

  /** Canvas degrees for the ball’s long axis (0 = right, tip along flight). */
  flightAngleDeg() {
    if (this.dx !== 0 || this.dy !== 0) {
      return (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    }
    if (this.targetX !== null && this.targetY !== null) {
      return (
        (Math.atan2(this.targetY - this.cy, this.targetX - this.cx) * 180) /
        Math.PI
      );
    }
    return -90; // held / snapped: tip toward the end zone
  }
}
