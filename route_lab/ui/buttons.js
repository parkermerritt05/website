import { drawLabel, drawRect } from "../cmu-shim.js";
import {
  BUTTON_GREEN,
  BUTTON_OUTLINE_COLOR,
  BUTTON_OUTLINE_PAD_X,
  BUTTON_OUTLINE_PAD_Y,
  BUTTON_PRESS_SHIFT,
  DISABLED_LABEL_COLOR,
  DISABLED_OVERLAY_COLOR,
  DISABLED_OVERLAY_OPACITY,
  ENABLED_LABEL_COLOR,
  HOVER_OVERLAY_COLOR,
  HOVER_OVERLAY_OPACITY,
  INSTRUCTION_BUTTON_GREEN,
  PANEL_CLOSE_HALF,
  PANEL_CLOSE_INSET,
  PRESS_OVERLAY_COLOR,
  PRESS_OVERLAY_OPACITY,
  ROUTE_ACTIVE_BORDER,
  ROUTE_ACTIVE_BORDER_WIDTH,
  ROUTE_ICON_BOX,
  ROUTE_ICON_MARGIN,
  ROUTE_LABEL_SHIFT,
  ROUTE_LABEL_SIZE,
  START_BUTTON_LABEL_SIZE,
  START_BUTTON_RED,
  STATS_BUTTON_GREEN,
} from "../constants.js";
import { drawRouteIcon } from "./route-icons.js";

export class Button {
  constructor(cx, cy, w, h, text, fillColor = BUTTON_GREEN, labelSize = 18) {
    this.cx = cx;
    this.cy = cy;
    this.w = w;
    this.h = h;
    this.text = text;
    this.fillColor = fillColor;
    this.labelSize = labelSize;
    this.hovered = false;
    this.pressed = false;
    this.enabled = true;
  }

  contains(mx, my) {
    return (
      this.cx - Math.floor(this.w / 2) <= mx &&
      mx <= this.cx + Math.floor(this.w / 2) &&
      this.cy - Math.floor(this.h / 2) <= my &&
      my <= this.cy + this.h / 2
    );
  }

  isClicked(mx, my) {
    return this.enabled && this.contains(mx, my);
  }

  updateHover(mx, my) {
    this.hovered = this.enabled && this.contains(mx, my);
  }

  drawnCenter() {
    if (this.pressed) {
      return [this.cx + BUTTON_PRESS_SHIFT, this.cy + BUTTON_PRESS_SHIFT];
    }
    return [this.cx, this.cy];
  }

  draw() {
    const [cx, cy] = this.drawnCenter();
    this.drawOutline(cx, cy);
    drawRect(cx, cy, this.w, this.h, { fill: this.fillColor, align: "center" });
    this.drawStateOverlay(cx, cy);
    this.drawContent(cx, cy);
  }

  drawOutline(cx, cy) {
    if (this.pressed) return;
    drawRect(cx, cy, this.w + BUTTON_OUTLINE_PAD_X, this.h + BUTTON_OUTLINE_PAD_Y, {
      fill: BUTTON_OUTLINE_COLOR,
      align: "center",
    });
  }

  drawStateOverlay(cx, cy) {
    if (!this.enabled) {
      this.drawOverlay(cx, cy, DISABLED_OVERLAY_COLOR, DISABLED_OVERLAY_OPACITY);
    } else if (this.pressed) {
      this.drawOverlay(cx, cy, PRESS_OVERLAY_COLOR, PRESS_OVERLAY_OPACITY);
    } else if (this.hovered) {
      this.drawOverlay(cx, cy, HOVER_OVERLAY_COLOR, HOVER_OVERLAY_OPACITY);
    }
  }

  drawOverlay(cx, cy, color, opacity) {
    drawRect(cx, cy, this.w, this.h, { fill: color, opacity, align: "center" });
  }

  labelColor() {
    return this.enabled ? ENABLED_LABEL_COLOR : DISABLED_LABEL_COLOR;
  }

  drawContent(cx, cy) {
    drawLabel(this.text, cx, cy, {
      size: this.labelSize,
      bold: this.hovered && this.enabled,
      fill: this.labelColor(),
      align: "center",
    });
  }
}

export class FormationButton extends Button {
  constructor(cx, cy, w, h, text, formation) {
    super(cx, cy, w, h, text);
    this.formation = formation;
  }

  resetFormation(app, formation) {
    this.formation = formation;
  }
}

export class RouteButton extends Button {
  constructor(cx, cy, w, h, text, routes) {
    super(cx, cy, w, h, text, BUTTON_GREEN, ROUTE_LABEL_SIZE);
    this.leftRoute = routes[0];
    this.rightRoute = routes[1];
    this.iconRoute = routes[1];
    this.active = false;
  }

  drawContent(cx, cy) {
    const iconCenterX = cx - Math.floor(this.w / 2) + ROUTE_ICON_MARGIN;
    drawRouteIcon(iconCenterX, cy, ROUTE_ICON_BOX, this.iconRoute, this.labelColor());
    drawLabel(this.text, cx + ROUTE_LABEL_SHIFT, cy, {
      size: this.labelSize,
      bold: this.hovered && this.enabled,
      fill: this.labelColor(),
      align: "center",
    });
    if (this.active) {
      drawRect(cx, cy, this.w, this.h, {
        fill: "rgba(0,0,0,0)",
        border: ROUTE_ACTIVE_BORDER,
        borderWidth: ROUTE_ACTIVE_BORDER_WIDTH,
        align: "center",
      });
    }
  }
}

export class InstructionButton extends Button {
  constructor(cx, cy, w, h, text) {
    super(cx, cy, w, h, text, INSTRUCTION_BUTTON_GREEN);
    this.isInstructions = false;
  }
}

export class StartButton extends Button {
  constructor(cx, cy, w, h, text) {
    super(cx, cy, w, h, text, START_BUTTON_RED, START_BUTTON_LABEL_SIZE);
  }
}

export class StatsButton extends Button {
  constructor(cx, cy, w, h, text) {
    super(cx, cy, w, h, text, STATS_BUTTON_GREEN);
    this.isStats = false;
  }
}

export function visibleButtons(app) {
  if (app.isOffensiveMenu) {
    const routeButtons =
      app.selectedPlayer == null
        ? []
        : app.isWRMenu
          ? app.offensiveWRRouteButtons
          : app.offensiveRBRouteButtons;
    return [
      ...app.offensiveFormationButtons,
      ...routeButtons,
      app.startGameButton,
      app.menuInstructionsButton,
    ];
  }
  if (app.isField) {
    return [
      ...app.fieldButtons,
      app.fieldInstructionsButton,
      app.statsButton,
    ];
  }
  return [];
}

export function panelCloseCenter(panelCx, panelCy, panelW, panelH) {
  return [
    panelCx + Math.floor(panelW / 2) - PANEL_CLOSE_INSET,
    panelCy - Math.floor(panelH / 2) + PANEL_CLOSE_INSET,
  ];
}

export function panelCloseContains(mx, my, closeCx, closeCy) {
  const half = PANEL_CLOSE_HALF;
  return (
    closeCx - half <= mx &&
    mx <= closeCx + half &&
    closeCy - half <= my &&
    my <= closeCy + half
  );
}

export function releasePressedButton(app) {
  if (app.pressedButton != null) {
    app.pressedButton.pressed = false;
    app.pressedButton = null;
  }
}
