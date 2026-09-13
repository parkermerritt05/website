import { drawCircle, drawLabel, drawRect } from "../../cmu-shim.js";
import {
  BANNER_GAIN_COLOR,
  BANNER_LOSS_COLOR,
  HUD_PANEL_BORDER_WIDTH,
  HUD_TEXT_COLOR,
  HUD_TOP_Y,
  POWER_BAR_BORDER,
  POWER_BAR_FILL_HIGH,
  POWER_BAR_FILL_LOW,
  POWER_BAR_FULL_THRESHOLD,
  POWER_BAR_GAP_ABOVE_BASE,
  POWER_BAR_LABEL_GAP,
  POWER_BAR_LENGTH,
  POWER_BAR_THICKNESS,
  POWER_BAR_TRACK_COLOR,
  POWER_BAR_TRACK_OPACITY,
  RESULT_BANNER_HEIGHT,
  RESULT_BANNER_OPACITY,
  RESULT_BANNER_WIDTH,
  THROW_AIM_COLOR,
} from "../../constants.js";
import { rightControlX } from "../../simulation/geometry.js";
import { drawGlassPanel } from "./modals.js";

export function controlsAreLive(app) {
  return app.playResult !== "" || app.isPaused;
}

export function fieldInstructionsOpen(app) {
  return app.fieldInstructionsButton.isInstructions && controlsAreLive(app);
}

export function fieldStatsOpen(app) {
  return app.statsButton.isStats && controlsAreLive(app);
}

export function updateFieldButtonStates(app) {
  app.statsButton.enabled = controlsAreLive(app);
  app.fieldInstructionsButton.enabled = controlsAreLive(app);
}

export function drawThrowIndicator(app) {
  if (!(app.throwing && app.oFormation.QB.cy > app.lineOfScrimmage)) return;
  const opacityScale = 55 / app.maxBallVelo;
  const circleScale = 2.5;
  drawCircle(app.mouseX, app.mouseY, app.ballVelocity * circleScale, {
    fill: THROW_AIM_COLOR,
    opacity: app.ballVelocity * opacityScale,
  });
}

export function drawThrowPowerBar(app) {
  if (!(app.throwing && app.oFormation.QB.cy > app.lineOfScrimmage)) return;
  const fraction = Math.min(app.ballVelocity / app.maxBallVelo, 1);
  const centerX = rightControlX(app);
  const barBaseY = app.height - 64;
  const lift = 2 * app.yardStep;
  const labelY = barBaseY - POWER_BAR_GAP_ABOVE_BASE - lift;
  const trackBottom = labelY - POWER_BAR_LABEL_GAP;
  const trackTop = trackBottom - POWER_BAR_LENGTH;
  const trackCenterY = Math.floor((trackTop + trackBottom) / 2);
  const halfThick = Math.floor(POWER_BAR_THICKNESS / 2);
  drawRect(centerX, trackCenterY, POWER_BAR_THICKNESS, POWER_BAR_LENGTH, {
    fill: POWER_BAR_TRACK_COLOR,
    border: POWER_BAR_BORDER,
    borderWidth: HUD_PANEL_BORDER_WIDTH,
    align: "center",
    opacity: POWER_BAR_TRACK_OPACITY,
  });
  const fillColor =
    fraction >= POWER_BAR_FULL_THRESHOLD ? POWER_BAR_FILL_HIGH : POWER_BAR_FILL_LOW;
  const fillHeight = POWER_BAR_LENGTH * fraction;
  drawRect(
    centerX - halfThick,
    trackBottom - fillHeight,
    POWER_BAR_THICKNESS,
    fillHeight,
    { fill: fillColor, align: "left" }
  );
  drawLabel("POWER", centerX, labelY, {
    size: 11,
    bold: true,
    fill: HUD_TEXT_COLOR,
  });
}

export function drawFieldHud(app) {
  drawTopReadout(app);
}

export function drawTopReadout(app) {
  if (app.playResult !== "") {
    drawResultBanner(app);
  }
}

export function drawResultBanner(app) {
  const gainedYards = app.playResult.startsWith("Tackled");
  const color = gainedYards ? BANNER_GAIN_COLOR : BANNER_LOSS_COLOR;
  const centerX = Math.floor(app.width / 2);
  drawGlassPanel(
    centerX,
    HUD_TOP_Y,
    RESULT_BANNER_WIDTH,
    RESULT_BANNER_HEIGHT,
    color,
    RESULT_BANNER_OPACITY
  );
  if (gainedYards) {
    drawLabel(app.playResult, centerX, HUD_TOP_Y - 11, {
      size: 20,
      bold: true,
      fill: HUD_TEXT_COLOR,
    });
    const yardsText =
      (app.lastYardsRan >= 0 ? "+" : "") + String(app.lastYardsRan) + " yards";
    drawLabel(yardsText, centerX, HUD_TOP_Y + 13, {
      size: 15,
      bold: true,
      fill: HUD_TEXT_COLOR,
    });
  } else {
    drawLabel(app.playResult, centerX, HUD_TOP_Y, {
      size: 22,
      bold: true,
      fill: HUD_TEXT_COLOR,
    });
  }
}

