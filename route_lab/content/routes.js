export function loadOffensiveRoutes(app) {
  const crossingLeft = [[10, -10], [10, -10]];
  const crossingRight = [[-10, -10], [-10, -10]];
  const slantLeft = [[0, -5], [15, -15]];
  const slantRight = [[0, -5], [-15, -15]];
  const quickOutLeft = [[0, -3], [-8, 0]];
  const quickOutRight = [[0, -3], [8, 0]];
  const shallowDigLeft = [[0, -5], [15, 0]];
  const shallowDigRight = [[0, -5], [-15, 0]];
  const deepDigLeft = [[0, -10], [15, 0]];
  const deepDigRight = [[0, -10], [-15, 0]];
  const shallowOutLeft = [[0, -5], [-8, 0]];
  const shallowOutRight = [[0, -5], [8, 0]];
  const deepOutLeft = [[0, -10], [-8, 0]];
  const deepOutRight = [[0, -10], [8, 0]];
  const shallowHitchLeft = [[0, -8], [2, 2]];
  const shallowHitchRight = [[0, -8], [-2, 2]];
  const deepHitchLeft = [[0, -12], [2, 3]];
  const deepHitchRight = [[0, -12], [-2, 3]];
  const postLeft = [[0, -12], [5, -10]];
  const postRight = [[0, -12], [-5, -10]];
  const cornerLeft = [[0, -12], [-5, -10]];
  const cornerRight = [[0, -12], [5, -10]];
  const go = [[0, -11], [0, -11]];
  const rbOutLeft = [[8, -4], [5, -2.5]];
  const rbOutRight = [[-8, -4], [-5, -2.5]];
  const rbZoneSit = [[0, -10], [0, 1]];

  app.wrRouteList = [
    crossingLeft, crossingRight, slantLeft, slantRight,
    quickOutLeft, quickOutRight, shallowDigLeft, shallowDigRight,
    deepDigLeft, deepDigRight, shallowOutLeft, shallowOutRight,
    deepOutLeft, deepOutRight, shallowHitchLeft, shallowHitchRight,
    deepHitchLeft, deepHitchRight, postLeft, postRight,
    cornerLeft, cornerRight, go,
  ];
  app.rbRouteList = [rbOutRight, rbOutLeft, rbZoneSit];
  app.route = go;
}
