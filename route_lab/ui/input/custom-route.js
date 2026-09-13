import { BOUNDARY_OFFSET, PLAYER_DRAW_RADIUS } from "../../constants.js";
import { distance } from "../../simulation/geometry.js";
import { releasePressedButton } from "../buttons.js";

export function onMouseDrag(app, mouseX, mouseY) {
  if (
    app.isOffensiveMenu &&
    app.selectedPlayer != null &&
    app.sideLineOffset + BOUNDARY_OFFSET <= mouseX &&
    mouseX <= app.width - app.sideLineOffset - BOUNDARY_OFFSET
  ) {
    extendCustomRoute(app, mouseX, mouseY);
  }
  if (app.isField && app.throwing) {
    app.mouseX = mouseX;
    app.mouseY = mouseY;
  }
}

export function releaseThrow(app, mouseX, mouseY) {
  if (!app.throwing) return;
  app.throwing = false;
  if (app.playResult !== "") return;
  if (app.ball.carrier !== app.oFormation.QB) return;
  if (app.oFormation.QB.cy < app.lineOfScrimmage) return;
  app.ball.throwToTarget(mouseX, mouseY, app);
}

export function extendCustomRoute(app, mouseX, mouseY) {
  const player = app.oFormation[app.selectedPlayer];
  if (!app.routeDragBegan) {
    beginCustomRouteDrag(app, player, mouseX, mouseY);
    return;
  }
  if (app.routeAwaitingExit) {
    if (pointInPlayerToken(player, mouseX, mouseY)) return;
    app.routeAwaitingExit = false;
    const [edgeX, edgeY] = projectOntoPlayerEdge(player, mouseX, mouseY);
    player.route = [
      [player.startX, player.startY],
      [edgeX, edgeY],
    ];
    player.routeName = null;
    return;
  }
  if (pointInPlayerToken(player, mouseX, mouseY)) return;
  player.route = [...player.route, [mouseX, mouseY]];
  player.routeName = null;
}

export function beginCustomRouteDrag(app, player, mouseX, mouseY) {
  app.routeDragBegan = true;
  app.pendingDeselect = null;
  if (pointInPlayerToken(player, mouseX, mouseY)) {
    player.route = [[player.startX, player.startY]];
    player.routeName = null;
    app.routeAwaitingExit = true;
    return;
  }
  app.routeAwaitingExit = false;
  player.route = [...player.route, [mouseX, mouseY]];
  player.routeName = null;
}

export function pointInPlayerToken(player, x, y) {
  return distance(player.cx, player.cy, x, y) <= PLAYER_DRAW_RADIUS;
}

export function projectOntoPlayerEdge(player, x, y) {
  const dx = x - player.cx;
  const dy = y - player.cy;
  const dist = distance(player.cx, player.cy, x, y);
  if (dist === 0) {
    return [player.cx, player.cy - PLAYER_DRAW_RADIUS];
  }
  const scale = PLAYER_DRAW_RADIUS / dist;
  return [player.cx + dx * scale, player.cy + dy * scale];
}

export function onMouseRelease(app, _mouseX, _mouseY) {
  releasePressedButton(app);
  if (
    app.pendingDeselect != null &&
    app.selectedPlayer === app.pendingDeselect &&
    !app.routeDragBegan
  ) {
    app.selectedPlayer = null;
  }
  app.pendingDeselect = null;
}
