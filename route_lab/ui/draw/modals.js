import { drawLabel, drawLine, drawRect } from "../../cmu-shim.js";
import {
  HUD_PANEL_BORDER,
  HUD_PANEL_BORDER_WIDTH,
  HUD_TEXT_COLOR,
  INSTR_PANEL_HEIGHT,
  INSTR_PANEL_OFFSET_Y,
  INSTR_PANEL_WIDTH,
  MODAL_BACKDROP_COLOR,
  MODAL_BACKDROP_OPACITY,
  MODAL_PANEL_BORDER,
  MODAL_PANEL_COLOR,
  MODAL_PANEL_OPACITY,
  PANEL_CLOSE_BOX,
  PANEL_CLOSE_BOX_OPACITY,
  PANEL_CLOSE_FILL,
  PANEL_CLOSE_HALF,
  PANEL_CLOSE_LINE,
  PANEL_CLOSE_LINE_OPACITY,
  STATS_PANEL_HEIGHT,
  STATS_PANEL_OFFSET_Y,
  STATS_PANEL_WIDTH,
} from "../../constants.js";
import { panelCloseCenter } from "../buttons.js";

export function drawGlassPanel(cx, cy, width, height, fill, opacity, border = HUD_PANEL_BORDER) {
  drawRect(cx, cy, width, height, {
    fill,
    border,
    borderWidth: HUD_PANEL_BORDER_WIDTH,
    align: "center",
    opacity,
  });
}

export function drawModalBackdrop(app) {
  drawRect(0, 0, app.width, app.height, {
    fill: MODAL_BACKDROP_COLOR,
    opacity: MODAL_BACKDROP_OPACITY,
  });
}

export function drawPanelCloseButton(panelCx, panelCy, panelW, panelH) {
  const [cx, cy] = panelCloseCenter(panelCx, panelCy, panelW, panelH);
  const half = PANEL_CLOSE_HALF;
  drawRect(cx, cy, PANEL_CLOSE_BOX, PANEL_CLOSE_BOX, {
    fill: PANEL_CLOSE_FILL,
    border: PANEL_CLOSE_LINE,
    borderWidth: 3,
    align: "center",
    opacity: PANEL_CLOSE_BOX_OPACITY,
  });
  drawLine(cx - half, cy - half, cx + half, cy + half, {
    fill: PANEL_CLOSE_LINE,
    lineWidth: 2,
    opacity: PANEL_CLOSE_LINE_OPACITY,
  });
  drawLine(cx - half, cy + half, cx + half, cy - half, {
    fill: PANEL_CLOSE_LINE,
    lineWidth: 2,
    opacity: PANEL_CLOSE_LINE_OPACITY,
  });
}

export function drawInstructionPanelFrame(app) {
  drawModalBackdrop(app);
  const panelCy = Math.floor(app.height / 2) - INSTR_PANEL_OFFSET_Y;
  drawGlassPanel(
    Math.floor(app.width / 2),
    panelCy,
    INSTR_PANEL_WIDTH,
    INSTR_PANEL_HEIGHT,
    MODAL_PANEL_COLOR,
    MODAL_PANEL_OPACITY,
    MODAL_PANEL_BORDER
  );
  drawLabel("Instructions:", Math.floor(app.width / 2), panelCy - 130, {
    size: 45,
    bold: true,
    fill: HUD_TEXT_COLOR,
  });
  drawPanelCloseButton(
    Math.floor(app.width / 2),
    panelCy,
    INSTR_PANEL_WIDTH,
    INSTR_PANEL_HEIGHT
  );
}

export function drawStatsMenu(app) {
  drawModalBackdrop(app);
  const centerX = Math.floor(app.width / 2);
  const baseY = Math.floor(app.height / 2) + STATS_PANEL_OFFSET_Y;
  drawGlassPanel(
    centerX,
    baseY,
    STATS_PANEL_WIDTH,
    STATS_PANEL_HEIGHT,
    MODAL_PANEL_COLOR,
    MODAL_PANEL_OPACITY,
    MODAL_PANEL_BORDER
  );
  drawPanelCloseButton(centerX, baseY, STATS_PANEL_WIDTH, STATS_PANEL_HEIGHT);
  drawLabel("Stats:", centerX, baseY - 100, {
    size: 45,
    bold: true,
    fill: HUD_TEXT_COLOR,
  });
  drawLabel("Total Yards Gained: " + String(app.totalYards), centerX - 200, baseY - 50, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  drawLabel(
    "Completions: " + String(app.numCompletions) + " / " + String(app.attempts),
    centerX - 200,
    baseY - 25,
    { size: 18, bold: true, align: "left", fill: HUD_TEXT_COLOR }
  );
  drawLabel("Interceptions: " + String(app.ints), centerX - 200, baseY, {
    size: 18,
    bold: true,
    align: "left",
    fill: HUD_TEXT_COLOR,
  });
  if (app.lastPlayResult !== "") {
    drawLabel(`Last Play Result: ${app.lastPlayResult}`, centerX - 200, baseY + 25, {
      size: 18,
      bold: true,
      align: "left",
      fill: HUD_TEXT_COLOR,
    });
    if (app.lastPlayResult !== "Intercepted") {
      drawLabel(`Yards on Last Play: ${app.lastYardsRan}`, centerX - 200, baseY + 50, {
        size: 18,
        bold: true,
        align: "left",
        fill: HUD_TEXT_COLOR,
      });
    } else {
      drawLabel("Yards on Last Play: N/A", centerX - 200, baseY + 50, {
        size: 18,
        bold: true,
        align: "left",
        fill: HUD_TEXT_COLOR,
      });
    }
  }
}
