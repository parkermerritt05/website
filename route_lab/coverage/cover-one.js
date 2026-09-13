import {
  CornerBack,
  LineBacker,
  RunningBack,
  Safety,
  TightEnd,
  WideReceiver,
  getPlayersOfType,
} from "../domain/index.js";
import { buildDLine } from "./cover-two.js";

export function initializeCoverOne(app) {
  const wrLocations = getPlayersOfType(app, WideReceiver);
  const teLocations = getPlayersOfType(app, TightEnd);
  const rbLocations = getPlayersOfType(app, RunningBack);
  const coverOne = {};
  assignCornersToReceivers(app, coverOne, wrLocations);
  const numZoneLBs = assignLinebackers(
    app, coverOne, wrLocations, teLocations, rbLocations
  );
  spreadZoneLinebackers(app, coverOne, numZoneLBs + rbLocations.length);
  Object.assign(coverOne, buildDLine(app));
  coverOne.S = new Safety(
    Math.floor(app.width / 2),
    app.lineOfScrimmage - app.yardStep * 12,
    0, 0, null, app.zones.middleDeep
  );
  return coverOne;
}

export function assignCornersToReceivers(app, coverage, wrLocations) {
  const los = app.lineOfScrimmage;
  wrLocations.forEach((wr, i) => {
    coverage[`CB${i + 1}`] = new CornerBack(
      wr.cx, los - (wr.cy - los), 0, 0, wr
    );
  });
}

export function assignLinebackers(
  app, coverage, wrLocations, teLocations, rbLocations
) {
  const los = app.lineOfScrimmage;
  const numLBs = 6 - wrLocations.length;
  const numCoverLBs = teLocations.length + rbLocations.length;
  const numZoneLBs = numLBs - numCoverLBs;
  for (let i = 0; i < numZoneLBs; i++) {
    coverage[`LB${i + 1}`] = new LineBacker(
      0, 0, 0, 0, null, app.zones.middleIntermediate
    );
  }
  rbLocations.forEach((rb, i) => {
    coverage[`LB${i + 1 + numZoneLBs}`] = new LineBacker(
      rb.cx, los - (rb.cy - los + 10), 0, 0, rb
    );
  });
  const numRBs = rbLocations.length;
  teLocations.forEach((te, i) => {
    coverage[`LB${i + 1 + numRBs + numZoneLBs}`] = new LineBacker(
      te.cx, los - (te.cy - los + 10), 0, 0, te
    );
  });
  return numZoneLBs;
}

export function spreadZoneLinebackers(app, coverage, totalLBs) {
  const los = app.lineOfScrimmage;
  for (let i = 0; i < totalLBs; i++) {
    const linebacker = coverage[`LB${i + 1}`];
    const xCoord =
      Math.floor((2 * app.width) / 5) +
      Math.floor(
        ((i + 1) * Math.floor(app.width / 5)) / (totalLBs + 1)
      );
    linebacker.cx = xCoord;
    linebacker.cy = los - app.yardStep * 4;
  }
}
