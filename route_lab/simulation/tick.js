import { QB_DROPBACK_YARDS } from "../constants.js";
import { CoverPlayer, PassRusher } from "../domain/defense.js";
import { Lineman, Quarterback, SkillPlayer } from "../domain/offense.js";
import { coordinateCoverTwo } from "./cover-two.js";

export function moveOffense(app) {
  for (const player of Object.values(app.oFormation)) {
    updateOffensivePlayer(app, player);
  }
}

function updateOffensivePlayer(app, player) {
  if (player === app.ball.carrier && !(player instanceof Lineman)) {
    player.goToPoint(app);
    player.movePlayer(app);
  } else if (player instanceof Quarterback) {
    player.targetX = player.cx;
    player.targetY = app.lineOfScrimmage + app.yardStep * QB_DROPBACK_YARDS;
    player.goToPoint(app);
    player.cx += player.dx;
    player.cy += player.dy;
  } else if (player instanceof SkillPlayer) {
    updateSkillPlayer(app, player);
  }
}

function updateSkillPlayer(app, player) {
  const ball = app.ball;
  if (
    ball.targetX !== null &&
    ball.targetY !== null &&
    !ball.beingSnapped
  ) {
    player.trackBall(app);
  } else if (ball.carrier === app.oFormation.QB) {
    player.runRoute(app);
  } else if (player === ball.carrier) {
    player.runWithBall(app);
  } else {
    player.block(app);
  }
}

export function moveDefense(app) {
  if (app.coverageShell === "Cover 2") {
    coordinateCoverTwo(app);
  }
  for (const player of Object.values(app.dFormation)) {
    if (player instanceof CoverPlayer) {
      updateCoverPlayer(app, player);
    } else if (player instanceof PassRusher) {
      player.rushQB(app);
      if (app.ball.carrier === app.oFormation.QB) {
        player.checkTackle(app);
      }
    }
  }
}

function updateCoverPlayer(app, player) {
  const ball = app.ball;
  const qb = app.oFormation.QB;
  if (
    ball.targetX !== null &&
    ball.targetY !== null &&
    !ball.beingSnapped
  ) {
    player.trackBall(app);
  } else if (
    (ball.carrier === qb && qb.cy > app.lineOfScrimmage) ||
    ball.beingSnapped
  ) {
    player.guardMan(app);
  } else {
    player.stopPlayer(app, ball.carrier);
    player.checkTackle(app);
  }
}
