import { releasePressedButton, visibleButtons } from "../buttons.js";
import { handleFieldClick } from "./field-controls.js";
import { handleMenuClick, inStartButton } from "./selection.js";

export function onMouseMove(app, mx, my) {
  if (app.isMainMenu) {
    app.isMainMenuLabelHovering = inStartButton(app, mx, my);
    return;
  }
  for (const button of visibleButtons(app)) {
    button.updateHover(mx, my);
  }
}

export function onMousePress(app, mx, my) {
  app.routeDragBegan = false;
  app.routeAwaitingExit = false;
  app.pendingDeselect = null;
  pressButtonUnderCursor(app, mx, my);
  if (app.isMainMenu) {
    handleMainMenuClick(app, mx, my);
    return null;
  }
  if (app.isField) {
    return handleFieldClick(app, mx, my);
  }
  if (app.isOffensiveMenu) {
    handleMenuClick(app, mx, my);
  }
  return null;
}

export function pressButtonUnderCursor(app, mx, my) {
  for (const button of visibleButtons(app)) {
    if (button.enabled && button.contains(mx, my)) {
      button.pressed = true;
      app.pressedButton = button;
      return;
    }
  }
}

export function handleMainMenuClick(app, mx, my) {
  if (inStartButton(app, mx, my)) {
    app.isMainMenuLabelHovering = false;
    app.isMainMenu = false;
    app.isOffensiveMenu = true;
  }
}
