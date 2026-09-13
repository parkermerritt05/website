import {
  START_BUTTON_HEIGHT,
  START_BUTTON_WIDTH,
} from "../constants.js";
import {
  Button,
  FormationButton,
  InstructionButton,
  RouteButton,
  StartButton,
  StatsButton,
} from "../ui/buttons.js";

export function loadOffensiveMenuButtons(app) {
  app.offensiveFormationButtons = [
    new FormationButton(95, 80, 130, 65, "Single Back", app.singleBack),
    new FormationButton(95, 170, 130, 65, "Shotgun", app.shotgun),
    new FormationButton(95, 260, 130, 65, "Spread", app.spread),
    new FormationButton(95, 350, 130, 65, "Bunch", app.bunch),
    new FormationButton(95, 440, 130, 65, "Custom", app.custom),
  ];
  app.menuInstructionsButton = new InstructionButton(
    105, 538, 175, 50, "Toggle Instructions"
  );
  app.fieldInstructionsButton = new InstructionButton(
    app.width - 100, 50, 180, 40, "Toggle Instructions"
  );
  app.offensiveWRRouteButtons = [
    new RouteButton(app.width - 95, 50, 130, 35, "Crossing", app.wrRouteList.slice(0, 2)),
    new RouteButton(app.width - 95, 110, 130, 35, "Slant", app.wrRouteList.slice(2, 4)),
    new RouteButton(app.width - 95, 170, 130, 35, "Quick Out", app.wrRouteList.slice(4, 6)),
    new RouteButton(app.width - 95, 230, 130, 35, "Shallow Out", app.wrRouteList.slice(10, 12)),
    new RouteButton(app.width - 95, 290, 130, 35, "Deep Out", app.wrRouteList.slice(12, 14)),
    new RouteButton(app.width - 95, 350, 130, 35, "Shallow Dig", app.wrRouteList.slice(6, 8)),
    new RouteButton(app.width - 95, 410, 130, 35, "Deep Dig", app.wrRouteList.slice(8, 10)),
    new RouteButton(app.width - 95, 470, 130, 35, "Shallow Hitch", app.wrRouteList.slice(14, 16)),
    new RouteButton(app.width - 95, 530, 130, 35, "Deep Hitch", app.wrRouteList.slice(16, 18)),
    new RouteButton(app.width - 95, 590, 130, 35, "Post", app.wrRouteList.slice(18, 20)),
    new RouteButton(app.width - 95, 650, 130, 35, "Corner", app.wrRouteList.slice(20, 22)),
    new RouteButton(app.width - 95, 710, 130, 35, "Go", [
      app.wrRouteList[22],
      app.wrRouteList[22],
    ]),
  ];
  app.startGameButton = new StartButton(
    Math.floor(app.width / 2),
    700,
    START_BUTTON_WIDTH,
    START_BUTTON_HEIGHT,
    "Start Game"
  );
  app.offensiveRBRouteButtons = [
    new RouteButton(app.width - 95, 50, 130, 35, "RB Out", app.rbRouteList.slice(0, 2)),
    new RouteButton(app.width - 95, 110, 130, 35, "RB Zone Sit", [
      app.rbRouteList[2],
      app.rbRouteList[2],
    ]),
  ];
}

export function loadFieldButtons(app) {
  const resetButton = new Button(
    Math.floor(app.sideLineOffset / 2), 40, 100, 50, "Reset"
  );
  const menuButton = new Button(
    Math.floor(app.sideLineOffset / 2), 110, 100, 50, "Menu"
  );
  app.fieldButtons = [resetButton, menuButton];
}

export function loadStats(app) {
  app.numCompletions = 0;
  app.attempts = 0;
  app.totalYards = 0;
  app.ints = 0;
  app.qbRun = true;
  app.statsButton = new StatsButton(app.width - 100, 130, 130, 40, "Stats");
}
