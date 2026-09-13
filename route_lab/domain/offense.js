import { drawLine } from "../cmu-shim.js";
import {
  CAMERA_SCROLL_YARDS,
  PLAYER_DRAW_RADIUS,
  ROUTE_COLOR_DEFAULT,
  ROUTE_FIELD_WIDTH,
} from "../constants.js";
import { clampX, distance } from "../simulation/geometry.js";
import { Player } from "./player.js";

export class SkillPlayer extends Player {
  constructor(app, cx, cy, dx = 0, dy = 0, route = null, translated = false) {
    super(cx, cy, dx, dy);
    this.targetX = this.cx + route[0][0] * app.yardStep;
    this.targetY = this.cy + route[0][1] * app.yardStep;
    this.routeName = null;
    if (!translated) {
      this.route = this.translateRoute(app, route);
    } else {
      this.route = route;
    }
  }

  runRoute(app) {
    let yardsRunAlready = 0;
    for (let i = 1; i < this.route.length; i++) {
      const currStep = this.route[i];
      const prevStep = this.route[i - 1];
      const step = [currStep[0] - prevStep[0], currStep[1] - prevStep[1]];
      const stepLength =
        (step[0] ** 2 + step[1] ** 2) ** 0.5 / app.yardStep;
      if (app.yardsRan >= stepLength + yardsRunAlready) {
        yardsRunAlready += stepLength;
        if (i === this.route.length - 1) {
          this.goToPoint(app);
          break;
        }
      } else {
        this.targetX = currStep[0];
        this.targetY = currStep[1];
        this.goToPoint(app);
        break;
      }
    }
    this.movePlayer(app);
  }

  translateRoute(app, route) {
    let newRoute = route.map(([x, y]) => [x * app.yardStep, y * app.yardStep]);
    newRoute = [[this.startX, this.startY], ...newRoute];
    for (let i = 1; i < newRoute.length; i++) {
      let [endX, endY] = newRoute[i];
      const [startX, startY] = newRoute[i - 1];
      endX += startX;
      endY += startY;
      newRoute[i] = [clampX(app, endX), endY];
    }
    return newRoute;
  }

  routeDrawPoint(index, cameraShift) {
    let [x, y] = this.route[index < 0 ? this.route.length + index : index];
    const resolved = index >= 0 ? index : this.route.length + index;
    if (resolved === 0) {
      [x, y] = this.routeStartOnRim();
    }
    return [x, y + cameraShift];
  }

  routeStartOnRim() {
    if (this.route.length < 2) {
      return [this.cx, this.cy - PLAYER_DRAW_RADIUS];
    }
    const [nextX, nextY] = this.route[1];
    const dx = nextX - this.cx;
    const dy = nextY - this.cy;
    const dist = distance(this.cx, this.cy, nextX, nextY);
    if (dist === 0) {
      return [this.cx, this.cy - PLAYER_DRAW_RADIUS];
    }
    const scale = PLAYER_DRAW_RADIUS / dist;
    return [this.cx + dx * scale, this.cy + dy * scale];
  }

  drawRoute(app, color = ROUTE_COLOR_DEFAULT) {
    if (this.route.length < 2) return;
    let offset = 0;
    if (app.ball.cy <= CAMERA_SCROLL_YARDS * app.yardStep) {
      offset = CAMERA_SCROLL_YARDS * app.yardStep - app.ball.cy;
    }
    for (let i = 1; i < this.route.length - 1; i++) {
      const [startX, startY] = this.routeDrawPoint(i - 1, offset);
      const [endX, endY] = this.routeDrawPoint(i, offset);
      drawLine(startX, startY, endX, endY, {
        fill: color,
        lineWidth: ROUTE_FIELD_WIDTH,
      });
    }
    const [prevX, prevY] = this.routeDrawPoint(-2, offset);
    let [arrowX, arrowY] = this.routeDrawPoint(-1, offset);
    arrowX = clampX(app, arrowX);
    drawLine(prevX, prevY, arrowX, arrowY, {
      fill: color,
      lineWidth: ROUTE_FIELD_WIDTH,
      arrowEnd: true,
    });
  }
}

export class WideReceiver extends SkillPlayer {
  constructor(app, cx, cy, dx = 0, dy = 0, route = null, translated = false) {
    super(app, cx, cy, dx, dy, route, translated);
  }
}

export class RunningBack extends SkillPlayer {
  constructor(app, cx, cy, dx = 0, dy = 0, route = null, translated = false) {
    super(app, cx, cy, dx, dy, route, translated);
  }
}

export class TightEnd extends SkillPlayer {
  constructor(app, cx, cy, dx = 0, dy = 0, route = null, translated = false) {
    super(app, cx, cy, dx, dy, route, translated);
  }
}

export class Quarterback extends Player {
  constructor(cx, cy, dx = 0, dy = 0) {
    super(cx, cy, dx, dy);
  }
}

export class Lineman extends Player {
  constructor(cx, cy, dx = 0, dy = 0) {
    super(cx, cy, dx, dy);
  }
}
