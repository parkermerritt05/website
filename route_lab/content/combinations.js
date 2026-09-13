export const WR_PAIRS = [
  ["Crossing", 0, 2],
  ["Slant", 2, 4],
  ["Quick Out", 4, 6],
  ["Shallow Out", 10, 12],
  ["Deep Out", 12, 14],
  ["Shallow Dig", 6, 8],
  ["Deep Dig", 8, 10],
  ["Shallow Hitch", 14, 16],
  ["Deep Hitch", 16, 18],
  ["Post", 18, 20],
  ["Corner", 20, 22],
];

export const COMBINATION_NAMES = {
  singleBack: "Smash",
  shotgun: "Mesh",
  spread: "Sail",
  bunch: "Levels",
  custom: "Four Verts",
};

export function baseCombinations() {
  const smash = {
    WR1: "Shallow Hitch",
    WR2: "Corner",
    TE: "Deep Dig",
    WR3: "Go",
    RB: "RB Zone Sit",
  };
  const mesh = {
    WR1: "Go",
    WR2: "Crossing",
    TE: "Crossing",
    WR3: "Deep Dig",
    RB: "RB Zone Sit",
  };
  const sail = {
    WR1: "Post",
    WR2: "Crossing",
    WR3: "Deep Out",
    WR4: "Go",
    RB: "RB Out",
  };
  const levels = {
    WR1: "Shallow Dig",
    WR2: "Deep Dig",
    WR3: "Corner",
    WR4: "Go",
    RB: "RB Zone Sit",
  };
  const fourVerts = {
    WR1: "Go",
    WR2: "Go",
    WR3: "Go",
    WR4: "Go",
    RB: "RB Zone Sit",
  };
  return {
    singleBack: smash,
    shotgun: mesh,
    spread: sail,
    bunch: levels,
    custom: fourVerts,
  };
}

export function applyBaseCombinations(app) {
  app.combinationNames = { ...COMBINATION_NAMES };
  for (const [formationName, combo] of Object.entries(baseCombinations())) {
    const formation = app[formationName];
    applyCombination(app, formation, combo);
  }
}

export function applyCombination(app, formation, combo) {
  for (const [position, routeName] of Object.entries(combo)) {
    const player = formation[position];
    const route = resolveRoute(app, player, routeName);
    player.route = player.translateRoute(app, route);
    player.routeName = routeName;
    player.targetX = player.cx + route[0][0] * app.yardStep;
    player.targetY = player.cy + route[0][1] * app.yardStep;
  }
}

export function resolveRoute(app, player, routeName) {
  const [leftRoute, rightRoute] = routePair(app, routeName);
  if (player.cx <= Math.floor(app.width / 2)) {
    return leftRoute;
  }
  return rightRoute;
}

export function routePair(app, routeName) {
  if (routeName === "RB Out") {
    return [app.rbRouteList[0], app.rbRouteList[1]];
  }
  if (routeName === "RB Zone Sit") {
    const sit = app.rbRouteList[2];
    return [sit, sit];
  }
  if (routeName === "Go") {
    const go = app.wrRouteList[22];
    return [go, go];
  }
  for (const [name, start, end] of WR_PAIRS) {
    if (name === routeName) {
      return [app.wrRouteList[start], app.wrRouteList[end - 1]];
    }
  }
  throw new Error(`Unknown route name: ${routeName}`);
}
