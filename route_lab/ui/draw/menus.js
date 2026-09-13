import {
  drawCircle,
  drawImage,
  drawLabel,
  drawLine,
  drawRect,
  gradient,
  withClip,
} from "../../cmu-shim.js";
import {
  HOVER_OVERLAY_COLOR,
  HOVER_OVERLAY_OPACITY,
  HUD_TEXT_COLOR,
  MENU_GREEN_DARK,
  MENU_GREEN_LIGHT,
  MENU_GREEN_MID,
  MENU_NODE_BASE_RADIUS,
  MENU_NODE_PULSE_AMPLITUDE,
  MENU_NODE_PULSE_SPEED,
  MENU_RED,
  MENU_RED_ACCENT,
} from "../../constants.js";
import { drawField } from "./field.js";
import { drawInstructionPanelFrame } from "./modals.js";
import { drawOffense } from "./tokens.js";

export function drawMainMenu(app) {
  withClip(0, 0, app.width, app.height, () => {
    drawRect(0, 0, app.width, app.height, {
      fill: gradient(MENU_GREEN_LIGHT, MENU_GREEN_MID, MENU_GREEN_DARK, "left-top"),
    });
    drawLine(-6, 60, 200, app.height + 6, { fill: MENU_RED, lineWidth: 6 });
    drawLine(50, -6, 50, app.height + 6, { fill: MENU_RED_ACCENT, lineWidth: 6 });
    drawImage("routeLabLogo.png", Math.floor(app.width / 2), 150, {
      align: "center",
      width: 750,
      height: 300,
    });
    drawLabel("Create your own football", Math.floor(app.width / 2), 270, {
      size: 35,
      bold: true,
      font: "monospace",
    });
    drawLabel("routes and dominate the game.", Math.floor(app.width / 2), 310, {
      size: 35,
      bold: true,
      font: "monospace",
    });
    drawStartCreatingButton(app);
    drawMainMenuRoutes(app);
    drawLabel(
      "Created by James Ryman and Parker Merritt from Carnegie Mellon University",
      Math.floor(app.width / 2),
      app.height - 20,
      { size: 13, fill: "black", font: "monospace" }
    );
  });
}

export function drawStartCreatingButton(app) {
  const centerX = Math.floor(app.width / 2);
  const centerY = Math.floor(app.height / 2) + 45;
  if (app.isMainMenuLabelHovering) {
    drawRect(centerX, centerY, 510, 156, {
      fill: MENU_RED,
      border: MENU_RED,
      borderWidth: 3,
      align: "center",
    });
    drawRect(centerX, centerY, 500, 150, {
      fill: MENU_GREEN_MID,
      border: "black",
      borderWidth: 3,
      align: "center",
    });
    drawRect(centerX, centerY, 500, 150, {
      fill: HOVER_OVERLAY_COLOR,
      opacity: HOVER_OVERLAY_OPACITY,
      align: "center",
    });
    drawLabel("Start Creating Plays ", centerX, centerY, {
      size: 35,
      bold: true,
      font: "monospace",
    });
  } else {
    drawRect(centerX, centerY, 506, 153, {
      fill: MENU_RED,
      border: MENU_RED,
      borderWidth: 3,
      align: "center",
    });
    drawRect(centerX, centerY, 500, 150, {
      fill: MENU_GREEN_MID,
      border: "black",
      borderWidth: 3,
      align: "center",
    });
    drawLabel("Start Creating Plays ", centerX, centerY, {
      size: 33,
      bold: false,
      font: "monospace",
    });
  }
}

export function drawMainMenuRoutes(app) {
  const nodeRadius = menuNodeRadius(app);
  const baseY = app.height - 78;
  drawLine(270, baseY, 270, app.height - 243, {
    lineWidth: 7,
    arrowEnd: true,
  });
  drawCircle(270, baseY, nodeRadius, {
    fill: MENU_RED,
    border: "black",
  });
  drawLine(340, baseY, 340, app.height - 148, { lineWidth: 7 });
  drawLine(340, app.height - 148, 450, app.height - 148, {
    lineWidth: 7,
    arrowEnd: true,
  });
  drawRect(340, app.height - 148, 7, 7, { fill: "black", align: "center" });
  drawCircle(340, baseY, nodeRadius, {
    fill: MENU_RED,
    border: "black",
  });
  const rightX = app.width - 280;
  drawLine(rightX, baseY, rightX, app.height - 168, { lineWidth: 7 });
  drawLine(rightX, app.height - 168, rightX - 80, app.height - 238, {
    lineWidth: 7,
    arrowEnd: true,
  });
  drawRect(rightX, app.height - 168, 7, 7, {
    fill: "black",
    align: "center",
  });
  drawCircle(rightX, baseY, nodeRadius, {
    fill: MENU_RED,
    border: "black",
  });
}

export function menuNodeRadius(app) {
  const pulse = Math.sin(app.animationTicks * MENU_NODE_PULSE_SPEED);
  return MENU_NODE_BASE_RADIUS + MENU_NODE_PULSE_AMPLITUDE * pulse;
}

export function drawFieldButtons(app) {
  for (const button of app.fieldButtons) {
    button.draw();
  }
}

export function drawOffensiveMenu(app) {
  drawField(app, false);
  drawLabel("Select Formation", Math.floor(app.sideLineOffset / 2), 17, {
    size: 20,
    bold: true,
    fill: HUD_TEXT_COLOR,
  });
  drawRouteColumnTitle(app);
  for (const button of app.offensiveFormationButtons) {
    button.draw();
  }
  drawRouteButtons(app);
  app.startGameButton.draw();
  app.menuInstructionsButton.draw();
  drawOffense(app);
  if (app.menuInstructionsButton.isInstructions) {
    drawMenuInstructionsMenu(app);
  }
}

export function drawRouteColumnTitle(app) {
  const cx = app.width - Math.floor(app.sideLineOffset / 2);
  if (app.selectedPlayer != null) {
    drawLabel("Select Route", cx, 17, {
      size: 20,
      bold: true,
      fill: HUD_TEXT_COLOR,
    });
    return;
  }
  const midY = Math.floor(app.height / 2);
  const style = { size: 20, bold: true, fill: HUD_TEXT_COLOR };
  drawLabel("Select Player to", cx, midY - 14, style);
  drawLabel("Choose a Route", cx, midY + 14, style);
}

export function drawRouteButtons(app) {
  if (app.selectedPlayer == null) return;
  const activeName = selectedRouteName(app);
  const routeButtons = app.isWRMenu
    ? app.offensiveWRRouteButtons
    : app.offensiveRBRouteButtons;
  for (const button of routeButtons) {
    button.active = button.text === activeName;
    button.draw();
  }
}

export function selectedRouteName(app) {
  if (app.selectedPlayer == null) return null;
  return app.oFormation[app.selectedPlayer].routeName ?? null;
}

export function drawMenuInstructionsMenu(app) {
  const offset = 175;
  const left = Math.floor(app.width / 2) - 200;
  const top = Math.floor(app.height / 2) - offset;
  drawInstructionPanelFrame(app);
  drawLabel("- Click a formation button to select formation", left, top - 70, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("- Click a player then a route to select route", left, top - 40, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("- Use arrow keys to move players", left, top - 10, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("- Click a player and drag to create custom route", left, top + 20, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
}

export function drawFieldInstructions(app) {
  const offset = 175;
  const left = Math.floor(app.width / 2) - 200;
  const top = Math.floor(app.height / 2) - offset;
  drawInstructionPanelFrame(app);
  drawLabel("- Press the spacebar to pause/resume", left, top - 70, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("- Click and hold to throw the ball", left, top - 40, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("Hold longer for a faster throw", Math.floor(app.width / 2) - 150, top - 15, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("- Use arrow keys to move ball carrier", left, top + 15, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("- Press 'S' to step by one frame when paused", left, top + 45, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("- Press 'R' to reset the play", left, top + 75, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("- Press 'P' to toggle pass rushers", left, top + 105, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
}
