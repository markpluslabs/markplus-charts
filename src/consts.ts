const CONSTS = {
  FONT_FAMILY: "Courier New",
  FONT_SIZE: 16,

  get CHARACTER_WIDTH() {
    return this.FONT_SIZE * 0.6;
  },

  get LINE_HEIGHT() {
    return this.FONT_SIZE * 1.2;
  },

  get BASELINE_HEIGHT() {
    return this.LINE_HEIGHT * 0.75;
  },
};

export default CONSTS;
