import { BOUNDARY_OFFSET } from "../constants.js";
import { Zone } from "../domain/index.js";

export function loadZones(app) {
  const fieldLeft = app.sideLineOffset + BOUNDARY_OFFSET;
  const fieldRight = app.width - app.sideLineOffset - BOUNDARY_OFFSET;
  const fieldWidth = fieldRight - fieldLeft;
  const fieldMid = (fieldLeft + fieldRight) / 2;
  const los = app.lineOfScrimmage;
  const yard = app.yardStep;
  const zones = {};

  zones.middleDeep = new Zone(
    fieldWidth / 5 + fieldLeft,
    fieldRight - fieldWidth / 5,
    0,
    los - 10 * yard,
    fieldMid,
    los - 12 * yard
  );
  zones.middleIntermediate = new Zone(
    Math.floor(fieldWidth / 3) + fieldLeft,
    fieldRight - Math.floor(fieldWidth / 3),
    los - 9 * yard,
    los - 3 * yard
  );
  zones.leftDeepHalf = new Zone(
    fieldLeft, fieldMid, 0, los - 8 * yard,
    fieldLeft + fieldWidth * 0.25, los - 12 * yard
  );
  zones.rightDeepHalf = new Zone(
    fieldMid, fieldRight, 0, los - 8 * yard,
    fieldLeft + fieldWidth * 0.75, los - 12 * yard
  );
  zones.leftFlat = new Zone(
    fieldLeft,
    fieldLeft + fieldWidth * 0.28,
    los - 8 * yard,
    los + 2 * yard,
    fieldLeft + fieldWidth * 0.14,
    los - 3.5 * yard
  );
  zones.rightFlat = new Zone(
    fieldRight - fieldWidth * 0.28,
    fieldRight,
    los - 8 * yard,
    los + 2 * yard,
    fieldLeft + fieldWidth * 0.86,
    los - 3.5 * yard
  );
  zones.leftHook = new Zone(
    fieldLeft + fieldWidth * 0.18,
    fieldMid,
    los - 10 * yard,
    los - 2 * yard,
    fieldLeft + fieldWidth * 0.36,
    los - 6 * yard
  );
  zones.middleHook = new Zone(
    fieldLeft + fieldWidth * 0.36,
    fieldRight - fieldWidth * 0.36,
    los - 11 * yard,
    los - 3 * yard,
    fieldMid,
    los - 6.5 * yard
  );
  zones.rightHook = new Zone(
    fieldMid,
    fieldRight - fieldWidth * 0.18,
    los - 10 * yard,
    los - 2 * yard,
    fieldLeft + fieldWidth * 0.64,
    los - 6 * yard
  );
  app.zones = zones;
}
