import { CoverPlayer } from "../domain/defense.js";
import { SkillPlayer } from "../domain/offense.js";
import { distance, getBallPlacement, pointInZone } from "./geometry.js";

export function coordinateCoverTwo(app) {
  const zoneDefenders = collectZoneDefenders(app);
  const threatMap = mapThreatsToDefenders(app, zoneDefenders);
  assignZoneHelp(zoneDefenders, threatMap);
}

function collectZoneDefenders(app) {
  const zoneDefenders = [];
  for (const player of Object.values(app.dFormation)) {
    if (player instanceof CoverPlayer && player.zone !== null) {
      zoneDefenders.push(player);
      player.helpTarget = null;
      player.callout = "";
      if (player.matchTarget !== null) {
        const [ballX, ballY] = getBallPlacement(player.matchTarget, app);
        if (!pointInZone(ballX, ballY, player.zone)) {
          player.matchTarget = null;
          player.callout = "Pass off!";
        }
      }
    }
  }
  return zoneDefenders;
}

function mapThreatsToDefenders(app, zoneDefenders) {
  const threatMap = new Map();
  for (const defender of zoneDefenders) {
    const threats = [];
    for (const offensivePlayer of Object.values(app.oFormation)) {
      if (!(offensivePlayer instanceof SkillPlayer)) continue;
      const [ballX, ballY] = getBallPlacement(offensivePlayer, app);
      if (pointInZone(ballX, ballY, defender.zone)) {
        const depth = app.lineOfScrimmage - ballY;
        threats.push([depth, offensivePlayer, ballX, ballY]);
      }
    }
    threats.sort((a, b) => b[0] - a[0]);
    threatMap.set(defender, threats);
  }
  return threatMap;
}

function assignZoneHelp(zoneDefenders, threatMap) {
  for (const defender of zoneDefenders) {
    const threats = threatMap.get(defender);
    if (threats.length <= 1) continue;
    const [, extraThreat, extraX, extraY] = threats[1];
    const helper = nearestHelper(zoneDefenders, defender, extraX, extraY);
    if (helper !== null && helper.helpTarget === null) {
      helper.helpTarget = extraThreat;
      defender.callout = "Need help!";
      helper.callout = "I got #2";
    }
  }
}

function nearestHelper(zoneDefenders, defender, threatX, threatY) {
  let helper = null;
  let helperDist = Infinity;
  for (const teammate of zoneDefenders) {
    if (teammate === defender) continue;
    if (!pointInZone(threatX, threatY, teammate.zone)) continue;
    const dist = distance(teammate.cx, teammate.cy, threatX, threatY);
    if (dist < helperDist) {
      helperDist = dist;
      helper = teammate;
    }
  }
  return helper;
}
