import { rgb } from "./cmu-shim.js";

export const DESIGN_WIDTH = 1000;
export const DESIGN_HEIGHT = 750;
export const DESIGN_SIDELINE = 194;
export const DESIGN_YARD_STEP = 20;

export const PLAYER_DRAW_RADIUS = 13;
export const PLAYER_HIT_RADIUS = 10;
export const PLAYER_COLLISION_RADIUS = 10;
export const BOUNDARY_OFFSET = 20;
export const TACKLE_RANGE = 15;
export const DEFENDER_SIDELINE_CLAMP = 24;

export const SCRIMMAGE_YARDS_FROM_BOTTOM = 14;
export const CAMERA_SCROLL_YARDS = 10;
/** Yards from LOS to the opponent goal line (LOS is on the own 15). */
export const GOAL_LINE_YARDS = 85;
export const FIELD_LENGTH_YARDS = 100;
export const END_ZONE_YARDS = 10;
export const DLINE_DEPTH_PX = 10;
export const QB_DROPBACK_YARDS = 3;

export const DEFENSIVE_END_LEFT_FRACTION = 205 / 500;
export const DEFENSIVE_END_RIGHT_FRACTION = 293 / 500;
export const DEFENSIVE_TACKLE_LEFT_FRACTION = 238 / 500;
export const DEFENSIVE_TACKLE_RIGHT_FRACTION = 263 / 500;

export const SNAP_BALL_VELOCITY = 4;
export const THROW_START_HEIGHT = 5;
export const CATCH_HEIGHT = 6;
export const DEFLECT_HEIGHT = 8;
export const BALL_ARC_ACCELERATION = 0.01;

export const MAN_JAM_YARDS = 3;
export const MAN_BACKPEDAL_DEPTH_YARDS = 5;

export const COLLISION_OVERLAP_THRESHOLD = 7;
export const COLLISION_PUSH = 0.5;

export const FIELD_GREEN = rgb(28, 138, 80);
export const FIELD_GREEN_STRIPE = rgb(32, 146, 86);
export const FIELD_APRON = rgb(14, 88, 50);
export const END_ZONE_GREEN = rgb(22, 118, 68);
export const GOAL_LINE_WIDTH = 4;
export const MOW_STRIPE_YARDS = 5;
export const YARD_LINE_MAJOR = "white";
export const YARD_LINE_MINOR = rgb(210, 225, 215);
export const HASH_MARK_COLOR = rgb(200, 215, 205);
export const YARD_NUMBER_COLOR = rgb(220, 235, 225);
export const LOS_COLOR = rgb(245, 180, 55);
export const LOS_WIDTH = 3;
export const LOS_TICK_HALF = 8;
export const SIDELINE_WIDTH = 5;
export const YARD_LINE_MAJOR_WIDTH = 2;
export const YARD_LINE_MINOR_WIDTH = 1;
export const HASH_MARK_LENGTH = 8;
export const YARD_NUMBER_SIZE = 16;

export const OFFENSE_RED = rgb(215, 80, 75);
export const OFFENSE_RED_SELECTED = rgb(180, 30, 50);
export const DEFENSE_FILL = rgb(245, 248, 250);
export const PLAYER_LABEL_SIZE = 9;
export const PLAYER_LABEL_COLOR = "white";

export const ROUTE_FIELD_WIDTH = 3;
export const ROUTE_COLOR_DEFAULT = rgb(196, 148, 42);
export const ROUTE_COLORS_BY_POSITION = {
  WR1: rgb(196, 148, 42),
  WR2: rgb(38, 120, 128),
  WR3: rgb(168, 64, 96),
  WR4: rgb(56, 122, 78),
  TE: rgb(176, 92, 48),
  RB: rgb(72, 78, 140),
};

export const BALL_FILL = rgb(120, 72, 40);
export const BALL_LACE_COLOR = "white";
export const THROW_AIM_COLOR = rgb(120, 200, 140);

export const BUTTON_GREEN = rgb(19, 130, 60);
export const INSTRUCTION_BUTTON_GREEN = rgb(8, 110, 40);
export const START_BUTTON_RED = rgb(215, 80, 75);
export const STATS_BUTTON_GREEN = rgb(10, 70, 25);
export const START_BUTTON_WIDTH = 270;
export const START_BUTTON_HEIGHT = 90;
export const START_BUTTON_LABEL_SIZE = 36;

export const MENU_GREEN_LIGHT = rgb(27, 150, 85);
export const MENU_GREEN_MID = rgb(19, 130, 60);
export const MENU_GREEN_DARK = rgb(10, 110, 30);
export const MENU_RED = rgb(215, 80, 75);
export const MENU_RED_ACCENT = rgb(190, 90, 70);

export const BUTTON_OUTLINE_COLOR = rgb(8, 50, 25);
export const BUTTON_OUTLINE_PAD_X = 7;
export const BUTTON_OUTLINE_PAD_Y = 4.4;
export const BUTTON_PRESS_SHIFT = 2;
export const HOVER_OVERLAY_COLOR = "white";
export const HOVER_OVERLAY_OPACITY = 20;
export const PRESS_OVERLAY_COLOR = "black";
export const PRESS_OVERLAY_OPACITY = 28;
export const DISABLED_OVERLAY_COLOR = rgb(70, 70, 70);
export const DISABLED_OVERLAY_OPACITY = 55;
export const DISABLED_LABEL_COLOR = rgb(210, 210, 210);
export const ENABLED_LABEL_COLOR = "black";

export const ROUTE_ICON_BOX = 24;
export const ROUTE_ICON_MARGIN = 20;
export const ROUTE_ICON_COLOR = "black";
export const ROUTE_ICON_START_DOT_RADIUS = 2.5;
export const ROUTE_ICON_ARROW_SIZE = 5;
export const ROUTE_ICON_ARROW_SPREAD = 0.5;
export const ROUTE_ICON_ARROW_MAX_SEGMENT_RATIO = 0.4;
export const ROUTE_LABEL_SIZE = 15;
export const ROUTE_LABEL_SHIFT = 14;
export const ROUTE_ACTIVE_BORDER = rgb(255, 215, 110);
export const ROUTE_ACTIVE_BORDER_WIDTH = 3;

export const MODAL_BACKDROP_COLOR = "black";
export const MODAL_BACKDROP_OPACITY = 40;
export const MODAL_PANEL_COLOR = rgb(22, 40, 32);
export const MODAL_PANEL_BORDER = rgb(190, 210, 195);
export const MODAL_PANEL_OPACITY = 90;
export const INSTR_PANEL_WIDTH = 500;
export const INSTR_PANEL_HEIGHT = 350;
export const INSTR_PANEL_OFFSET_Y = 175;
export const STATS_PANEL_WIDTH = 500;
export const STATS_PANEL_HEIGHT = 270;
export const STATS_PANEL_OFFSET_Y = 200;

export const PANEL_CLOSE_INSET = 28;
export const PANEL_CLOSE_HALF = 10;
export const PANEL_CLOSE_BOX = 20;
export const PANEL_CLOSE_FILL = rgb(40, 55, 45);
export const PANEL_CLOSE_LINE = rgb(210, 220, 210);
export const PANEL_CLOSE_BOX_OPACITY = 70;
export const PANEL_CLOSE_LINE_OPACITY = 90;

export const HUD_TOP_Y = 44;
export const HUD_BOTTOM_MARGIN = 28;
export const HUD_TEXT_COLOR = "white";
export const HUD_PANEL_COLOR = rgb(22, 40, 32);
export const HUD_PANEL_BORDER = rgb(200, 220, 205);
export const HUD_PANEL_BORDER_WIDTH = 1;
export const HUD_PANEL_OPACITY = 82;
export const RESULT_BANNER_WIDTH = 300;
export const RESULT_BANNER_HEIGHT = 60;
export const RESULT_BANNER_OPACITY = 92;
export const BANNER_GAIN_COLOR = rgb(24, 110, 65);
export const BANNER_LOSS_COLOR = rgb(175, 55, 55);
export const PAUSE_HINT_WIDTH = 260;
export const PAUSE_HINT_HEIGHT = 34;
export const PAUSE_HINT_OPACITY = 78;

/** Vertical power bar: thickness across, length up the field. */
export const POWER_BAR_THICKNESS = 12;
export const POWER_BAR_LENGTH = 110;
/** Gap from the bottom baseline up to the POWER label. */
export const POWER_BAR_GAP_ABOVE_BASE = 14;
export const POWER_BAR_LABEL_GAP = 14;
export const POWER_BAR_TRACK_COLOR = rgb(22, 40, 32);
export const POWER_BAR_TRACK_OPACITY = 80;
export const POWER_BAR_BORDER = rgb(200, 220, 205);
export const POWER_BAR_FILL_LOW = rgb(60, 200, 90);
export const POWER_BAR_FILL_HIGH = rgb(220, 70, 60);
export const POWER_BAR_FULL_THRESHOLD = 0.85;

export const MENU_NODE_BASE_RADIUS = 18;
export const MENU_NODE_PULSE_AMPLITUDE = 3;
export const MENU_NODE_PULSE_SPEED = 0.12;
