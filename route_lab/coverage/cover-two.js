import {
  DEFENSIVE_END_LEFT_FRACTION,
  DEFENSIVE_END_RIGHT_FRACTION,
  DEFENSIVE_TACKLE_LEFT_FRACTION,
  DEFENSIVE_TACKLE_RIGHT_FRACTION,
  DLINE_DEPTH_PX,
} from "../constants.js";
import {
  CornerBack,
  DefensiveEnd,
  DefensiveTackle,
  LineBacker,
  RunningBack,
  Safety,
  TightEnd,
  WideReceiver,
  getPlayersOfType,
} from "../domain/index.js";

export function buildDLine(app) {
  const depth = app.lineOfScrimmage - DLINE_DEPTH_PX;
  return {
    DE1: new DefensiveEnd(app.width * DEFENSIVE_END_LEFT_FRACTION, depth),
    DE2: new DefensiveEnd(app.width * DEFENSIVE_END_RIGHT_FRACTION, depth),
    DT1: new DefensiveTackle(app.width * DEFENSIVE_TACKLE_LEFT_FRACTION, depth),
    DT2: new DefensiveTackle(app.width * DEFENSIVE_TACKLE_RIGHT_FRACTION, depth),
  };
}

export function initializeCoverTwo(app) {
  const allEligible = [
    ...getPlayersOfType(app, WideReceiver),
    ...getPlayersOfType(app, TightEnd),
    ...getPlayersOfType(app, RunningBack),
  ];
  allEligible.sort((a, b) => a.cx - b.cx);
  const coverTwo = {};

  const fieldMid = Math.floor(app.width / 2);
  const leftEligible = allEligible.filter((p) => p.cx <= fieldMid);
  const rightEligible = allEligible.filter((p) => p.cx > fieldMid);
  const leftOutside = leftEligible.length
    ? leftEligible[0]
    : allEligible.length
      ? allEligible[0]
      : null;
  const rightOutside = rightEligible.length
    ? rightEligible[rightEligible.length - 1]
    : allEligible.length
      ? allEligible[allEligible.length - 1]
      : null;

  let leftCornerX = app.zones.leftFlat.cx;
  let rightCornerX = app.zones.rightFlat.cx;
  if (leftOutside !== null) {
    leftCornerX = Math.min(
      app.zones.leftFlat.right, leftOutside.cx + app.yardStep * 0.35
    );
  }
  if (rightOutside !== null) {
    rightCornerX = Math.max(
      app.zones.rightFlat.left, rightOutside.cx - app.yardStep * 0.35
    );
  }

  coverTwo.CB1 = new CornerBack(
    leftCornerX, app.lineOfScrimmage - app.yardStep * 1.5,
    0, 0, leftOutside, app.zones.leftFlat,
    "Cover 2", "left", "inside"
  );
  coverTwo.CB2 = new CornerBack(
    rightCornerX, app.lineOfScrimmage - app.yardStep * 1.5,
    0, 0, rightOutside, app.zones.rightFlat,
    "Cover 2", "right", "inside"
  );
  coverTwo.LB1 = new LineBacker(
    app.zones.leftHook.cx, app.lineOfScrimmage - app.yardStep * 4.2,
    0, 0, null, app.zones.leftHook, "Cover 2", "left"
  );
  coverTwo.LB2 = new LineBacker(
    app.zones.middleHook.cx, app.lineOfScrimmage - app.yardStep * 4.5,
    0, 0, null, app.zones.middleHook, "Cover 2", "middle"
  );
  coverTwo.LB3 = new LineBacker(
    app.zones.rightHook.cx, app.lineOfScrimmage - app.yardStep * 4.2,
    0, 0, null, app.zones.rightHook, "Cover 2", "right"
  );
  coverTwo.S1 = new Safety(
    app.zones.leftDeepHalf.cx, app.lineOfScrimmage - app.yardStep * 11.5,
    0, 0, null, app.zones.leftDeepHalf, "Cover 2", "left"
  );
  coverTwo.S2 = new Safety(
    app.zones.rightDeepHalf.cx, app.lineOfScrimmage - app.yardStep * 11.5,
    0, 0, null, app.zones.rightDeepHalf, "Cover 2", "right"
  );
  return { ...coverTwo, ...buildDLine(app) };
}
