import { handleCollisions } from "../../simulation/collisions.js";
import { moveDefense, moveOffense } from "../../simulation/tick.js";

export function onStep(app) {
  app.animationTicks += 1;
  if (app.isPaused) {
    return;
  } else if (app.isField) {
    takeStep(app);
  }
}

export function takeStep(app) {
  app.steps += 1;
  app.playIsActive = true;
  if (app.throwing) {
    app.ballVelocity += 0.3;
    if (app.ballVelocity >= app.maxBallVelo) {
      app.ballVelocity = app.maxBallVelo;
    }
  }
  app.yardsRan = (app.velocity * app.steps) / app.yardStep;
  if (app.playResult === "") {
    moveDefense(app);
    moveOffense(app);
    handleCollisions(app);
  } else {
    app.throwing = false;
  }
  app.ball.updateBallPosition(app);
}
