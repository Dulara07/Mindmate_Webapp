export const manifest = {
  screens: {
    scr_y0eu9v: { name: "Voice Hub", route: "/", state: { "activeSection": "dashboard" }, position: { "x": 160, "y": 220 } },
    scr_0d849k: { name: "Mood Tracker", route: "/", state: { "activeSection": "mood" }, position: { "x": 1560, "y": 220 } },
    scr_0wk7pj: { name: "Relaxation", route: "/", state: { "activeSection": "breathing" }, position: { "x": 2960, "y": 220 } },
    scr_u1j4qd: { name: "Sleep", route: "/", state: { "activeSection": "sleep" }, position: { "x": 4360, "y": 220 } },
    scr_3zfgze: { name: "Learn", route: "/", state: { "activeSection": "learn" }, position: { "x": 5760, "y": 220 } },
    scr_i9hu6j: { name: "Crisis Mode", route: "/", state: { "isCrisisMode": true }, position: { "x": 7160, "y": 220 } }
  },
  sections: {
    sec_omdrmh: { name: "Main Dashboard", x: 0, y: 0, width: 8520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_omdrmh", children: [
    { kind: "screen", id: "scr_y0eu9v" },
    { kind: "screen", id: "scr_0d849k" },
    { kind: "screen", id: "scr_0wk7pj" },
    { kind: "screen", id: "scr_u1j4qd" },
    { kind: "screen", id: "scr_3zfgze" },
    { kind: "screen", id: "scr_i9hu6j" }]
  }]

};