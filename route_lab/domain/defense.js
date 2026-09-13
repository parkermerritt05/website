import {
  DEFENDER_SIDELINE_CLAMP,
  MAN_BACKPEDAL_DEPTH_YARDS,
  MAN_JAM_YARDS,
  TACKLE_RANGE,
} from "../constants.js";
import {
  clamp,
  distance,
  getBallPlacement,
  leftHashX,
  pointInZone,
  rightHashX,
} from "../simulation/geometry.js";
import { SkillPlayer } from "./offense.js";
import { Player } from "./player.js";

export class CoverPlayer extends Player {
  constructor(
    cx, cy, dx = 0, dy = 0, man = null, zone = null,
    shell = "Cover 1", side = "middle", leverage = "balanced"
  ) {
    super(cx, cy, dx, dy);
    this.zone = zone;
    this.man = man;
    this.targetX = cx;
    this.targetY = cy;
    this.shell = shell;
    this.side = side;
    this.leverage = leverage;
    this.helpTarget = null;
    this.matchTarget = null;
    this.callout = "";
  }

  stepTowardTarget(app) {
    this.goToPoint(app);
    this.cx += this.dx;
    this.cy += this.dy;
    this.cx = clamp(
      this.cx, DEFENDER_SIDELINE_CLAMP, app.width - DEFENDER_SIDELINE_CLAMP
    );
  }

  guardMan(app) {
    if (this.shell === "Cover 2") {
      this.playZone(app);
      return;
    }
    if (this.man === null) {
      if (this.zone !== null) this.playZone(app);
      return;
    }
    [this.targetX, this.targetY] = getBallPlacement(this.man, app);
    if (app.yardsRan < MAN_JAM_YARDS) {
      const cushion =
        app.lineOfScrimmage - app.yardStep * MAN_BACKPEDAL_DEPTH_YARDS;
      this.targetY = Math.min(cushion, this.targetY);
    }
    this.stepTowardTarget(app);
  }

  playZone(app) {
    if (this.zone === null) return;
    [this.targetX, this.targetY] = this.resolveZoneTarget(app);
    this.targetX = clamp(this.targetX, this.zone.left, this.zone.right);
    this.targetY = clamp(this.targetY, this.zone.top, this.zone.bottom);
    this.stepTowardTarget(app);
  }

  resolveZoneTarget(app) {
    let threat = this.helpTarget;
    if (threat === null && this.matchTarget !== null) {
      const [ballX, ballY] = getBallPlacement(this.matchTarget, app);
      if (pointInZone(ballX, ballY, this.zone)) {
        threat = this.matchTarget;
      } else {
        this.matchTarget = null;
        this.callout = "Pass off!";
      }
    }
    if (threat === null) {
      threat = this.claimBestThreatInZone(app);
    }
    if (threat !== null) {
      return getBallPlacement(threat, app);
    }
    return [this.zone.cx, this.zone.cy];
  }

  claimBestThreatInZone(app) {
    const candidates = [];
    for (const player of Object.values(app.oFormation)) {
      if (!(player instanceof SkillPlayer)) continue;
      const [ballX, ballY] = getBallPlacement(player, app);
      if (pointInZone(ballX, ballY, this.zone)) {
        const depthScore = app.lineOfScrimmage - ballY;
        candidates.push([depthScore, player]);
      }
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b[0] - a[0]);
    const bestThreat = candidates[0][1];
    this.matchTarget = bestThreat;
    if (candidates.length > 1 && this.shell === "Cover 2") {
      this.callout = "Overload!";
    }
    return bestThreat;
  }

  checkTackle(app) {
    const ballCarrier = app.ball.carrier;
    if (distance(this.cx, this.cy, ballCarrier.cx, ballCarrier.cy) > TACKLE_RANGE) {
      return;
    }
    this.registerTackle(app);
    if (app.qbRun) {
      app.lastPlayResult += " (QB Run)";
    } else {
      app.numCompletions += 1;
      app.attempts += 1;
    }
  }
}

export class LineBacker extends CoverPlayer {
  constructor(
    cx, cy, dx = 0, dy = 0, man = null, zone = null,
    shell = "Cover 1", side = "middle", leverage = "balanced"
  ) {
    super(cx, cy, dx, dy, man, zone, shell, side, leverage);
  }
}

export class PassRusher extends Player {
  constructor(cx, cy, dx = 0, dy = 0) {
    super(cx, cy, dx, dy);
    this.rushingQB = false;
  }

  rushQB(app) {
    if (!app.isPassRush) {
      this.targetX = this.cx;
      this.targetY = this.cy;
      return;
    }
    const qb = app.oFormation.QB;
    if (this.rushingQB) {
      this.targetX = qb.cx;
      this.targetY = qb.cy;
    } else {
      this.holdContain(app, qb);
    }
    this.goToPoint(app);
    this.movePlayer(app);
  }

  holdContain(app, qb) {
    const hashOffset = 8;
    const closestRusher = this.nearestRusherToQB(app, qb);
    if (qb.cx < leftHashX(app) && closestRusher === this) {
      this.rushingQB = true;
    } else if (qb.cx > rightHashX(app) && closestRusher === this) {
      this.rushingQB = true;
    } else if (this.cx < leftHashX(app) + hashOffset) {
      this.targetX = leftHashX(app) + hashOffset;
    } else if (this.cx > rightHashX(app) - hashOffset) {
      this.targetX = rightHashX(app) - hashOffset;
    } else {
      this.targetX = this.cx;
    }
    this.targetY = app.lineOfScrimmage + app.yardStep;
    if (
      Math.floor(Math.random() * (app.stepsPerSecond * 40)) === 1 &&
      app.yardsRan > 3
    ) {
      this.rushingQB = true;
    }
  }

  nearestRusherToQB(app, qb) {
    let closestRusher = null;
    let closestDist = Infinity;
    for (const player of Object.values(app.dFormation)) {
      const dist = distance(player.cx, player.cy, qb.cx, qb.cy);
      if (dist < closestDist || closestRusher === null) {
        closestRusher = player;
        closestDist = dist;
      }
    }
    return closestRusher;
  }

  checkTackle(app) {
    const ballCarrier = app.ball.carrier;
    if (distance(this.cx, this.cy, ballCarrier.cx, ballCarrier.cy) > TACKLE_RANGE) {
      return;
    }
    this.registerTackle(app);
    app.numCompletions = 0;
    app.attempts = 0;
  }
}

export class DefensiveTackle extends PassRusher {
  constructor(cx, cy, dx = 0, dy = 0) {
    super(cx, cy, dx, dy);
  }
}

export class DefensiveEnd extends PassRusher {
  constructor(cx, cy, dx = 0, dy = 0) {
    super(cx, cy, dx, dy);
  }
}

export class Safety extends CoverPlayer {
  constructor(
    cx, cy, dx = 0, dy = 0, man = null, zone = null,
    shell = "Cover 1", side = "middle", leverage = "balanced"
  ) {
    super(cx, cy, dx, dy, man, zone, shell, side, leverage);
  }
}
