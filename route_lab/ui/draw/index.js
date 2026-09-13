import { drawField } from "./field.js";
import {
  drawFieldHud,
  drawThrowIndicator,
  drawThrowPowerBar,
  fieldInstructionsOpen,
  fieldStatsOpen,
  updateFieldButtonStates,
} from "./hud.js";
import {
  drawFieldButtons,
  drawFieldInstructions,
  drawMainMenu,
  drawOffensiveMenu,
} from "./menus.js";
import { drawStatsMenu } from "./modals.js";
import { drawDefense, drawOffense, drawSideline } from "./tokens.js";

export function redrawAll(app) {
  if (app.isField) {
    drawFieldScreen(app);
  } else if (app.isMainMenu) {
    drawMainMenu(app);
  } else if (app.isOffensiveMenu) {
    drawOffensiveMenu(app);
  }
}

export function drawFieldScreen(app) {
  updateFieldButtonStates(app);
  drawField(app);
  drawSideline(app);
  drawFieldButtons(app);
  drawOffense(app);
  drawDefense(app);
  app.ball.drawBall(app);
  drawThrowIndicator(app);
  drawThrowPowerBar(app);
  app.fieldInstructionsButton.draw();
  app.statsButton.draw();
  drawFieldHud(app);
  if (fieldInstructionsOpen(app)) {
    drawFieldInstructions(app);
  }
  if (fieldStatsOpen(app)) {
    drawStatsMenu(app);
  }
}
