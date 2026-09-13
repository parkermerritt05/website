export class Zone {
  constructor(left, right, top, bottom, cx = null, cy = null) {
    this.cx = cx != null ? cx : (left + right) / 2;
    this.cy = cy != null ? cy : (top + bottom) / 2;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }
}
