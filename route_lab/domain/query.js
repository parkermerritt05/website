export function getPlayersOfType(app, PlayerClass) {
  return Object.values(app.oFormation).filter(
    (player) => player instanceof PlayerClass
  );
}
