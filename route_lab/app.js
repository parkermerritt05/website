/**
 * Browser host for Route Lab (faithful port of games/route_lab Python app).
 * Desktop reference: games/route_lab/ (cmu_graphics). No import/export.
 */
import {
  initGamesKit,
  isGamesPaused,
  bindGameKeys,
  pingActivity,
} from "../kit/games-kit.js";
import {
  setDrawContext,
  preloadImage,
} from "./cmu-shim.js";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "./constants.js";
import { onAppStart } from "./app/lifecycle.js";
import { onResize } from "./ui/layout.js";
import { redrawAll } from "./ui/draw/index.js";
import {
  onMouseMove,
  onMouseDrag,
  onMousePress,
  onMouseRelease,
  releaseThrow,
  onKeyPress,
  onKeyHold,
  onKeyRelease,
  onStep,
} from "./ui/input/index.js";
import { releasePressedButton } from "./ui/buttons.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const stage = document.getElementById("stage");

canvas.tabIndex = 0;
canvas.style.outline = "none";
canvas.style.touchAction = "none";

initGamesKit();

const app = {};
const keysHeld = new Set();
/** pointerId -> "throw" | "ui" | "menu" */
const pointerRoles = new Map();
let throwPointerId = null;
let scale = 1;
let ox = 0;
let oy = 0;
let stepAcc = 0;
let lastTs = 0;

function resize() {
  const rect = stage.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));
  canvas.width = Math.floor(cssW * devicePixelRatio);
  canvas.height = Math.floor(cssH * devicePixelRatio);
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  scale = Math.min(cssW / DESIGN_WIDTH, cssH / DESIGN_HEIGHT);
  ox = (cssW - DESIGN_WIDTH * scale) / 2;
  oy = (cssH - DESIGN_HEIGHT * scale) / 2;
  // Keep logical size at design resolution (matches Python window metrics).
  if (app.width !== DESIGN_WIDTH || app.height !== DESIGN_HEIGHT) {
    app.width = DESIGN_WIDTH;
    app.height = DESIGN_HEIGHT;
    onResize(app);
  }
}

function toLogic(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - ox) / scale,
    y: (clientY - rect.top - oy) / scale,
  };
}

function mapKey(key) {
  if (key === " " || key === "Spacebar") return "space";
  if (key === "ArrowUp") return "up";
  if (key === "ArrowDown") return "down";
  if (key === "ArrowLeft") return "left";
  if (key === "ArrowRight") return "right";
  if (key.length === 1) return key.toLowerCase();
  return key.toLowerCase();
}

canvas.addEventListener("pointerdown", (e) => {
  pingActivity();
  canvas.focus({ preventScroll: true });
  canvas.setPointerCapture?.(e.pointerId);
  const { x, y } = toLogic(e.clientX, e.clientY);
  const role = onMousePress(app, x, y, e.pointerId);
  if (role === "throw") throwPointerId = e.pointerId;
  pointerRoles.set(e.pointerId, role || "ui");
});

canvas.addEventListener("pointermove", (e) => {
  const { x, y } = toLogic(e.clientX, e.clientY);
  onMouseMove(app, x, y);
  const role = pointerRoles.get(e.pointerId);
  if (role === "throw" || (role == null && e.pointerId === throwPointerId)) {
    onMouseDrag(app, x, y);
    pingActivity();
  } else if (role === "menu" || (!app.isField && pointerRoles.has(e.pointerId))) {
    onMouseDrag(app, x, y);
  }
});

function endPointer(e) {
  if (!pointerRoles.has(e.pointerId)) return;
  const role = pointerRoles.get(e.pointerId);
  pointerRoles.delete(e.pointerId);
  const { x, y } = toLogic(e.clientX, e.clientY);
  if (e.pointerId === throwPointerId || role === "throw") {
    throwPointerId = null;
    releasePressedButton(app);
    releaseThrow(app, x, y);
    return;
  }
  onMouseRelease(app, x, y);
}

canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);

bindGameKeys(
  (e) => {
    pingActivity();
    const key = mapKey(e.key);
    if (["up", "down", "left", "right", "space"].includes(key)) {
      e.preventDefault();
    }
    if (e.repeat) return;
    keysHeld.add(key);
    onKeyPress(app, key);
  },
  (e) => {
    const key = mapKey(e.key);
    keysHeld.delete(key);
    onKeyRelease(app, key);
  }
);

window.addEventListener("resize", resize);

function frame(ts) {
  if (!lastTs) lastTs = ts;
  const dt = Math.min(0.05, (ts - lastTs) / 1000);
  lastTs = ts;

  if (!isGamesPaused()) {
    if (keysHeld.size) {
      onKeyHold(app, keysHeld);
    }
    stepAcc += dt;
    const stepDt = 1 / 40;
    while (stepAcc >= stepDt) {
      onStep(app);
      stepAcc -= stepDt;
    }
  }

  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);
  // Letterbox background
  ctx.fillStyle = "#0a3d1c";
  ctx.fillRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  setDrawContext(ctx);
  redrawAll(app);
  ctx.restore();
  requestAnimationFrame(frame);
}

async function boot() {
  await preloadImage("routeLabLogo.png");
  onAppStart(app);
  resize();
  requestAnimationFrame(frame);
}

boot();
