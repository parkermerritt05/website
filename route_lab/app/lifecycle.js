import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../constants.js";
import { loadOffensiveFormations } from "../content/formations.js";
import { loadOffensiveRoutes } from "../content/routes.js";
import { loadDefensiveFormations } from "../coverage/setup.js";
import { Ball, SkillPlayer } from "../domain/index.js";
import { applyWindowMetrics, placeButtons } from "../ui/layout.js";
import {
  loadFieldButtons,
  loadOffensiveMenuButtons,
  loadStats,
} from "./menu-buttons.js";

export function onAppStart(app) {
  app.width = DESIGN_WIDTH;
  app.height = DESIGN_HEIGHT;
  app.prevWidth = app.width;
  app.prevHeight = app.height;
  app.yardLine = 0;
  app.totalYards = 0;
  app.score = 0;
  app.stepsPerSecond = 40;
  app.yardsPerSecond = 5;
  applyWindowMetrics(app);
  app.maxBallVelo = 6;
  app.mouseX = 0;
  app.mouseY = 0;
  app.isPassRush = true;
  app.lastPlayResult = "";
  app.lastYardsRan = 0;
  app.indexExport = 0;
  app.coverageShell = "Cover 1";
  app.animationTicks = 0;
  app.pressedButton = null;

  loadOffensiveRoutes(app);
  loadOffensiveFormations(app, true);
  loadStats(app);
  loadFieldButtons(app);
  loadOffensiveMenuButtons(app);
  placeButtons(app);
  resetApp(app);

  app.isField = false;
  app.isMainMenu = true;
  app.isOffensiveMenu = false;
  app.isMainMenuLabelHovering = false;
  app.isWRMenu = true;
}

export function resetApp(app, isField = true) {
  for (const player of Object.values(app.oFormation)) {
    player.cx = player.startX;
    player.cy = player.startY;
    player.dx = 0;
    player.dy = 0;
    if (player instanceof SkillPlayer) {
      player.targetX = player.startX;
      player.targetY = player.startY;
    }
  }
  app.playIsActive = false;
  app.selectedPlayer = null;
  app.isDefensiveMenu = false;
  app.isOffensiveMenu = false;
  app.isField = isField;
  if (!isField) {
    app.isOffensiveMenu = true;
  }
  app.isRouteCombination = false;
  app.isPaused = true;
  app.steps = 0;
  app.playResult = "";
  app.yardsRan = 0;
  app.isPlayActive = false;
  app.ballVelocity = 0;
  app.throwing = false;
  app.qbRun = true;
  app.ballCarrier = null;
  app.statsButton.isStats = false;
  app.ball = new Ball(
    app.oFormation.C.cx,
    app.oFormation.C.cy,
    app.oFormation.C
  );
  app.coverageShell = "Cover 1";
  loadDefensiveFormations(app);
}
