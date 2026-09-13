import { loadZones } from "../content/zones.js";
import { initializeCoverOne } from "./cover-one.js";
import { initializeCoverTwo } from "./cover-two.js";

export function loadDefensiveFormations(app) {
  loadZones(app);
  app.dFormation = initializeDefense(app);
}

export function initializeDefense(app) {
  if (app.coverageShell === "Cover 2") {
    return initializeCoverTwo(app);
  }
  return initializeCoverOne(app);
}
