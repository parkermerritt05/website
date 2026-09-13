import {
  clamp,
  distance,
  getBallPlacement,
  pointInZone,
} from "../simulation/geometry.js";
import { CoverPlayer } from "./defense.js";
import { SkillPlayer } from "./offense.js";

export class CornerBack extends CoverPlayer {
  constructor(
    cx, cy, dx = 0, dy = 0, man = null, zone = null,
    shell = "Cover 1", side = "middle", leverage = "balanced"
  ) {
    super(cx, cy, dx, dy, man, zone, shell, side, leverage);
  }

  guardMan(app) {
    if (this.shell !== "Cover 2") {
      super.guardMan(app);
      return;
    }
    this.playCoverTwoTechnique(app);
  }

  playCoverTwoTechnique(app) {
    if (this.zone === null) {
      super.guardMan(app);
      return;
    }
    const primaryReceiver = this.man || this.findPrimaryReceiver(app);
    if (primaryReceiver === null) {
      this.playZone(app);
      return;
    }
    this.man = primaryReceiver;
    const insideLever = this.side === "left" ? 1 : -1;
    const flatThreat = this.findFlatThreat(app);
    if (this.shouldJam(app, flatThreat, primaryReceiver)) {
      this.jamReceiver(app, primaryReceiver, insideLever);
    } else {
      this.driveOnThreat(app, flatThreat, primaryReceiver, insideLever);
    }
    this.goToPoint(app);
    this.movePlayer(app);
  }

  findPrimaryReceiver(app) {
    let bestDist = Infinity;
    let primaryReceiver = null;
    for (const player of Object.values(app.oFormation)) {
      if (!(player instanceof SkillPlayer)) continue;
      const onLeft = player.cx <= Math.floor(app.width / 2);
      if (this.side === "left" && !onLeft) continue;
      if (this.side === "right" && onLeft) continue;
      const dist = distance(this.cx, this.cy, player.cx, player.cy);
      if (dist < bestDist) {
        bestDist = dist;
        primaryReceiver = player;
      }
    }
    return primaryReceiver;
  }

  findFlatThreat(app) {
    let flatThreat = null;
    let flatThreatDist = Infinity;
    if (this.helpTarget !== null) {
      const [helpX, helpY] = getBallPlacement(this.helpTarget, app);
      if (pointInZone(helpX, helpY, this.zone)) {
        flatThreat = this.helpTarget;
        flatThreatDist = distance(this.cx, this.cy, helpX, helpY);
      }
    }
    for (const player of Object.values(app.oFormation)) {
      if (!(player instanceof SkillPlayer)) continue;
      const [threatX, threatY] = getBallPlacement(player, app);
      if (!pointInZone(threatX, threatY, this.zone)) continue;
      const dist = distance(this.cx, this.cy, threatX, threatY);
      if (dist < flatThreatDist) {
        flatThreatDist = dist;
        flatThreat = player;
      }
    }
    return flatThreat;
  }

  shouldJam(app, flatThreat, primaryReceiver) {
    return (
      flatThreat === null &&
      app.yardsRan <= 2.6 &&
      primaryReceiver.cy >= app.lineOfScrimmage - app.yardStep
    );
  }

  jamReceiver(app, primaryReceiver, insideLever) {
    this.targetX = primaryReceiver.cx + insideLever * app.yardStep * 0.45;
    this.targetY = Math.min(
      primaryReceiver.cy - app.yardStep * 0.3,
      app.lineOfScrimmage - app.yardStep * 0.45
    );
    if (
      distance(this.cx, this.cy, primaryReceiver.cx, primaryReceiver.cy) <= 14
    ) {
      primaryReceiver.dx *= 0.8;
      primaryReceiver.targetX += insideLever * app.yardStep * 0.35;
      this.callout = "Force inside!";
    }
  }

  driveOnThreat(app, flatThreat, primaryReceiver, insideLever) {
    const targetReceiver = flatThreat !== null ? flatThreat : primaryReceiver;
    const [ballX, ballY] = getBallPlacement(targetReceiver, app);
    if (pointInZone(ballX, ballY, this.zone)) {
      this.targetX = ballX + insideLever * app.yardStep * 0.3;
      this.targetY = ballY;
      if (targetReceiver !== primaryReceiver) {
        this.callout = "Drive flat!";
      }
    } else {
      this.targetX = this.zone.cx + insideLever * app.yardStep * 0.4;
      this.targetY = this.zone.cy;
    }
    this.targetX = clamp(this.targetX, this.zone.left, this.zone.right);
    this.targetY = clamp(this.targetY, this.zone.top, this.zone.bottom);
    if (primaryReceiver.cy < app.lineOfScrimmage - 6 * app.yardStep) {
      this.callout = "Carry + pass!";
    }
  }
}
