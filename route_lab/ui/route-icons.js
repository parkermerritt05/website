import { drawCircle, drawLine } from "../cmu-shim.js";
import {
  ROUTE_ICON_ARROW_MAX_SEGMENT_RATIO,
  ROUTE_ICON_ARROW_SIZE,
  ROUTE_ICON_ARROW_SPREAD,
  ROUTE_ICON_START_DOT_RADIUS,
} from "../constants.js";
import { distance } from "../simulation/geometry.js";

export function routeWaypoints(route) {
  const points = [[0.0, 0.0]];
  let x = 0.0;
  let y = 0.0;
  for (const [dx, dy] of route) {
    x += dx;
    y += dy;
    points.push([x, y]);
  }
  return points;
}

export function drawRouteIcon(centerX, centerY, box, route, color) {
  const points = fitRouteToBox(routeWaypoints(route), centerX, centerY, box);
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    drawLine(x1, y1, x2, y2, { fill: color, lineWidth: 2 });
  }
  drawRouteArrowhead(points[points.length - 2], points[points.length - 1], color);
  const [startX, startY] = points[0];
  drawCircle(startX, startY, ROUTE_ICON_START_DOT_RADIUS, { fill: color });
}

export function drawRouteArrowhead(fromPoint, toPoint, color) {
  const [fromX, fromY] = fromPoint;
  const [toX, toY] = toPoint;
  const shaftAngle = Math.atan2(toY - fromY, toX - fromX);
  const barbLength = Math.max(
    routeArrowBarbLength(fromPoint, toPoint),
    ROUTE_ICON_ARROW_SIZE * 0.85
  );
  // Filled chevron so button icons stay crisp at small sizes.
  const leftX = toX + barbLength * Math.cos(shaftAngle + Math.PI + ROUTE_ICON_ARROW_SPREAD);
  const leftY = toY + barbLength * Math.sin(shaftAngle + Math.PI + ROUTE_ICON_ARROW_SPREAD);
  const rightX = toX + barbLength * Math.cos(shaftAngle + Math.PI - ROUTE_ICON_ARROW_SPREAD);
  const rightY = toY + barbLength * Math.sin(shaftAngle + Math.PI - ROUTE_ICON_ARROW_SPREAD);
  drawLine(toX, toY, leftX, leftY, { fill: color, lineWidth: 2 });
  drawLine(toX, toY, rightX, rightY, { fill: color, lineWidth: 2 });
  // Cap with a short filled tip via a second thick stroke toward the tip.
  drawLine(
    (leftX + rightX) / 2,
    (leftY + rightY) / 2,
    toX,
    toY,
    { fill: color, lineWidth: 2.5 }
  );
}

export function routeArrowBarbLength(fromPoint, toPoint) {
  const segmentLength = distance(...fromPoint, ...toPoint);
  return Math.max(
    3.5,
    Math.min(
      ROUTE_ICON_ARROW_SIZE,
      segmentLength * ROUTE_ICON_ARROW_MAX_SEGMENT_RATIO
    )
  );
}

export function fitRouteToBox(points, centerX, centerY, box) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const scale =
    (box - 6) / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1e-6);
  const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const midY = (Math.min(...ys) + Math.max(...ys)) / 2;
  return points.map(([x, y]) => [
    centerX + (x - midX) * scale,
    centerY + (y - midY) * scale,
  ]);
}
