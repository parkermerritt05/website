const HALF_TURN_DEGREES = 180;
const SPIN_DEGREES = 180;

function spinCoin(coinButton, coinInner) {
  const previousRotation = Number(coinInner.dataset.rotation || 0);
  const nextRotation = previousRotation + SPIN_DEGREES;
  coinInner.dataset.rotation = String(nextRotation);
  coinInner.style.transform = `rotateY(${nextRotation}deg)`;
  updatePressedState(coinButton, nextRotation);
}

function updatePressedState(coinButton, rotation) {
  const showingBack = (rotation / HALF_TURN_DEGREES) % 2 !== 0;
  coinButton.setAttribute("aria-pressed", String(showingBack));
}

function bindCoinFlip() {
  const coinButton = document.querySelector("[data-coin]");
  const coinInner = document.querySelector("[data-coin-inner]");
  if (!coinButton || !coinInner) {
    return;
  }

  coinButton.addEventListener("click", () => spinCoin(coinButton, coinInner));
}

document.addEventListener("DOMContentLoaded", bindCoinFlip);
