/**
 * Minimal cmu_graphics draw API over a Canvas2D context.
 * Call setDrawContext(ctx) before redrawAll.
 */

let ctx = null;
let images = new Map();

export function setDrawContext(c) {
  ctx = c;
}

export function rgb(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

export function gradient(...args) {
  // gradient(c1, c2, ..., start='left-top') — last named-like string is start
  let start = "left-top";
  const colors = [];
  for (const a of args) {
    if (typeof a === "string" && a.includes("-")) start = a;
    else colors.push(a);
  }
  return { __gradient: true, colors, start };
}

function applyFill(fill, x, y, w, h) {
  if (fill && fill.__gradient) {
    const g = makeGradient(fill, x, y, w, h);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = fill || "black";
  }
}

function makeGradient(spec, x, y, w, h) {
  let x0 = x;
  let y0 = y;
  let x1 = x + w;
  let y1 = y + h;
  if (spec.start === "left-top") {
    x1 = x + w;
    y1 = y + h;
  } else if (spec.start === "top") {
    x0 = x + w / 2;
    x1 = x + w / 2;
    y0 = y;
    y1 = y + h;
  }
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  const n = spec.colors.length;
  spec.colors.forEach((c, i) => g.addColorStop(n === 1 ? 0 : i / (n - 1), c));
  return g;
}

function parseOpts(opts, defaults = {}) {
  return {
    fill: opts.fill ?? defaults.fill ?? "black",
    border: opts.border ?? null,
    borderWidth: opts.borderWidth ?? 1,
    opacity: opts.opacity != null ? opts.opacity / 100 : 1,
    // cmu_graphics labels default to center; shapes often use left/top.
    align: opts.align ?? defaults.align ?? "left",
    rotateAngle: opts.rotateAngle || 0,
    lineWidth: opts.lineWidth ?? 1,
    size: opts.size ?? 12,
    bold: Boolean(opts.bold),
    italic: Boolean(opts.italic),
    font: opts.font || "sans-serif",
    arrowEnd: Boolean(opts.arrowEnd),
    width: opts.width,
    height: opts.height,
  };
}

/** Scale head with stroke so thick menu routes (lineWidth 7) stay readable. */
function arrowHeadLength(lineWidth) {
  return Math.max(lineWidth * 2.8, 16);
}

/** Filled triangular arrowhead; tip sits exactly at (x2, y2). */
function drawArrowHead(x1, y1, x2, y2, lineWidth, color) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 0.001) return;
  const ang = Math.atan2(dy, dx);
  const headLen = arrowHeadLength(lineWidth);
  const halfAngle = Math.PI / 6;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(ang - halfAngle),
    y2 - headLen * Math.sin(ang - halfAngle)
  );
  ctx.lineTo(
    x2 - headLen * Math.cos(ang + halfAngle),
    y2 - headLen * Math.sin(ang + halfAngle)
  );
  ctx.closePath();
  ctx.fill();
}

function withOpacity(opacity, fn) {
  ctx.save();
  ctx.globalAlpha *= opacity;
  fn();
  ctx.restore();
}

/** Clip subsequent draws to a rect (e.g. cut decorations at letterbox edge). */
export function withClip(x, y, w, h, fn) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  fn();
  ctx.restore();
}

export function drawRect(x, y, w, h, opts = {}) {
  const o = parseOpts(opts);
  let left = x;
  let top = y;
  if (o.align === "center") {
    left = x - w / 2;
    top = y - h / 2;
  }
  withOpacity(o.opacity, () => {
    if (o.fill != null) {
      applyFill(o.fill, left, top, w, h);
      ctx.fillRect(left, top, w, h);
    }
    if (o.border) {
      ctx.strokeStyle = o.border;
      ctx.lineWidth = o.borderWidth;
      ctx.strokeRect(left, top, w, h);
    }
  });
}

export function drawCircle(cx, cy, r, opts = {}) {
  const o = parseOpts(opts);
  withOpacity(o.opacity, () => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    if (o.fill != null) {
      ctx.fillStyle = o.fill;
      ctx.fill();
    }
    if (o.border) {
      ctx.strokeStyle = o.border;
      ctx.lineWidth = o.borderWidth;
      ctx.stroke();
    }
  });
}

export function drawOval(cx, cy, w, h, opts = {}) {
  const o = parseOpts(opts);
  withOpacity(o.opacity, () => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((-o.rotateAngle * Math.PI) / 180);
    ctx.scale(1, h / w);
    ctx.beginPath();
    ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
    if (o.fill != null) {
      ctx.fillStyle = o.fill;
      ctx.fill();
    }
    ctx.restore();
  });
}

export function drawLine(x1, y1, x2, y2, opts = {}) {
  const o = parseOpts(opts);
  withOpacity(o.opacity, () => {
    ctx.strokeStyle = o.fill;
    ctx.lineWidth = o.lineWidth;
    ctx.lineJoin = "round";
    let endX = x2;
    let endY = y2;
    if (o.arrowEnd) {
      // Butt cap + stop inside the head so the shaft never pokes past the tip.
      ctx.lineCap = "butt";
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const inset = Math.min(len * 0.55, arrowHeadLength(o.lineWidth) * 0.72);
      if (len > inset + 0.5) {
        endX = x2 - (dx / len) * inset;
        endY = y2 - (dy / len) * inset;
      }
    } else {
      ctx.lineCap = "round";
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    if (o.arrowEnd) {
      drawArrowHead(x1, y1, x2, y2, o.lineWidth, o.fill);
    }
  });
}

export function drawLabel(text, x, y, opts = {}) {
  // Match cmu_graphics: labels are center-aligned unless align is set.
  const o = parseOpts(opts, { align: "center" });
  const weight = o.bold ? "bold " : "";
  const style = o.italic ? "italic " : "";
  withOpacity(o.opacity, () => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((-o.rotateAngle * Math.PI) / 180);
    ctx.fillStyle = o.fill;
    ctx.font = `${style}${weight}${o.size}px ${o.font}`;
    if (o.align === "left") ctx.textAlign = "left";
    else if (o.align === "right") ctx.textAlign = "right";
    else ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(text), 0, 0);
    ctx.restore();
  });
}

export function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      images.set(src, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function drawImage(src, x, y, opts = {}) {
  const img = images.get(src);
  if (!img) return;
  const o = parseOpts(opts);
  const w = o.width ?? img.width;
  const h = o.height ?? img.height;
  let left = x;
  let top = y;
  if (o.align === "center") {
    left = x - w / 2;
    top = y - h / 2;
  }
  ctx.drawImage(img, left, top, w, h);
}
