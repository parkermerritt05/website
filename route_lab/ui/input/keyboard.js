import { resetApp } from "../../app/lifecycle.js";
import { BOUNDARY_OFFSET } from "../../constants.js";
import { takeStep } from "./step.js";

/** Support Set (browser host) or array-like (Python onKeyHold). */
function keyDown(keys, name) {
  if (!keys) return false;
  if (typeof keys.has === "function") return keys.has(name);
  if (typeof keys.includes === "function") return keys.includes(name);
  return false;
}

/** Hike / pause / resume, triggered by the spacebar. */
export function togglePlayPause(app) {
  if (!app.isField) return;
  app.isPaused = !app.isPaused;
  if (!app.isPlayActive) {
    app.isPlayActive = true;
    app.lastPlayResult = "";
    app.lastYardsRan = 0;
    app.fieldInstructionsButton.isInstructions = false;
  }
}

export function onKeyPress(app, key) {
  if (!app.isField) return;
  if (key === "space") {
    togglePlayPause(app);
  } else if (key === "s") {
    takeStep(app);
    if (!app.isPlayActive) {
      app.isPlayActive = true;
      app.fieldInstructionsButton.isInstructions = false;
    }
  } else if (key === "r") {
    resetApp(app);
  } else if (key === "p") {
    app.isPassRush = !app.isPassRush;
  }
}

export function onKeyHold(app, keys) {
  if (app.isField) {
    moveBallCarrier(app, keys);
  } else if (app.isOffensiveMenu) {
    moveSelectedPlayer(app, keys);
  }
}

export function moveBallCarrier(app, keys) {
  const carrier = app.ball.carrier;
  if (carrier == null) return;
  const reach = 10 * app.yardStep;
  if (keyDown(keys, "up")) carrier.targetY = carrier.cy - reach;
  if (keyDown(keys, "down")) carrier.targetY = carrier.cy + reach;
  if (keyDown(keys, "right")) carrier.targetX = carrier.cx + reach;
  if (keyDown(keys, "left")) carrier.targetX = carrier.cx - reach;
}

export function moveSelectedPlayer(app, keys) {
  if (app.selectedPlayer == null) return;
  const moveAmount = 0.11 * app.yardStep;
  const player = app.oFormation[app.selectedPlayer];
  if (
    keyDown(keys, "up") &&
    nudgePlayer(app, player, 0, -moveAmount, moveAmount, checkInBoundaryScrimmageLine)
  ) {
    return;
  }
  if (
    keyDown(keys, "down") &&
    nudgePlayer(app, player, 0, moveAmount, moveAmount, checkInBoundaryScrimmageLine)
  ) {
    return;
  }
  if (
    keyDown(keys, "right") &&
    nudgePlayer(app, player, moveAmount, 0, moveAmount, checkInBoundaryLR)
  ) {
    return;
  }
  if (
    keyDown(keys, "left") &&
    nudgePlayer(app, player, -moveAmount, 0, moveAmount, checkInBoundaryLR)
  ) {
    return;
  }
  makeRouteInBounds(app, player);
}

export function nudgePlayer(app, player, dx, dy, moveAmount, boundaryCheck) {
  player.startX += dx;
  player.startY += dy;
  player.cx = player.startX;
  player.cy = player.startY;
  if (boundaryCheck(app, player, moveAmount) != null) return true;
  player.route = player.route.map(([rx, ry]) => [rx + dx, ry + dy]);
  return false;
}

export function onKeyRelease(app, key) {
  if (!app.isField || !app.ball) return;
  const carrier = app.ball.carrier;
  if (carrier == null) return;
  if (key === "up" || key === "down") {
    carrier.targetY = carrier.cy;
  } else if (key === "left" || key === "right") {
    carrier.targetX = carrier.cx;
  }
}

export function checkInBoundaryLR(app, player, moveAmount) {
  if (player.cx <= BOUNDARY_OFFSET + app.sideLineOffset) {
    player.startX += moveAmount;
    player.cx = player.startX;
    return "Too Far Left";
  } else if (player.cx >= app.width - BOUNDARY_OFFSET - app.sideLineOffset) {
    player.startX -= moveAmount;
    player.cx = player.startX;
    return "Too Far Right";
  }
  return null;
}

export function checkInBoundaryScrimmageLine(app, player, moveAmount) {
  const scrimmageLineOffset = 13;
  const lowerScreenOffset = 15;
  if (player.cy <= app.lineOfScrimmage + scrimmageLineOffset) {
    player.startY += moveAmount;
    player.cy = player.startY;
    return "Too Far Up";
  } else if (player.cy >= app.height - lowerScreenOffset) {
    player.startY -= moveAmount;
    player.cy = player.startY;
    return "Too Far Down";
  }
  return null;
}

export function makeRouteInBounds(app, player) {
  const newRoute = player.route.map(([x, y]) => [x, y]);
  for (let i = 0; i < player.route.length; i++) {
    const [x, y] = player.route[i];
    if (x <= app.sideLineOffset + BOUNDARY_OFFSET) {
      newRoute[i] = [app.sideLineOffset + BOUNDARY_OFFSET, y];
    }
    if (x >= app.width - app.sideLineOffset - BOUNDARY_OFFSET) {
      newRoute[i] = [app.width - app.sideLineOffset - BOUNDARY_OFFSET, y];
    }
  }
  player.route = newRoute;
}
