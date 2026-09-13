/**
 * Minimal host kit for standalone browser games.
 * Provides the small surface consumed by Route Lab's app bootstrap.
 */

export function initGamesKit() {}

export function isGamesPaused() {
  return document.hidden;
}

export function bindGameKeys(onKeyDown, onKeyUp) {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}

export function pingActivity() {}
