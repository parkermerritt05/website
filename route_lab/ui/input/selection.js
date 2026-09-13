import {
  INSTR_PANEL_HEIGHT,
  INSTR_PANEL_OFFSET_Y,
  INSTR_PANEL_WIDTH,
  PLAYER_DRAW_RADIUS,
  STATS_PANEL_HEIGHT,
  STATS_PANEL_OFFSET_Y,
  STATS_PANEL_WIDTH,
} from "../../constants.js";
import { initializeDefense } from "../../coverage/setup.js";
import { distance } from "../../simulation/geometry.js";
import { panelCloseCenter, panelCloseContains } from "../buttons.js";

export function handleMenuClick(app, mx, my) {
  if (clickedInstructionClose(app, mx, my, app.menuInstructionsButton)) {
    app.menuInstructionsButton.isInstructions =
      !app.menuInstructionsButton.isInstructions;
    return;
  }
  if (handleFormationButtons(app, mx, my)) return;
  if (handleRouteButtons(app, mx, my)) return;
  selectSkillPlayer(app, mx, my);
  if (app.startGameButton.isClicked(mx, my)) {
    startGame(app);
  }
}

export function handleFormationButtons(app, mx, my) {
  for (const button of app.offensiveFormationButtons) {
    if (button.isClicked(mx, my)) {
      app.oFormation = button.formation;
      app.selectedPlayer = null;
      return true;
    }
  }
  return false;
}

export function handleRouteButtons(app, mx, my) {
  const buttons = app.isWRMenu
    ? app.offensiveWRRouteButtons
    : app.offensiveRBRouteButtons;
  for (const button of buttons) {
    if (button.isClicked(mx, my)) {
      if (app.selectedPlayer == null) return true;
      const player = app.oFormation[app.selectedPlayer];
      const route =
        player.cx <= Math.floor(app.width / 2)
          ? button.leftRoute
          : button.rightRoute;
      player.route = player.translateRoute(app, route);
      player.routeName = button.text;
      return true;
    }
  }
  return false;
}

export function selectSkillPlayer(app, mx, my) {
  for (const position of Object.keys(app.oFormation)) {
    const player = app.oFormation[position];
    if (distance(player.cx, player.cy, mx, my) > PLAYER_DRAW_RADIUS) continue;
    if (position.includes("WR") || position.includes("TE")) {
      toggleSelection(app, position, true);
    } else if (position.includes("RB")) {
      toggleSelection(app, position, false);
    }
  }
}

export function toggleSelection(app, position, wrMenu) {
  if (app.selectedPlayer === position) {
    app.pendingDeselect = position;
  } else {
    app.pendingDeselect = null;
    app.selectedPlayer = position;
    app.isWRMenu = wrMenu;
  }
}

export function startGame(app) {
  app.isField = true;
  app.isOffensiveMenu = false;
  app.selectedPlayer = null;
  app.coverageShell = "Cover 1";
  app.dFormation = initializeDefense(app);
  app.isPlayActive = false;
  app.isPaused = true;
}

export function inStartButton(app, mx, my) {
  return (
    Math.floor(app.width / 2) - 250 <= mx &&
    mx <= Math.floor(app.width / 2) + 250 &&
    Math.floor(app.height / 2) + 45 - 75 <= my &&
    my <= Math.floor(app.height / 2) + 45 + 75
  );
}

export function clickedInstructionClose(app, mx, my, button) {
  const [closeCx, closeCy] = panelCloseCenter(
    Math.floor(app.width / 2),
    Math.floor(app.height / 2) - INSTR_PANEL_OFFSET_Y,
    INSTR_PANEL_WIDTH,
    INSTR_PANEL_HEIGHT
  );
  const inClose = panelCloseContains(mx, my, closeCx, closeCy);
  return button.isClicked(mx, my) || (button.isInstructions && inClose);
}

export function clickedStatsClose(app, mx, my) {
  if (!app.statsButton.isStats) return false;
  const [closeCx, closeCy] = panelCloseCenter(
    Math.floor(app.width / 2),
    Math.floor(app.height / 2) + STATS_PANEL_OFFSET_Y,
    STATS_PANEL_WIDTH,
    STATS_PANEL_HEIGHT
  );
  return panelCloseContains(mx, my, closeCx, closeCy);
}
