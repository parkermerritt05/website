import { applyBaseCombinations } from "./combinations.js";
import {
  Ball,
  Lineman,
  Quarterback,
  RunningBack,
  TightEnd,
  WideReceiver,
} from "../domain/index.js";
import { losY, midX } from "../ui/layout.js";

function offensiveLine(app, rtDepth = 13) {
  return {
    LT: new Lineman(midX(app, -50), losY(app, 18)),
    LG: new Lineman(midX(app, -25), losY(app, 13)),
    C: new Lineman(midX(app, 0), losY(app, 13)),
    RG: new Lineman(midX(app, 25), losY(app, 13)),
    RT: new Lineman(midX(app, 50), losY(app, rtDepth)),
  };
}

export function loadOffensiveFormations(app, firstTime = false) {
  app.singleBack = {
    WR1: new WideReceiver(app, midX(app, -190), losY(app, 13), 0, 0, app.route),
    WR2: new WideReceiver(app, midX(app, -130), losY(app, 33), 0, 0, app.route),
    ...offensiveLine(app, 13),
    TE: new TightEnd(app, midX(app, 75), losY(app, 28), 0, 0, app.route),
    WR3: new WideReceiver(app, midX(app, 160), losY(app, 13), 0, 0, app.route),
    QB: new Quarterback(midX(app, 0), losY(app, 40)),
    RB: new RunningBack(
      app, midX(app, 0), losY(app, 70), 0, 0, app.rbRouteList[2]
    ),
  };
  app.shotgun = {
    WR1: new WideReceiver(app, midX(app, -190), losY(app, 13), 0, 0, app.route),
    WR2: new WideReceiver(app, midX(app, -130), losY(app, 33), 0, 0, app.route),
    ...offensiveLine(app, 13),
    TE: new TightEnd(app, midX(app, 75), losY(app, 28), 0, 0, app.route),
    WR3: new WideReceiver(app, midX(app, 160), losY(app, 13), 0, 0, app.route),
    QB: new Quarterback(midX(app, 0), losY(app, 70)),
    RB: new RunningBack(
      app, midX(app, 35), losY(app, 70), 0, 0, app.rbRouteList[2]
    ),
  };
  app.spread = {
    WR1: new WideReceiver(app, midX(app, -200), losY(app, 13), 0, 0, app.route),
    WR2: new WideReceiver(app, midX(app, -160), losY(app, 33), 0, 0, app.route),
    ...offensiveLine(app, 18),
    WR3: new WideReceiver(app, midX(app, 160), losY(app, 33), 0, 0, app.route),
    WR4: new WideReceiver(app, midX(app, 225), losY(app, 13), 0, 0, app.route),
    QB: new Quarterback(midX(app, 0), losY(app, 70)),
    RB: new RunningBack(
      app, midX(app, 35), losY(app, 70), 0, 0, app.rbRouteList[2]
    ),
  };
  app.bunch = {
    WR1: new WideReceiver(app, midX(app, -190), losY(app, 13), 0, 0, app.route),
    WR2: new WideReceiver(app, midX(app, -160), losY(app, 27), 0, 0, app.route),
    WR3: new WideReceiver(app, midX(app, -120), losY(app, 15), 0, 0, app.route),
    ...offensiveLine(app, 18),
    WR4: new WideReceiver(app, midX(app, 225), losY(app, 13), 0, 0, app.route),
    QB: new Quarterback(midX(app, 0), losY(app, 70)),
    RB: new RunningBack(
      app, midX(app, 35), losY(app, 70), 0, 0, app.rbRouteList[2]
    ),
  };
  app.custom = {
    WR1: new WideReceiver(app, midX(app, -210), losY(app, 40), 0, 0, app.route),
    WR2: new WideReceiver(app, midX(app, -160), losY(app, 40), 0, 0, app.route),
    ...offensiveLine(app, 18),
    WR3: new WideReceiver(app, midX(app, 160), losY(app, 40), 0, 0, app.route),
    WR4: new WideReceiver(app, midX(app, 210), losY(app, 40), 0, 0, app.route),
    QB: new Quarterback(midX(app, 0), losY(app, 70)),
    RB: new RunningBack(
      app, midX(app, 35), losY(app, 70), 0, 0, app.rbRouteList[2]
    ),
  };
  app.oFormation = app.singleBack;
  applyBaseCombinations(app);
  app.ball = new Ball(
    app.oFormation.C.cx, app.oFormation.C.cy, app.oFormation.C
  );
}
