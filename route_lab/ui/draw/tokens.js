import { drawCircle, drawLabel } from "../../cmu-shim.js";
import {
  DEFENSE_FILL,
  OFFENSE_RED,
  OFFENSE_RED_SELECTED,
  PLAYER_DRAW_RADIUS,
  PLAYER_LABEL_COLOR,
  PLAYER_LABEL_SIZE,
  ROUTE_COLOR_DEFAULT,
  ROUTE_COLORS_BY_POSITION,
} from "../../constants.js";
import {
  Lineman,
  Quarterback,
  RunningBack,
  SkillPlayer,
  TightEnd,
  WideReceiver,
} from "../../domain/index.js";
import { cameraOffset } from "./field.js";

export function drawPlayerToken(cx, cy, fill, label = null, labelColor = PLAYER_LABEL_COLOR) {
  drawCircle(cx, cy, PLAYER_DRAW_RADIUS, { fill });
  if (label != null) {
    drawLabel(label, cx, cy, {
      size: PLAYER_LABEL_SIZE,
      bold: true,
      fill: labelColor,
    });
  }
}

export function offenseFill(selected) {
  return selected ? OFFENSE_RED_SELECTED : OFFENSE_RED;
}

export function skillPositionLabel(position, player) {
  if (player instanceof Lineman) return null;
  if (player instanceof Quarterback || position === "QB") return "QB";
  if (player instanceof RunningBack || position === "RB") return "RB";
  if (player instanceof TightEnd || position === "TE") return "TE";
  if (player instanceof WideReceiver || position.startsWith("WR")) return "WR";
  return null;
}

export function routeColorForPosition(position) {
  return ROUTE_COLORS_BY_POSITION[position] ?? ROUTE_COLOR_DEFAULT;
}

export function drawDefense(app) {
  const offset = cameraOffset(app);
  for (const player of Object.values(app.dFormation)) {
    const cy = player.cy + offset;
    if (cy < 0 || cy > app.height) continue;
    drawPlayerToken(player.cx, cy, DEFENSE_FILL);
  }
}

export function drawOffense(app) {
  const offset = cameraOffset(app);
  const showLabels = !app.playIsActive;
  for (const position of Object.keys(app.oFormation)) {
    const player = app.oFormation[position];
    const selected = app.selectedPlayer === position && app.isOffensiveMenu;
    const cy = player.cy + offset;
    if (cy < 0 || cy > app.height) continue;
    const label = showLabels ? skillPositionLabel(position, player) : null;
    drawPlayerToken(player.cx, cy, offenseFill(selected), label);
    if (player instanceof SkillPlayer && !app.playIsActive) {
      player.drawRoute(app, routeColorForPosition(position));
    }
  }
}

export function drawSideline(app) {
  const los = app.lineOfScrimmage;
  const homeBench = [
    [app.sideLineOffset - 10, los - 50],
    [app.sideLineOffset - 20, los - 25],
    [app.sideLineOffset - 20, los - 75],
    [app.sideLineOffset - 25, los - 100],
    [app.sideLineOffset - 25, los - 125],
    [42, 170],
    [41, 196],
    [40, 225],
    [46, 258],
    [45, 283],
    [43, 355],
    [47, 381],
    [46, 419],
    [42, 555],
    [44, 583],
    [40, 615],
    [42, 642],
  ];
  const awayBench = [
    [app.width - app.sideLineOffset + 4, los + 8],
    [app.width - app.sideLineOffset + 20, los + 30],
    [app.width - app.sideLineOffset + 20, los - 21],
    [app.width - app.sideLineOffset + 20, los - 50],
    [app.width - app.sideLineOffset + 20, los - 75],
    [app.width - 42, 175],
    [app.width - 45, 202],
    [app.width - 41, 229],
    [app.width - 48, 300],
    [app.width - 43, 331],
    [app.width - 46, 370],
    [app.width - 41, 405],
    [app.width - 41, 470],
    [app.width - 41, 504],
    [app.width - 45, 542],
    [app.width - 40, 642],
    [app.width - 49, 675],
    [app.width - 42, 702],
  ];
  for (const [x, y] of homeBench) {
    drawPlayerToken(x, y, OFFENSE_RED);
  }
  for (const [x, y] of awayBench) {
    drawPlayerToken(x, y, DEFENSE_FILL);
  }
}
