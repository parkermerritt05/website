import {
  DESIGN_HEIGHT, DESIGN_SIDELINE, DESIGN_WIDTH, DESIGN_YARD_STEP,
  SCRIMMAGE_YARDS_FROM_BOTTOM,
} from "../constants.js";
import { loadDefensiveFormations } from "../coverage/setup.js";

export function applyWindowMetrics(app) {
  app.sideLineOffset = Math.round(
    (app.width * DESIGN_SIDELINE) / DESIGN_WIDTH
  );
  app.yardStep = (app.height * DESIGN_YARD_STEP) / DESIGN_HEIGHT;
  app.lineOfScrimmage =
    app.height - app.yardStep * SCRIMMAGE_YARDS_FROM_BOTTOM;
  app.velocity = app.yardsPerSecond * (app.yardStep / app.stepsPerSecond);
  app.maxSpeed = app.velocity;
  app.acceleration = (0.2 * app.yardStep) / app.stepsPerSecond;
  app.fieldSides = [30, app.width - 30];
}

export function midX(app, designDx) {
  return Math.floor(app.width / 2) + (designDx * app.width) / DESIGN_WIDTH;
}

export function losY(app, designDy) {
  return app.lineOfScrimmage + (designDy * app.height) / DESIGN_HEIGHT;
}

export function designY(app, designYCoord) {
  return (designYCoord * app.height) / DESIGN_HEIGHT;
}

export function onResize(app) {
  const oldW = app.prevWidth || 0;
  const oldH = app.prevHeight || 0;
  applyWindowMetrics(app);
  if (oldW <= 0 || oldH <= 0) {
    app.prevWidth = app.width;
    app.prevHeight = app.height;
    return;
  }
  if (!app.offensiveFormationButtons) {
    app.prevWidth = app.width;
    app.prevHeight = app.height;
    return;
  }
  placeButtons(app);
  rescalePlayState(app, oldW, oldH);
  if (app.isPlayActive) {
    scaleZones(app, app.width / oldW, app.height / oldH);
  } else if (app.oFormation) {
    loadDefensiveFormations(app);
  }
  app.prevWidth = app.width;
  app.prevHeight = app.height;
}

function rescalePlayState(app, oldW, oldH) {
  const sx = app.width / oldW;
  const sy = app.height / oldH;
  for (const formation of allFormations(app)) {
    for (const player of Object.values(formation)) {
      scalePlayer(player, sx, sy);
    }
  }
  if (app.dFormation) {
    for (const player of Object.values(app.dFormation)) {
      scalePlayer(player, sx, sy);
    }
  }
  if (app.ball) scaleBall(app.ball, sx, sy);
}

function allFormations(app) {
  const names = ["singleBack", "shotgun", "spread", "bunch", "custom"];
  const seen = new Set();
  const formations = [];
  for (const name of names) {
    const formation = app[name];
    if (!formation || seen.has(formation)) continue;
    seen.add(formation);
    formations.push(formation);
  }
  if (app.oFormation && !seen.has(app.oFormation)) {
    formations.push(app.oFormation);
  }
  return formations;
}

function scalePlayer(player, sx, sy) {
  player.cx *= sx;
  player.cy *= sy;
  player.startX *= sx;
  player.startY *= sy;
  if (player.targetX != null) player.targetX *= sx;
  if (player.targetY != null) player.targetY *= sy;
  if (player.route) {
    player.route = player.route.map(([x, y]) => [x * sx, y * sy]);
  }
}

function scaleBall(ball, sx, sy) {
  ball.cx *= sx;
  ball.cy *= sy;
  if (ball.targetX != null) ball.targetX *= sx;
  if (ball.targetY != null) ball.targetY *= sy;
}

function scaleZones(app, sx, sy) {
  if (!app.zones) return;
  for (const zone of Object.values(app.zones)) {
    zone.left *= sx;
    zone.right *= sx;
    zone.top *= sy;
    zone.bottom *= sy;
    zone.cx *= sx;
    zone.cy *= sy;
  }
}

export function placeButtons(app) {
  placeMenuButtons(app);
  placeFieldButtons(app);
  placeStatsButton(app);
}

function placeMenuButtons(app) {
  const leftCol = (95 * app.width) / DESIGN_WIDTH;
  const formationYs = [80, 170, 260, 350, 440];
  app.offensiveFormationButtons.forEach((button, i) => {
    button.cx = leftCol;
    button.cy = designY(app, formationYs[i]);
  });
  app.menuInstructionsButton.cx = (105 * app.width) / DESIGN_WIDTH;
  app.menuInstructionsButton.cy = designY(app, 538);

  const rightCol = app.width - (95 * app.width) / DESIGN_WIDTH;
  const routeYs = [50, 110, 170, 230, 290, 350, 410, 470, 530, 590, 650, 710];
  app.offensiveWRRouteButtons.forEach((button, i) => {
    button.cx = rightCol;
    button.cy = designY(app, routeYs[i]);
  });
  const rbYs = [50, 110];
  app.offensiveRBRouteButtons.forEach((button, i) => {
    button.cx = rightCol;
    button.cy = designY(app, rbYs[i]);
  });

  app.fieldInstructionsButton.cx =
    app.width - (100 * app.width) / DESIGN_WIDTH;
  app.fieldInstructionsButton.cy = designY(app, 50);
  app.startGameButton.cx = Math.floor(app.width / 2);
  app.startGameButton.cy = designY(app, 700);
}

function placeFieldButtons(app) {
  const gutter = Math.floor(app.sideLineOffset / 2);
  app.fieldButtons[0].cx = gutter;
  app.fieldButtons[0].cy = designY(app, 40);
  app.fieldButtons[1].cx = gutter;
  app.fieldButtons[1].cy = designY(app, 110);
}

function placeStatsButton(app) {
  app.statsButton.cx = app.width - (100 * app.width) / DESIGN_WIDTH;
  app.statsButton.cy = designY(app, 130);
}
