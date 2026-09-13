import { drawLabel, drawLine, drawRect } from "../../cmu-shim.js";
import {
  BOUNDARY_OFFSET,
  CAMERA_SCROLL_YARDS,
  END_ZONE_GREEN,
  END_ZONE_YARDS,
  FIELD_APRON,
  FIELD_GREEN,
  FIELD_GREEN_STRIPE,
  FIELD_LENGTH_YARDS,
  GOAL_LINE_WIDTH,
  GOAL_LINE_YARDS,
  HASH_MARK_COLOR,
  HASH_MARK_LENGTH,
  LOS_COLOR,
  LOS_TICK_HALF,
  LOS_WIDTH,
  MOW_STRIPE_YARDS,
  SIDELINE_WIDTH,
  YARD_LINE_MAJOR,
  YARD_LINE_MAJOR_WIDTH,
  YARD_LINE_MINOR,
  YARD_LINE_MINOR_WIDTH,
  YARD_NUMBER_COLOR,
  YARD_NUMBER_SIZE,
} from "../../constants.js";
import { leftHashX, rightHashX } from "../../simulation/geometry.js";

export function cameraOffset(app) {
  if (app.ball.cy <= CAMERA_SCROLL_YARDS * app.yardStep) {
    return CAMERA_SCROLL_YARDS * app.yardStep - app.ball.cy;
  }
  return 0;
}

/** World Y of own goal (higher Y = toward bottom / own end zone). */
export function ownGoalWorldY(app) {
  const yardsBehindLos = FIELD_LENGTH_YARDS - GOAL_LINE_YARDS;
  return app.lineOfScrimmage + yardsBehindLos * app.yardStep;
}

export function opponentGoalWorldY(app) {
  return app.lineOfScrimmage - GOAL_LINE_YARDS * app.yardStep;
}

export function worldYForYard(app, yardsFromOwnGoal) {
  return ownGoalWorldY(app) - yardsFromOwnGoal * app.yardStep;
}

export function drawField(app, scrimmageLine = true) {
  drawMowStripes(app);
  drawEndZones(app);
  drawFieldApron(app);
  drawYardLines(app);
  if (scrimmageLine && !app.isPlayActive) {
    drawLineOfScrimmage(app);
  }
  drawSidelines(app);
}

export function drawMowStripes(app) {
  const offset = cameraOffset(app);
  const stripeHeight = app.yardStep * MOW_STRIPE_YARDS;
  const yardZeroY = app.height + app.yardStep;
  let index = 0;
  while (yardZeroY - index * stripeHeight + offset < app.height) {
    index -= 1;
  }
  while (yardZeroY - index * stripeHeight + offset > 0) {
    const worldTop = yardZeroY - (index + 1) * stripeHeight;
    const color = index % 2 === 0 ? FIELD_GREEN : FIELD_GREEN_STRIPE;
    drawRect(0, worldTop + offset, app.width, stripeHeight, { fill: color });
    index += 1;
  }
}

export function drawEndZones(app) {
  const offset = cameraOffset(app);
  const ownGoal = ownGoalWorldY(app);
  const oppGoal = opponentGoalWorldY(app);
  const depth = END_ZONE_YARDS * app.yardStep;
  fillVisibleBand(app, oppGoal - depth + offset, oppGoal + offset, END_ZONE_GREEN);
  fillVisibleBand(app, ownGoal + offset, ownGoal + depth + offset, END_ZONE_GREEN);
}

function fillVisibleBand(app, top, bottom, color) {
  const y0 = Math.max(0, Math.min(top, bottom));
  const y1 = Math.min(app.height, Math.max(top, bottom));
  if (y1 <= y0) return;
  drawRect(0, y0, app.width, y1 - y0, { fill: color });
}

export function drawFieldApron(app) {
  const leftX = app.sideLineOffset + BOUNDARY_OFFSET;
  const rightX = app.width - BOUNDARY_OFFSET - app.sideLineOffset;
  drawRect(0, 0, leftX, app.height, { fill: FIELD_APRON });
  drawRect(rightX, 0, app.width - rightX, app.height, { fill: FIELD_APRON });
}

export function drawLineOfScrimmage(app) {
  const offset = cameraOffset(app);
  const losY = app.lineOfScrimmage + offset;
  const left = BOUNDARY_OFFSET + app.sideLineOffset;
  const right = app.width - BOUNDARY_OFFSET - app.sideLineOffset;
  drawLine(left, losY, right, losY, { fill: LOS_COLOR, lineWidth: LOS_WIDTH });
  const tick = LOS_TICK_HALF;
  for (const hashX of [leftHashX(app), rightHashX(app)]) {
    drawLine(hashX, losY - tick, hashX, losY + tick, {
      fill: LOS_COLOR,
      lineWidth: LOS_WIDTH,
    });
  }
}

export function drawYardLines(app) {
  const offset = cameraOffset(app);
  const leftEdge = 30 + app.sideLineOffset;
  const rightEdge = app.width - 30 - app.sideLineOffset;
  if (app.yardStep <= 0) return;

  const minWorldY = -offset - app.yardStep;
  const maxWorldY = app.height - offset + app.yardStep;
  const minYard = -END_ZONE_YARDS;
  const maxYard = FIELD_LENGTH_YARDS + END_ZONE_YARDS;

  for (let yards = minYard; yards <= maxYard; yards++) {
    const worldY = worldYForYard(app, yards);
    if (worldY < minWorldY || worldY > maxWorldY) continue;
    const y = worldY + offset;
    if (yards === 0 || yards === FIELD_LENGTH_YARDS) {
      drawGoalLine(app, leftEdge, rightEdge, y);
      continue;
    }
    if (yards < 0 || yards > FIELD_LENGTH_YARDS) continue;
    if (yards % 5 === 0) {
      drawMajorYardLine(app, leftEdge, rightEdge, y, yards);
    } else {
      drawHashMarks(app, leftEdge, rightEdge, y);
    }
  }
}

export function drawGoalLine(app, leftEdge, rightEdge, y) {
  drawLine(leftEdge, y, rightEdge, y, {
    fill: YARD_LINE_MAJOR,
    lineWidth: GOAL_LINE_WIDTH,
  });
}

export function yardLineLabel(yardsFromOwnGoal) {
  if (yardsFromOwnGoal <= 0 || yardsFromOwnGoal >= FIELD_LENGTH_YARDS) return null;
  const n =
    yardsFromOwnGoal <= 50 ? yardsFromOwnGoal : FIELD_LENGTH_YARDS - yardsFromOwnGoal;
  if (n % 10 !== 0) return null;
  return `${Math.floor(n / 10)} 0`;
}

export function drawMajorYardLine(app, leftEdge, rightEdge, y, yardsFromOwnGoal) {
  const isTenYard = yardsFromOwnGoal % 10 === 0;
  const color = isTenYard ? YARD_LINE_MAJOR : YARD_LINE_MINOR;
  const width = isTenYard ? YARD_LINE_MAJOR_WIDTH : YARD_LINE_MINOR_WIDTH;
  drawLine(leftEdge, y, rightEdge, y, { fill: color, lineWidth: width });
  const label = yardLineLabel(yardsFromOwnGoal);
  if (label == null) return;
  drawLabel(label, 60 + app.sideLineOffset, y, {
    size: YARD_NUMBER_SIZE,
    fill: YARD_NUMBER_COLOR,
    rotateAngle: 90,
  });
  drawLabel(label, app.width - 60 - app.sideLineOffset, y, {
    size: YARD_NUMBER_SIZE,
    fill: YARD_NUMBER_COLOR,
    rotateAngle: 270,
  });
}

export function drawHashMarks(app, leftEdge, rightEdge, y) {
  const mark = HASH_MARK_LENGTH;
  drawLine(leftEdge, y, leftEdge + mark, y, { fill: HASH_MARK_COLOR });
  drawLine(rightEdge, y, rightEdge - mark, y, { fill: HASH_MARK_COLOR });
  drawLine(leftHashX(app), y, leftHashX(app) + mark, y, { fill: HASH_MARK_COLOR });
  drawLine(rightHashX(app), y, rightHashX(app) - mark, y, { fill: HASH_MARK_COLOR });
}

export function drawSidelines(app) {
  const leftX = app.sideLineOffset + BOUNDARY_OFFSET;
  const rightX = app.width - BOUNDARY_OFFSET - app.sideLineOffset;
  drawLine(leftX, 0, leftX, app.height, { fill: "white", lineWidth: SIDELINE_WIDTH });
  drawLine(rightX, 0, rightX, app.height, { fill: "white", lineWidth: SIDELINE_WIDTH });
}
