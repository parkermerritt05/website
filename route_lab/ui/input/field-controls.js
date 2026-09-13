import { resetApp } from "../../app/lifecycle.js";
import {
  clickedInstructionClose,
  clickedStatsClose,
} from "./selection.js";

export function canThrow(app) {
  return (
    app.isField &&
    app.playIsActive &&
    !app.isPaused &&
    app.playResult === "" &&
    app.ball.carrier === app.oFormation.QB
  );
}

/** @returns {"throw"|"ui"|null} what the press started */
export function handleFieldClick(app, mx, my) {
  checkFieldButtons(app, mx, my);
  if (
    app.statsButton.isClicked(mx, my) &&
    (app.playResult !== "" || app.isPaused)
  ) {
    app.statsButton.isStats = !app.statsButton.isStats;
    return "ui";
  }
  if (clickedStatsClose(app, mx, my)) {
    app.statsButton.isStats = false;
    return "ui";
  }
  if (
    app.fieldInstructionsButton.isClicked(mx, my) &&
    (app.playResult !== "" || app.isPaused)
  ) {
    app.fieldInstructionsButton.isInstructions =
      !app.fieldInstructionsButton.isInstructions;
    return "ui";
  }
  if (clickedInstructionClose(app, mx, my, app.fieldInstructionsButton)) {
    app.fieldInstructionsButton.isInstructions =
      !app.fieldInstructionsButton.isInstructions;
    return "ui";
  }
  if (canThrow(app) && !app.throwing) {
    startThrow(app, mx, my);
    return "throw";
  }
  return null;
}

export function startThrow(app, mx, my) {
  if (!canThrow(app) || app.throwing) return;
  app.ballVelocity = 1;
  app.qbRun = false;
  app.throwing = true;
  app.mouseX = mx;
  app.mouseY = my;
}

export function checkFieldButtons(app, mx, my) {
  for (const button of app.fieldButtons) {
    if (button.isClicked(mx, my)) {
      if (button.text === "Reset") {
        app.isPlayActive = false;
        app.statsButton.isStats = false;
        app.fieldInstructionsButton.isInstructions = false;
        resetApp(app);
        return;
      }
      app.isPlayActive = false;
      app.menuInstructionsButton.isInstructions = false;
      resetApp(app);
      app.isField = false;
      app.isOffensiveMenu = true;
      return;
    }
  }
}
